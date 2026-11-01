import type { CartItem } from './cart';
import type {
  DeliveryAddress,
  PaymentMethod,
} from '../context/CheckoutContext';

export type OrderStatus =
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'awaiting_driver'
  | 'driver_assigned'
  | 'heading_to_restaurant'
  | 'arrived_at_restaurant'
  | 'picked_up'
  | 'on_the_way'
  | 'delivered'
  | 'cancelled';

export type OrderDriver = {
  id: string;
  code: string;
  name: string;
  status: string;
};

export type Order = {
  id: string;

  restaurantName: string;

  items: CartItem[];

  itemCount: number;

  subtotal: number;
  deliveryFee: number;
  total: number;

  address: DeliveryAddress;
  paymentMethod: PaymentMethod;

  status: OrderStatus;

  driver?: OrderDriver;
  deliveryStatus?: string;
  estimatedMinutes?: number;

  createdAt: string;
};
