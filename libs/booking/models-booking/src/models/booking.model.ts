export type BookingStep = 'info' | 'schedule' | 'confirm';

export type BookingStatus = 'idle' | 'submitting' | 'success' | 'error';

export type BookingRequest = {
  name: string;
  email: string;
  company: string;
  teamSize: number;
  notes: string;
  preferredDates?: string[]; // <-- changed from scheduledDate
};

export type BookingDraft = Partial<BookingRequest>;

export type BookingResponse = {
  id: string;
  createdAt: string;
};
