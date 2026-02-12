export type CartItem = {
  id: string;
  slug: string;
  name: string;
  price: number;
  imageSrc: string;
  imageAlt: string;
  quantity: number;
};

export type CartItemInput = Omit<CartItem, 'quantity'> & {
  quantity?: number;
};
