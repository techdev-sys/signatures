import {
  NativeModules,
  Platform,
} from 'react-native';

export type ApiOrderItem = {
  id: string;
  quantity: number;
  item_name: string;
  variant_name: string | null;
  unit_price: number | string;
  total_price: number | string;
};

export type ApiBranch = {
  id: string;
  name: string;
  address: string;
};

export type ApiDeliveryOrder = {
  order_number: string;
  customer_name: string;
  customer_phone: string | null;
  delivery_address: string | null;
  total: number | string;
  payment_method: string | null;
  created_at: string;
  branch_id: string;

  branches: ApiBranch;

  order_items: ApiOrderItem[];
};

export type ApiDelivery = {
  id: string;
  order_id: string;
  driver_id: string | null;

  status: string;

  delivery_address: string;

  distance_km: number | null;
  estimated_minutes: number | null;

  earnings: number | string;

  created_at: string;
  accepted_at?: string | null;
  picked_up_at?: string | null;
  delivered_at?: string | null;

  orders: ApiDeliveryOrder;
};

export type ApiDriver = {
  id: string;
  driver_code: string;
  full_name: string;
  branch_id: string;
  is_online: boolean;
  status: string;
};

type AvailableDeliveriesResponse = {
  success: boolean;
  count: number;

  driver: ApiDriver;

  data: ApiDelivery[];
};

const configuredApiUrl =
  process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '');

const metroScriptUrl =
  NativeModules.SourceCode?.scriptURL as
    | string
    | undefined;

const metroHost = metroScriptUrl?.match(
  /^[a-z]+:\/\/([^/:]+)/i,
)?.[1];

const API_URL =
  configuredApiUrl ??
  (Platform.OS === 'web'
    ? 'http://localhost:4000/api'
    : `http://${metroHost ?? '192.168.1.7'}:4000/api`);

export async function getAvailableDeliveries(
  driverCode: string,
): Promise<AvailableDeliveriesResponse> {
  const response = await fetch(
    `${API_URL}/deliveries/available/${driverCode}`,
  );

  const data =
    (await response.json()) as AvailableDeliveriesResponse;

  if (!response.ok || !data.success) {
    throw new Error(
      'Failed to load available deliveries',
    );
  }

  return data;
}

export async function getActiveDeliveries(
  driverCode: string,
): Promise<AvailableDeliveriesResponse> {
  const response = await fetch(
    `${API_URL}/deliveries/driver/${driverCode}/active`,
  );

  const data =
    (await response.json()) as AvailableDeliveriesResponse;

  if (!response.ok || !data.success) {
    throw new Error(
      'Failed to load active deliveries',
    );
  }

  return data;
}

export async function getCompletedDeliveries(
  driverCode: string,
): Promise<AvailableDeliveriesResponse> {
  const response = await fetch(
    `${API_URL}/deliveries/driver/${driverCode}/completed`,
  );

  const data =
    (await response.json()) as AvailableDeliveriesResponse;

  if (!response.ok || !data.success) {
    throw new Error(
      'Failed to load completed deliveries',
    );
  }

  return data;
}

export async function acceptDeliveryApi(
  deliveryId: string,
  driverCode: string,
) {
  const response = await fetch(
    `${API_URL}/deliveries/${deliveryId}/accept`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        driverCode,
      }),
    },
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.message ??
        'Failed to accept delivery',
    );
  }

  return data.data;
}

export type DriverDeliveryStatus =
  | 'arrived_at_restaurant'
  | 'picked_up'
  | 'on_the_way'
  | 'delivered';

export async function updateDeliveryStatusApi(
  deliveryId: string,
  driverCode: string,
  status: DriverDeliveryStatus,
) {
  const response = await fetch(
    `${API_URL}/deliveries/${deliveryId}/status`,
    {
      method: 'PATCH',

      headers: {
        'Content-Type':
          'application/json',
      },

      body: JSON.stringify({
        driverCode,
        status,
      }),
    },
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.message ??
        'Failed to update delivery',
    );
  }

  return data.data;
}
