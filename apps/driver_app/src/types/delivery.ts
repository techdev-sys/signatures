export type DeliveryStatus =
  | 'available'
  | 'accepted'
  | 'heading_to_restaurant'
  | 'arrived_at_restaurant'
  | 'picked_up'
  | 'on_the_way'
  | 'delivered'
  | 'declined';

export type DeliveryItem = {
  id: string;
  name: string;
  quantity: number;
  options?: string;
};

export type Delivery = {
  id: string;
  orderId: string;

  restaurantName: string;
  restaurantAddress: string;

  customerName: string;
  customerPhone: string;
  customerAddress: string;

  distanceToRestaurant: number;
  deliveryDistance: number;

  estimatedMinutes: number;
  earnings: number;

  items: DeliveryItem[];

  orderTotal: number;
  paymentMethod: string;

  status: DeliveryStatus;

  requestedAt: string;
  acceptedAt?: string;
  pickedUpAt?: string;
  deliveredAt?: string;
};
