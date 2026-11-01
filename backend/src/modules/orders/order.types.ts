export type CreateOrderItemInput = {
  menuItemId?: string;
  itemName: string;
  variantName?: string;
  quantity: number;
  unitPrice: number;
};

export type CreateOrderInput = {
  branchCode: string;

  customerId: string;
  customerName: string;
  customerPhone?: string;

  orderType: 'delivery' | 'pickup';

  deliveryAddress?: string;

  paymentMethod?: string;

  notes?: string;

  items: CreateOrderItemInput[];
};
