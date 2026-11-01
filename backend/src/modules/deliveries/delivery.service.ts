import { supabase } from '../../database/supabase.js';

export async function requestDriver(
  orderNumber: string,
) {
  // Find the order.
  const { data: order, error: orderError } =
    await supabase
      .from('orders')
      .select(`
        id,
        order_number,
        branch_id,
        order_type,
        status,
        customer_name,
        customer_phone,
        delivery_address,
        total
      `)
      .eq('order_number', orderNumber)
      .single();

  if (orderError || !order) {
    throw new Error('Order not found');
  }

  if (order.order_type !== 'delivery') {
    throw new Error(
      'Drivers can only be requested for delivery orders',
    );
  }

  if (order.status !== 'ready') {
    throw new Error(
      'Order must be ready before requesting a driver',
    );
  }

  if (!order.delivery_address) {
    throw new Error(
      'Delivery address is missing',
    );
  }

  // Prevent duplicate deliveries.
  const {
    data: existingDelivery,
    error: existingError,
  } = await supabase
    .from('deliveries')
    .select('*')
    .eq('order_id', order.id)
    .maybeSingle();

  if (existingError) {
    throw new Error(
      `Failed to check delivery: ${existingError.message}`,
    );
  }

  if (existingDelivery) {
    throw new Error(
      'A delivery already exists for this order',
    );
  }

  // Create the delivery request.
  const {
    data: delivery,
    error: deliveryError,
  } = await supabase
    .from('deliveries')
    .insert({
      order_id: order.id,
      status: 'awaiting_driver',
      delivery_address: order.delivery_address,

      // Temporary flat driver earning.
      // We can calculate this properly later.
      driver_earnings: 2.5,
    })
    .select()
    .single();

  if (deliveryError || !delivery) {
    throw new Error(
      `Failed to create delivery: ${
        deliveryError?.message ?? 'Unknown error'
      }`,
    );
  }

  // Update order status.
  const {
    data: updatedOrder,
    error: updateError,
  } = await supabase
    .from('orders')
    .update({
      status: 'awaiting_driver',
    })
    .eq('id', order.id)
    .select()
    .single();

  if (updateError || !updatedOrder) {
    // Roll back delivery if order update fails.
    await supabase
      .from('deliveries')
      .delete()
      .eq('id', delivery.id);

    throw new Error(
      `Failed to update order: ${
        updateError?.message ?? 'Unknown error'
      }`,
    );
  }

  return {
    order: updatedOrder,
    delivery,
  };
}

export async function getAvailableDeliveries(
  driverCode: string,
) {
  // Find the driver so we know which branch they belong to.
  const {
    data: driver,
    error: driverError,
  } = await supabase
    .from('drivers')
    .select(`
      id,
      driver_code,
      full_name,
      branch_id,
      is_online,
      status
    `)
    .eq('driver_code', driverCode)
    .single();

  if (driverError || !driver) {
    throw new Error('Driver not found');
  }

  // Only show deliveries from the driver's branch.
  const {
    data: deliveries,
    error: deliveryError,
  } = await supabase
    .from('deliveries')
    .select(`
      id,
      order_id,
      driver_id,
      status,
      delivery_address,
      distance_km,
      estimated_minutes,
      earnings:driver_earnings,
      created_at,
      orders!inner (
        order_number,
        branch_id,
        customer_name,
        customer_phone,
        delivery_address,
        total,
        payment_method,
        created_at,
        order_items (
          id,
          item_name,
          variant_name,
          quantity,
          unit_price,
          total_price
        ),
        branches (
          id,
          name,
          address
        )
      )
    `)
    .eq('status', 'awaiting_driver')
    .eq('orders.branch_id', driver.branch_id)
    .order('created_at', {
      ascending: false,
    });

  if (deliveryError) {
    throw new Error(
      `Failed to load available deliveries: ${deliveryError.message}`,
    );
  }

  return {
    driver,
    deliveries: deliveries ?? [],
  };
}

export async function acceptDelivery(
  deliveryId: string,
  driverCode: string,
) {
  // Find driver
  const {
    data: driver,
    error: driverError,
  } = await supabase
    .from('drivers')
    .select(`
      id,
      driver_code,
      full_name,
      branch_id,
      status,
      is_online
    `)
    .eq('driver_code', driverCode)
    .single();

  if (driverError || !driver) {
    throw new Error('Driver not found');
  }

  if (!driver.is_online) {
    throw new Error(
      'Driver must be online to accept deliveries',
    );
  }

  if (driver.status !== 'available') {
    throw new Error(
      'Driver is not available',
    );
  }

  // Find delivery and its order
  const {
    data: delivery,
    error: deliveryError,
  } = await supabase
    .from('deliveries')
    .select(`
      id,
      order_id,
      driver_id,
      status,
      orders!inner (
        id,
        order_number,
        branch_id,
        status
      )
    `)
    .eq('id', deliveryId)
    .single();

  if (deliveryError || !delivery) {
    throw new Error('Delivery not found');
  }

  if (delivery.status !== 'awaiting_driver') {
    throw new Error(
      'This delivery is no longer available',
    );
  }

  if (delivery.driver_id) {
    throw new Error(
      'This delivery has already been assigned',
    );
  }

  const order = Array.isArray(delivery.orders)
    ? delivery.orders[0]
    : delivery.orders;

  if (!order) {
    throw new Error(
      'Order for this delivery was not found',
    );
  }

  if (order.branch_id !== driver.branch_id) {
    throw new Error(
      'Driver cannot accept deliveries from another branch',
    );
  }

  // Claim delivery.
  // We include the current status and null driver in the
  // update conditions so an already-claimed delivery is
  // less likely to be overwritten by another driver.
  const {
    data: claimedDelivery,
    error: claimError,
  } = await supabase
    .from('deliveries')
    .update({
      driver_id: driver.id,
      status: 'heading_to_restaurant',
      accepted_at: new Date().toISOString(),
    })
    .eq('id', deliveryId)
    .eq('status', 'awaiting_driver')
    .is('driver_id', null)
    .select()
    .maybeSingle();

  if (claimError) {
    throw new Error(
      `Failed to accept delivery: ${claimError.message}`,
    );
  }

  if (!claimedDelivery) {
    throw new Error(
      'Another driver has already accepted this delivery',
    );
  }

  // Driver becomes busy
  const {
    error: driverUpdateError,
  } = await supabase
    .from('drivers')
    .update({
      status: 'delivering',
    })
    .eq('id', driver.id);

  if (driverUpdateError) {
    throw new Error(
      `Failed to update driver: ${driverUpdateError.message}`,
    );
  }

  // Customer/branch order now knows a driver is assigned
  const {
    error: orderUpdateError,
  } = await supabase
    .from('orders')
    .update({
      status: 'driver_assigned',
    })
    .eq('id', order.id);

  if (orderUpdateError) {
    throw new Error(
      `Failed to update order: ${orderUpdateError.message}`,
    );
  }

  return {
    delivery: claimedDelivery,
    driver,
    order: {
      ...order,
      status: 'driver_assigned',
    },
  };
}

export type DriverDeliveryStatus =
  | 'arrived_at_restaurant'
  | 'picked_up'
  | 'on_the_way'
  | 'delivered';

export async function updateDeliveryStatus(
  deliveryId: string,
  driverCode: string,
  newStatus: DriverDeliveryStatus,
) {
  const {
    data: driver,
    error: driverError,
  } = await supabase
    .from('drivers')
    .select(`
      id,
      driver_code,
      full_name,
      status
    `)
    .eq('driver_code', driverCode)
    .single();

  if (driverError || !driver) {
    throw new Error('Driver not found');
  }

  const {
    data: delivery,
    error: deliveryError,
  } = await supabase
    .from('deliveries')
    .select(`
      id,
      order_id,
      driver_id,
      status,
      earnings:driver_earnings
    `)
    .eq('id', deliveryId)
    .single();

  if (deliveryError || !delivery) {
    throw new Error('Delivery not found');
  }

  if (delivery.driver_id !== driver.id) {
    throw new Error(
      'This delivery is not assigned to this driver',
    );
  }

  const allowedTransitions: Record<
    string,
    string[]
  > = {
    heading_to_restaurant: [
      'arrived_at_restaurant',
    ],

    arrived_at_restaurant: [
      'picked_up',
    ],

    picked_up: [
      'on_the_way',
    ],

    on_the_way: [
      'delivered',
    ],
  };

  const allowedNextStatuses =
    allowedTransitions[delivery.status] ?? [];

  if (
    !allowedNextStatuses.includes(newStatus)
  ) {
    throw new Error(
      `Cannot change delivery from ${delivery.status} to ${newStatus}`,
    );
  }

  const updateData: Record<string, unknown> = {
    status: newStatus,
  };

  if (newStatus === 'picked_up') {
    updateData.picked_up_at =
      new Date().toISOString();
  }

  if (newStatus === 'delivered') {
    updateData.delivered_at =
      new Date().toISOString();
  }

  const {
    data: updatedDelivery,
    error: updateError,
  } = await supabase
    .from('deliveries')
    .update(updateData)
    .eq('id', delivery.id)
    .eq('driver_id', driver.id)
    .select()
    .single();

  if (updateError || !updatedDelivery) {
    throw new Error(
      `Failed to update delivery: ${
        updateError?.message ??
        'Unknown error'
      }`,
    );
  }

  // Customer tracking should show that
  // the driver is travelling after pickup.
  if (newStatus === 'on_the_way') {
    const { error: orderError } =
      await supabase
        .from('orders')
        .update({
          status: 'on_the_way',
        })
        .eq('id', delivery.order_id);

    if (orderError) {
      throw new Error(
        `Failed to update order: ${orderError.message}`,
      );
    }
  }

  if (newStatus === 'delivered') {
    const { error: orderError } =
      await supabase
        .from('orders')
        .update({
          status: 'delivered',
        })
        .eq('id', delivery.order_id);

    if (orderError) {
      throw new Error(
        `Failed to complete order: ${orderError.message}`,
      );
    }

    const { error: driverUpdateError } =
      await supabase
        .from('drivers')
        .update({
          status: 'available',
        })
        .eq('id', driver.id);

    if (driverUpdateError) {
      throw new Error(
        `Failed to make driver available: ${driverUpdateError.message}`,
      );
    }

    // delivery_id is unique, so this also
    // protects against duplicate earnings.
    const { error: earningsError } =
      await supabase
        .from('driver_earnings')
        .insert({
          driver_id: driver.id,
          delivery_id: delivery.id,
          amount: Number(delivery.earnings),
          status: 'available',
        });

    if (earningsError) {
      throw new Error(
        `Failed to create driver earnings: ${earningsError.message}`,
      );
    }
  }

  return updatedDelivery;
}

export async function getDriverActiveDeliveries(
  driverCode: string,
) {
  const {
    data: driver,
    error: driverError,
  } = await supabase
    .from('drivers')
    .select(`
      id,
      driver_code,
      full_name,
      branch_id,
      is_online,
      status
    `)
    .eq('driver_code', driverCode)
    .single();

  if (driverError || !driver) {
    throw new Error('Driver not found');
  }

  const {
    data: deliveries,
    error: deliveryError,
  } = await supabase
    .from('deliveries')
    .select(`
      id,
      order_id,
      driver_id,
      status,
      delivery_address,
      distance_km,
      estimated_minutes,
      earnings:driver_earnings,
      created_at,
      accepted_at,
      picked_up_at,
      delivered_at,
      orders!inner (
        order_number,
        branch_id,
        customer_name,
        customer_phone,
        delivery_address,
        total,
        payment_method,
        created_at,
        order_items (
          id,
          item_name,
          variant_name,
          quantity,
          unit_price,
          total_price
        ),
        branches (
          id,
          name,
          address
        )
      )
    `)
    .eq('driver_id', driver.id)
    .in('status', [
      'heading_to_restaurant',
      'arrived_at_restaurant',
      'picked_up',
      'on_the_way',
    ])
    .order('created_at', {
      ascending: false,
    });

  if (deliveryError) {
    throw new Error(
      `Failed to load active deliveries: ${deliveryError.message}`,
    );
  }

  return {
    driver,
    deliveries: deliveries ?? [],
  };
}

export async function getDriverCompletedDeliveries(
  driverCode: string,
) {
  const {
    data: driver,
    error: driverError,
  } = await supabase
    .from('drivers')
    .select(`
      id,
      driver_code,
      full_name,
      branch_id,
      is_online,
      status
    `)
    .eq('driver_code', driverCode)
    .single();

  if (driverError || !driver) {
    throw new Error('Driver not found');
  }

  const {
    data: deliveries,
    error: deliveryError,
  } = await supabase
    .from('deliveries')
    .select(`
      id,
      order_id,
      driver_id,
      status,
      delivery_address,
      distance_km,
      estimated_minutes,
      earnings:driver_earnings,
      created_at,
      accepted_at,
      picked_up_at,
      delivered_at,
      orders!inner (
        order_number,
        branch_id,
        customer_name,
        customer_phone,
        delivery_address,
        total,
        payment_method,
        created_at,
        order_items (
          id,
          item_name,
          variant_name,
          quantity,
          unit_price,
          total_price
        ),
        branches (
          id,
          name,
          address
        )
      )
    `)
    .eq('driver_id', driver.id)
    .eq('status', 'delivered')
    .order('delivered_at', {
      ascending: false,
    });

  if (deliveryError) {
    throw new Error(
      `Failed to load completed deliveries: ${deliveryError.message}`,
    );
  }

  return {
    driver,
    deliveries: deliveries ?? [],
  };
}
