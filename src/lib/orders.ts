export const orderStatuses = ["pending", "confirmed", "shipped", "completed", "cancelled"] as const;

export type OrderStatus = (typeof orderStatuses)[number];

export function isOrderStatus(value: string): value is OrderStatus {
  return orderStatuses.some((status) => status === value);
}

export type OrderItem = {
  productId: string;
  variantId: string;
  name: string;
  option: string;
  image: string;
  quantity: number;
  unitPriceCents: number;
};

export type CustomerOrder = {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  items: OrderItem[];
  totalCents: number;
  status: OrderStatus;
  createdAt: string;
};

export type CheckoutLine = {
  variantId: string;
  quantity: number;
};

export type CheckoutDetails = {
  customerName: string;
  email: string;
  phone: string;
  address: string;
};
