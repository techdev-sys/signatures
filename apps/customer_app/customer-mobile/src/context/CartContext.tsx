import {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from 'react';

import type { CartItem } from '../types/cart';

type CartContextValue = {
  items: CartItem[];

  itemCount: number;
  subtotal: number;

  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;

  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;

  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: CartItem) => {
    setItems((current) => {
      const existing = current.find((cartItem) => cartItem.id === item.id);

      if (!existing) {
        return [...current, item];
      }

      return current.map((cartItem) => {
        if (cartItem.id !== item.id) {
          return cartItem;
        }

        const quantity = cartItem.quantity + item.quantity;

        return {
          ...cartItem,
          quantity,
          totalPrice: cartItem.unitPrice * quantity,
        };
      });
    });
  };

  const removeItem = (id: string) => {
    setItems((current) =>
      current.filter((item) => item.id !== id),
    );
  };

  const increaseQuantity = (id: string) => {
    setItems((current) =>
      current.map((item) => {
        if (item.id !== id) return item;

        const quantity = item.quantity + 1;

        return {
          ...item,
          quantity,
          totalPrice: item.unitPrice * quantity,
        };
      }),
    );
  };

  const decreaseQuantity = (id: string) => {
    setItems((current) =>
      current
        .map((item) => {
          if (item.id !== id) return item;

          const quantity = item.quantity - 1;

          return {
            ...item,
            quantity,
            totalPrice: item.unitPrice * quantity,
          };
        })
        .filter((item) => item.quantity > 0),
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = useMemo(
    () =>
      items.reduce(
        (total, item) => total + item.quantity,
        0,
      ),
    [items],
  );

  const subtotal = useMemo(
    () =>
      items.reduce(
        (total, item) => total + item.totalPrice,
        0,
      ),
    [items],
  );

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        addItem,
        removeItem,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used inside CartProvider');
  }

  return context;
}