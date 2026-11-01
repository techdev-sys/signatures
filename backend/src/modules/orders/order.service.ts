import { supabase } from '../../database/supabase.js';

import type {
  CreateOrderInput,
  CreateOrderItemInput,
} from './order.types.js';

function generateOrderNumber() {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(10 + Math.random() * 90);

  return `SIG-${timestamp}${random}`;
}

function calculateItemTotal(item: CreateOrderItemInput) {
  return item.unitPrice * item.quantity;
}

export async function createOrder(input: CreateOrderInput) {
  // ---------------------------------------------------------
  // 1. Find branch
  // ---------------------------------------------------------

  const { data: branch, error: branchError } = await supabase
    .from('branches')
    .select('id, name, code, is_open, accepting_orders')
    .eq('code', input.branchCode)
    .single();

  if (branchError || !branch) {
    throw new Error('Branch not found');
  }

  if (!branch.is_open) {
    throw new Error('Branch is currently closed');
  }

  if (!branch.accepting_orders) {
    throw new Error('Branch is not accepting orders');
  }

  // ---------------------------------------------------------
  // 2. Validate items
  // ---------------------------------------------------------

  if (!input.items || input.items.length === 0) {
    throw new Error('Order must contain at least one item');
  }

  for (const item of input.items) {
    if (item.quantity <= 0) {
      throw new Error('Item quantity must be greater than zero');
    }

    if (item.unitPrice < 0) {
      throw new Error('Item price cannot be negative');
    }
  }

  // ---------------------------------------------------------
  // 3. Calculate totals
  // ---------------------------------------------------------

  const subtotal = input.items.reduce(
    (total, item) => total + calculateItemTotal(item),
    0,
  );

  const deliveryFee =
    input.orderType === 'delivery'
      ? 2.5
      : 0;

  const total = subtotal + deliveryFee;

  const orderNumber = generateOrderNumber();

  // ---------------------------------------------------------
  // 4. Create order
  // ---------------------------------------------------------

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      order_number: orderNumber,

      branch_id: branch.id,

      order_type: input.orderType,

      status: 'confirmed',

      customer_id: input.customerId,
      customer_name: input.customerName,
      customer_phone: input.customerPhone ?? null,

      delivery_address:
        input.orderType === 'delivery'
          ? input.deliveryAddress ?? null
          : null,

      subtotal,
      delivery_fee: deliveryFee,
      total,

      payment_method: input.paymentMethod ?? 'cash',

      payment_status: 'pending',

      notes: input.notes ?? null,
    })
    .select()
    .single();

  if (orderError || !order) {
    throw new Error(
      `Failed to create order: ${orderError?.message ?? 'Unknown error'}`,
    );
  }

  // ---------------------------------------------------------
  // 5. Create order items
  // ---------------------------------------------------------

  const orderItems = input.items.map((item) => ({
    order_id: order.id,

    menu_item_id: item.menuItemId ?? null,

    item_name: item.itemName,

    variant_name: item.variantName ?? null,

    quantity: item.quantity,

    unit_price: item.unitPrice,

    total_price: calculateItemTotal(item),
  }));

  const { data: createdItems, error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)
    .select();

  if (itemsError) {
    // Prevent leaving an empty order behind if item creation fails.
    await supabase
      .from('orders')
      .delete()
      .eq('id', order.id);

    throw new Error(
      `Failed to create order items: ${itemsError.message}`,
    );
  }

  return {
    ...order,

    branch: {
      id: branch.id,
      name: branch.name,
      code: branch.code,
    },

    items: createdItems,
  };
}

export async function getBranchOrders(branchCode: string) {
  const { data: branch, error: branchError } = await supabase
    .from('branches')
    .select('id, name, code')
    .eq('code', branchCode)
    .single();

  if (branchError || !branch) {
    throw new Error('Branch not found');
  }

  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select(`
      id,
      order_number,
      order_type,
      status,
      customer_name,
      customer_phone,
      delivery_address,
      subtotal,
      delivery_fee,
      total,
      payment_method,
      payment_status,
      notes,
      created_at,
      order_items (
        id,
        item_name,
        variant_name,
        quantity,
        unit_price,
        total_price
      ),
      deliveries (
        id,
        status,
        driver_id,
        accepted_at,
        picked_up_at,
        delivered_at,
        drivers (
          id,
          driver_code,
          full_name
        )
      )
    `)
    .eq('branch_id', branch.id)
    .order('created_at', {
      ascending: false,
    });

  if (ordersError) {
    throw new Error(
      `Failed to load branch orders: ${ordersError.message}`,
    );
  }

  return {
    branch,
    orders: orders ?? [],
  };
}

export async function updateOrderStatus(
  orderNumber: string,
  status: string,
) {
  const allowedStatuses = [
    'confirmed',
    'preparing',
    'ready',
    'awaiting_driver',
    'driver_assigned',
    'on_the_way',
    'delivered',
    'completed',
    'cancelled',
    'rejected',
  ];

  if (!allowedStatuses.includes(status)) {
    throw new Error('Invalid order status');
  }

  const { data: existingOrder, error: findError } =
    await supabase
      .from('orders')
      .select(`
        id,
        order_number,
        status,
        branch_id
      `)
      .eq('order_number', orderNumber)
      .single();

  if (findError || !existingOrder) {
    throw new Error('Order not found');
  }

  const { data: updatedOrder, error: updateError } =
    await supabase
      .from('orders')
      .update({
        status,
      })
      .eq('id', existingOrder.id)
      .select()
      .single();

  if (updateError || !updatedOrder) {
    throw new Error(
      `Failed to update order: ${
        updateError?.message ?? 'Unknown error'
      }`,
    );
  }

  return updatedOrder;
}

export async function getOrderTracking(
  orderNumber: string,
  customerId: string,
) {
  const { data: order, error } = await supabase
    .from('orders')
    .select(`
      id,
      order_number,
      order_type,
      status,
      customer_name,
      customer_phone,
      delivery_address,
      subtotal,
      delivery_fee,
      total,
      payment_method,
      payment_status,
      notes,
      created_at,
      branches (
        id,
        name,
        code,
        address,
        phone
      ),
      order_items (
        id,
        item_name,
        variant_name,
        quantity,
        unit_price,
        total_price
      ),
      deliveries (
        id,
        status,
        driver_id,
        distance_km,
        estimated_minutes,
        accepted_at,
        picked_up_at,
        delivered_at,
        created_at,
        drivers (
          id,
          driver_code,
          full_name,
          status
        )
      )
    `)
    .eq('order_number', orderNumber)
    .eq('customer_id', customerId)
    .single();

  if (error || !order) {
    throw new Error('Order not found');
  }

  return order;
}

export async function getCustomerOrders(
  customerId: string,
) {
  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      id,
      order_number,
      order_type,
      status,
      customer_name,
      customer_phone,
      delivery_address,
      subtotal,
      delivery_fee,
      total,
      payment_method,
      payment_status,
      notes,
      created_at,
      branches (
        id,
        name,
        code,
        address,
        phone
      ),
      order_items (
        id,
        item_name,
        variant_name,
        quantity,
        unit_price,
        total_price
      ),
      deliveries (
        id,
        status,
        driver_id,
        distance_km,
        estimated_minutes,
        accepted_at,
        picked_up_at,
        delivered_at,
        created_at,
        drivers (
          id,
          driver_code,
          full_name,
          status
        )
      )
    `)
    .eq('customer_id', customerId)
    .order('created_at', {
      ascending: false,
    });

  if (error) {
    throw new Error(
      `Failed to load customer orders: ${error.message}`,
    );
  }

  return orders ?? [];
}
