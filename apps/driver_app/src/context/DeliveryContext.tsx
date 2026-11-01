import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import {
  acceptDeliveryApi,
  getActiveDeliveries,
  getAvailableDeliveries,
  getCompletedDeliveries,
  updateDeliveryStatusApi,
  type ApiDelivery,
  type ApiDriver,
} from '../services/deliveriesApi';

import type {
  Delivery,
  DeliveryStatus,
} from '../types/delivery';

type DeliveryContextValue = {
  driver: ApiDriver | null;
  deliveries: Delivery[];

  loading: boolean;
  loadError: string | null;

  availableDeliveries: Delivery[];
  activeDeliveries: Delivery[];
  completedDeliveries: Delivery[];

  acceptDelivery: (deliveryId: string) => Promise<void>;
  declineDelivery: (deliveryId: string) => void;
  updateDeliveryStatus: (
    deliveryId: string,
    status: DeliveryStatus,
  ) => Promise<void>;

  getDelivery: (deliveryId: string) => Delivery | undefined;
};

const DeliveryContext =
  createContext<DeliveryContextValue | undefined>(undefined);

const activeStatuses: DeliveryStatus[] = [
  'accepted',
  'heading_to_restaurant',
  'arrived_at_restaurant',
  'picked_up',
  'on_the_way',
];

function mapApiDelivery(
  delivery: ApiDelivery,
): Delivery {
  return {
    id: delivery.id,

    orderId:
      delivery.orders.order_number,

    restaurantName:
      delivery.orders.branches.name,

    restaurantAddress:
      delivery.orders.branches.address,

    customerName:
      delivery.orders.customer_name,

    customerPhone:
      delivery.orders.customer_phone ??
      'No phone provided',

    customerAddress:
      delivery.delivery_address,

    distanceToRestaurant:
      delivery.distance_km ?? 0,

    deliveryDistance:
      delivery.distance_km ?? 0,

    estimatedMinutes:
      delivery.estimated_minutes ?? 0,

    earnings:
      Number(delivery.earnings),

    items:
      delivery.orders.order_items.map(
        (item) => ({
          id: item.id,
          name: item.item_name,
          quantity: item.quantity,
          options:
            item.variant_name ?? undefined,
        }),
      ),

    orderTotal:
      Number(delivery.orders.total),

    paymentMethod:
      delivery.orders.payment_method ??
      'Not specified',

    status:
      delivery.status === 'awaiting_driver'
        ? 'available'
        : (delivery.status as DeliveryStatus),

    requestedAt:
      delivery.created_at,

    acceptedAt:
      delivery.accepted_at ?? undefined,

    pickedUpAt:
      delivery.picked_up_at ?? undefined,

    deliveredAt:
      delivery.delivered_at ?? undefined,
  };
}

export function DeliveryProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [driver, setDriver] =
    useState<ApiDriver | null>(null);

  const [deliveries, setDeliveries] =
    useState<Delivery[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [loadError, setLoadError] =
    useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadDeliveries() {
      try {
        setLoading(true);
        setLoadError(null);

        const [
          availableResponse,
          activeResponse,
          completedResponse,
        ] = await Promise.all([
          getAvailableDeliveries(
            'DRV-001',
          ),
          getActiveDeliveries(
            'DRV-001',
          ),
          getCompletedDeliveries(
            'DRV-001',
          ),
        ]);

        if (cancelled) return;

        setDriver(availableResponse.driver);

        const availableDeliveries =
          availableResponse.data.map(
            mapApiDelivery,
          );

        const activeDeliveries =
          activeResponse.data.map(
            mapApiDelivery,
          );

        const completedDeliveries =
          completedResponse.data.map(
            mapApiDelivery,
          );

        setDeliveries([
          ...activeDeliveries,
          ...availableDeliveries,
          ...completedDeliveries,
        ]);
      } catch (error) {
        console.error(
          'Failed to load deliveries:',
          error,
        );

        if (!cancelled) {
          setLoadError(
            'Could not load deliveries.',
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadDeliveries();

    return () => {
      cancelled = true;
    };
  }, []);

  const updateDeliveryStatus = async (
    deliveryId: string,
    status: DeliveryStatus,
  ) => {
    if (
      status !==
        'arrived_at_restaurant' &&
      status !== 'picked_up' &&
      status !== 'on_the_way' &&
      status !== 'delivered'
    ) {
      return;
    }

    try {
      await updateDeliveryStatusApi(
        deliveryId,
        'DRV-001',
        status,
      );

      setDeliveries((current) =>
        current.map((delivery) =>
          delivery.id === deliveryId
            ? {
                ...delivery,
                status,

                pickedUpAt:
                  status === 'picked_up'
                    ? new Date().toISOString()
                    : delivery.pickedUpAt,

                deliveredAt:
                  status === 'delivered'
                    ? new Date().toISOString()
                    : delivery.deliveredAt,
              }
            : delivery,
        ),
      );
    } catch (error) {
      console.error(
        'Failed to update delivery:',
        error,
      );

      throw error;
    }
  };

  const acceptDelivery = async (
    deliveryId: string,
  ) => {
    try {
      await acceptDeliveryApi(
        deliveryId,
        'DRV-001',
      );

      setDeliveries((current) =>
        current.map((delivery) =>
          delivery.id === deliveryId
            ? {
                ...delivery,
                status:
                  'heading_to_restaurant',
                acceptedAt:
                  new Date().toISOString(),
              }
            : delivery,
        ),
      );
    } catch (error) {
      console.error(
        'Failed to accept delivery:',
        error,
      );

      throw error;
    }
  };

  const declineDelivery = (deliveryId: string) => {
    setDeliveries((current) =>
      current.map((delivery) =>
        delivery.id === deliveryId
          ? {
              ...delivery,
              status: 'declined',
            }
          : delivery,
      ),
    );
  };

  const availableDeliveries = useMemo(
    () =>
      deliveries.filter(
        delivery => delivery.status === 'available',
      ),
    [deliveries],
  );

  const activeDeliveries = useMemo(
    () =>
      deliveries.filter(delivery =>
        activeStatuses.includes(delivery.status),
      ),
    [deliveries],
  );

  const completedDeliveries = useMemo(
    () =>
      deliveries.filter(
        delivery => delivery.status === 'delivered',
      ),
    [deliveries],
  );

  const getDelivery = (deliveryId: string) =>
    deliveries.find(
      delivery => delivery.id === deliveryId,
    );

  return (
    <DeliveryContext.Provider
      value={{
        driver,
        deliveries,
        loading,
        loadError,
        availableDeliveries,
        activeDeliveries,
        completedDeliveries,
        acceptDelivery,
        declineDelivery,
        updateDeliveryStatus,
        getDelivery,
      }}
    >
      {children}
    </DeliveryContext.Provider>
  );
}

export function useDeliveries() {
  const context = useContext(DeliveryContext);

  if (!context) {
    throw new Error(
      'useDeliveries must be used inside DeliveryProvider',
    );
  }

  return context;
}
