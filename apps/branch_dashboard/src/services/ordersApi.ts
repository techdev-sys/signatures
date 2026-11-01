export type ApiOrderItem = {
  id: string;
  item_name: string;
  variant_name: string | null;
  quantity: number;
  unit_price: string | number;
  total_price: string | number;
};

export type ApiAssignedDriver = {
  id: string;
  driver_code: string;
  full_name: string;
};

export type ApiOrderDelivery = {
  id: string;
  status: string;
  driver_id: string | null;
  accepted_at: string | null;
  picked_up_at: string | null;
  delivered_at: string | null;
  drivers:
    | ApiAssignedDriver
    | ApiAssignedDriver[]
    | null;
};

export type ApiOrder = {
  id: string;
  order_number: string;
  order_type: 'delivery' | 'pickup';
  status: string;

  customer_name: string;
  customer_phone: string | null;

  delivery_address: string | null;

  subtotal: string | number;
  delivery_fee: string | number;
  total: string | number;

  payment_method: string | null;
  payment_status: string;

  notes: string | null;

  created_at: string;

  order_items: ApiOrderItem[];

  deliveries:
    | ApiOrderDelivery[]
    | ApiOrderDelivery
    | null;
};

export type ApiOrderStatus =
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'awaiting_driver'
  | 'driver_assigned'
  | 'on_the_way'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'rejected';

type BranchOrdersResponse = {
  success: boolean;
  count: number;

  branch: {
    id: string;
    name: string;
    code: string;
  };

  data: ApiOrder[];
};

const API_URL = 'http://localhost:4000/api';

export async function getBranchOrders(
  branchCode: string,
): Promise<BranchOrdersResponse> {
  const response = await fetch(
    `${API_URL}/orders/branch/${branchCode}`,
  );

  const data = (await response.json()) as BranchOrdersResponse;

  if (!response.ok || !data.success) {
    throw new Error('Failed to load branch orders');
  }

  return data;
}

export async function updateOrderStatus(
  orderNumber: string,
  status: ApiOrderStatus,
) {
  const response = await fetch(
    `${API_URL}/orders/${orderNumber}/status`,
    {
      method: 'PATCH',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        status,
      }),
    },
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.message ??
        'Failed to update order status',
    );
  }

  return data.data;
}

export async function requestDriver(
  orderNumber: string,
) {
  const response = await fetch(
    `${API_URL}/deliveries/request`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        orderNumber,
      }),
    },
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.message ??
        'Failed to request a driver',
    );
  }

  return data.data;
}
