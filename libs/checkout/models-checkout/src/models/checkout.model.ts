export type CheckoutCartItem = {
  id: string;
  slug: string;
  name: string;
  price: number;
  imageSrc: string;
  imageAlt: string;
  quantity: number;
};

export type SubmitCheckoutRequest = {
  name: string;
  email: string;
  company: string;
  teamSize: number;
  angularVersion: string;
  usesNx: boolean;
  notes: string;
  preferredDates: string[];
  privacyPolicyAccepted: boolean;
};

export type SubmitCheckoutResponse = {
  success: boolean;
  bookingId?: string;
  message: string;
  error?: string;
};
