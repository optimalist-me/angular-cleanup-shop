export type BookingStep = 'review' | 'details' | 'schedule';

export type BookingStatus = 'idle' | 'submitting' | 'success' | 'error';

export type BookingPainArea =
  | 'boundaries'
  | 'state'
  | 'templates'
  | 'testing'
  | 'upgrades'
  | 'performance';

export type BookingRequest = {
  name: string;
  email: string;
  company: string;
  teamSize: number;
  angularVersion: string;
  usesNx: boolean;
  painArea?: BookingPainArea;
  notes: string;
  preferredDates: string[];
};

export type BookingDraft = Partial<BookingRequest>;

export type CreateBookingResponse = {
  success: boolean;
  bookingId?: string;
  message: string;
  error?: string;
};

export type BookingDetails = {
  id: string;
  name: string;
  email: string;
  company: string;
  teamSize: number;
  angularVersion: string;
  usesNx: boolean;
  painArea: BookingPainArea;
  notes?: string;
  preferredDates?: string[];
  createdAt: string;
  completedAt?: string;
};

export type GetBookingResponse = {
  success: boolean;
  booking?: BookingDetails;
  message?: string;
};
