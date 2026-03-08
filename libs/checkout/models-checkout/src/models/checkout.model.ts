export type CheckoutCartItem = {
  id: string;
  slug: string;
  name: string;
  price: number;
  imageSrc: string;
  imageAlt: string;
  quantity: number;
};

export type CheckoutOrder = {
  id: string;
  items: CheckoutCartItem[];
  subtotal: number;
  tax: number;
  total: number;
  name?: string;
  email?: string;
  company?: string;
  createdAt: string;
  context: 'storefront';
};

export type SubmitCheckoutRequest = {
  items: CheckoutCartItem[];
  subtotal: number;
  tax: number;
  total: number;
  name?: string;
  email?: string;
  company?: string;
  context?: 'storefront';
};

export type SubmitCheckoutResponse = {
  success: boolean;
  orderId?: string;
  message?: string;
  error?: string;
};

export type GetCheckoutOrderResponse = {
  success: boolean;
  order?: CheckoutOrder;
  message?: string;
  error?: string;
};
