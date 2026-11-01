import type { Order, OrderStatus } from '../types/order';
import { API_URL } from './apiConfig';
import { authenticatedFetch } from './authApi';

export type ApiOrderItem = {
  id: string;
  item_name: string;
  variant_name: string | null;
  quantity: number;
  unit_price: string | number;
  total_price: string | number;
};

export type ApiDriver = {
  id: string;
  driver_code: string;
  full_name: string;
  status: string;
};

export type ApiDelivery = {
  id: string;
  status: string;
  driver_id: string | null;
  distance_km: string | number | null;
  estimated_minutes: number | null;
  accepted_at: string | null;
  picked_up_at: string | null;
  delivered_at: string | null;
  created_at: string;
  drivers: ApiDriver | ApiDriver[] | null;
};

export type ApiBranch = {
  id: string;
  name: string;
  code: string;
  address: string;
  phone: string | null;
};

export type ApiTrackedOrder = {
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
  branches: ApiBranch | ApiBranch[];
  order_items: ApiOrderItem[];
  deliveries: ApiDelivery[];
};

export type CreateOrderInput = {
  branchCode: string;
  orderType: 'delivery' | 'pickup';
  deliveryAddress?: string;
  paymentMethod?: string;
  notes?: string;
  items: {
    itemName: string;
    variantName?: string;
    quantity: number;
    unitPrice: number;
  }[];
};

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

async function readResponse<T>(
  response: Response,
): Promise<T> {
  const data = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !data.success) {
    throw new Error(
      data.message ?? 'The order request failed',
    );
  }

  return data.data;
}

export async function createOrder(
  input: CreateOrderInput,
) {
  const response = await authenticatedFetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  return readResponse<{
    order_number: string;
  }>(response);
}

export async function getOrderTracking(
  orderNumber: string,
) {
  const response = await authenticatedFetch(
    `${API_URL}/orders/${encodeURIComponent(orderNumber)}/tracking`,
  );

  return readResponse<ApiTrackedOrder>(response);
}

export async function getCustomerOrders() {
  const response = await authenticatedFetch(
    `${API_URL}/orders/mine`,
  );

  return readResponse<ApiTrackedOrder[]>(response);
}

function asOne<T>(value: T | T[] | null | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getLatestDelivery(deliveries: ApiDelivery[]) {
  return [...deliveries].sort(
    (left, right) =>
      new Date(right.created_at).getTime() -
      new Date(left.created_at).getTime(),
  )[0];
}

function mapStatus(
  orderStatus: string,
  delivery?: ApiDelivery,
): OrderStatus {
  switch (delivery?.status) {
    case 'awaiting_driver':
      return 'awaiting_driver';
    case 'heading_to_restaurant':
      return 'heading_to_restaurant';
    case 'arrived_at_restaurant':
      return 'arrived_at_restaurant';
    case 'picked_up':
      return 'picked_up';
    case 'on_the_way':
      return 'on_the_way';
    case 'delivered':
      return 'delivered';
  }

  switch (orderStatus) {
    case 'preparing':
    case 'ready':
    case 'awaiting_driver':
    case 'driver_assigned':
    case 'on_the_way':
    case 'delivered':
      return orderStatus;
    case 'completed':
      return 'delivered';
    case 'cancelled':
    case 'rejected':
      return 'cancelled';
    default:
      return 'confirmed';
  }
}

export function mapApiOrder(
  apiOrder: ApiTrackedOrder,
): Order {
  const branch = asOne(apiOrder.branches);
  const delivery = getLatestDelivery(
    apiOrder.deliveries ?? [],
  );
  const driver = asOne(delivery?.drivers);

  const paymentId = apiOrder.payment_method ?? 'cash';
  const isCash = paymentId.toLowerCase().includes('cash');

  const items = (apiOrder.order_items ?? []).map(
    (item) => ({
      id: item.id,
      foodId: item.id,
      name: item.item_name,
      image: '',
      basePrice: Number(item.unit_price),
      size: item.variant_name ?? '',
      sizePrice: 0,
      extras: [],
      quantity: item.quantity,
      unitPrice: Number(item.unit_price),
      totalPrice: Number(item.total_price),
    }),
  );

  return {
    id: apiOrder.order_number,
    restaurantName: branch?.name ?? 'Signatures Restaurant',
    items,
    itemCount: items.reduce(
      (total, item) => total + item.quantity,
      0,
    ),
    subtotal: Number(apiOrder.subtotal),
    deliveryFee: Number(apiOrder.delivery_fee),
    total: Number(apiOrder.total),
    address: {
      id: 'delivery',
      label: 'Delivery address',
      address:
        apiOrder.delivery_address ??
        branch?.address ??
        'Branch collection',
    },
    paymentMethod: {
      id: paymentId,
      label: isCash ? 'Cash' : 'Paid online',
      detail: isCash
        ? 'Pay when your order arrives'
        : 'Payment recorded with your order',
      icon: isCash ? 'cash-outline' : 'card-outline',
    },
    status: mapStatus(apiOrder.status, delivery),
    deliveryStatus: delivery?.status,
    estimatedMinutes:
      delivery?.estimated_minutes ?? undefined,
    driver: driver
      ? {
          id: driver.id,
          code: driver.driver_code,
          name: driver.full_name,
          status: driver.status,
        }
      : undefined,
    createdAt: apiOrder.created_at,
  };
}
