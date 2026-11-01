import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import {
  getCustomerOrders,
  getOrderTracking,
  mapApiOrder,
} from '../services/ordersApi';
import type { Order } from '../types/order';
import { useAuth } from './AuthContext';

type OrderContextValue = {
  orders: Order[];
  loading: boolean;
  loadError: string | null;
  addOrder: (order: Order) => void;
  getOrder: (
    orderId: string,
  ) => Order | undefined;
  refreshOrder: (
    orderId: string,
  ) => Promise<Order>;
};

const OrderContext =
  createContext<OrderContextValue | undefined>(
    undefined,
  );

export function OrderProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { customer } = useAuth();
  const [orders, setOrders] =
    useState<Order[]>([]);
  const [loading, setLoading] =
    useState(false);
  const [loadError, setLoadError] =
    useState<string | null>(null);

  const upsertOrder = (order: Order) => {
    setOrders((current) => {
      const exists = current.some(
        (item) => item.id === order.id,
      );

      if (!exists) {
        return [order, ...current];
      }

      return current.map((item) =>
        item.id === order.id ? order : item,
      );
    });
  };

  useEffect(() => {
    let cancelled = false;

    if (!customer) {
      setOrders([]);
      setLoadError(null);
      setLoading(false);
      return () => {
        cancelled = true;
      };
    }

    async function loadOrders() {
      try {
        setLoading(true);
        setLoadError(null);

        const apiOrders = await getCustomerOrders();

        if (!cancelled) {
          setOrders(apiOrders.map(mapApiOrder));
        }
      } catch (error) {
        console.error(
          'Failed to load customer orders:',
          error,
        );

        if (!cancelled) {
          setLoadError(
            'Could not load your orders.',
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadOrders();

    return () => {
      cancelled = true;
    };
  }, [customer?.id]);

  const addOrder = (order: Order) => {
    upsertOrder(order);
  };

  const getOrder = (orderId: string) =>
    orders.find(
      (order) => order.id === orderId,
    );

  const refreshOrder = async (
    orderId: string,
  ) => {
    const order = mapApiOrder(
      await getOrderTracking(orderId),
    );

    upsertOrder(order);
    return order;
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        loading,
        loadError,
        addOrder,
        getOrder,
        refreshOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);

  if (!context) {
    throw new Error(
      'useOrders must be used inside OrderProvider',
    );
  }

  return context;
}
