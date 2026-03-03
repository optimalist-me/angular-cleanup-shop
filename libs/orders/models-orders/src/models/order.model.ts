export type OrderContext = 'storefront';

export type OrderItem = {
  id: string;
  slug: string;
  name: string;
  price: number;
  quantity: number;
  imageSrc: string;
  imageAlt: string;
};

export type CreateOrderRequest = {
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  name?: string;
  email?: string;
  company?: string;
  context?: OrderContext;
};

export type Order = {
  id: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  name?: string;
  email?: string;
  company?: string;
  createdAt: string;
  context: OrderContext;
};

export type CreateOrderResponse = {
  success: boolean;
  order?: Order;
  message?: string;
  error?: string;
};

export type GetOrderResponse = {
  success: boolean;
  order?: Order;
  message?: string;
  error?: string;
};
