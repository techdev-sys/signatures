import { createContext, ReactNode, useContext, useState } from 'react';

export type DeliveryAddress = {
  id: string;
  label: string;
  address: string;
};

export type PaymentMethod = {
  id: string;
  label: string;
  detail: string;
  icon: 'cash-outline' | 'card-outline' | 'phone-portrait-outline';
};

type CheckoutContextValue = {
  address: DeliveryAddress | null;
  paymentMethod: PaymentMethod | null;

  setAddress: (address: DeliveryAddress) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  resetCheckout: () => void;
};

const CheckoutContext =
  createContext<CheckoutContextValue | undefined>(undefined);

export function CheckoutProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [address, setAddress] =
    useState<DeliveryAddress | null>(null);

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod | null>(null);

  const resetCheckout = () => {
    setAddress(null);
    setPaymentMethod(null);
  };

  return (
    <CheckoutContext.Provider
      value={{
        address,
        paymentMethod,
        setAddress,
        setPaymentMethod,
        resetCheckout,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context = useContext(CheckoutContext);

  if (!context) {
    throw new Error(
      'useCheckout must be used inside CheckoutProvider',
    );
  }

  return context;
}