export type CartExtra = {
  id: string;
  name: string;
  price: number;
};

export type CartItem = {
  id: string;
  foodId: string;
  name: string;
  image: string;

  basePrice: number;

  size: string;
  sizePrice: number;

  extras: CartExtra[];

  quantity: number;

  unitPrice: number;
  totalPrice: number;
};

export type Cart = {
  restaurantId: string | null;
  restaurantName: string | null;
  items: CartItem[];
};