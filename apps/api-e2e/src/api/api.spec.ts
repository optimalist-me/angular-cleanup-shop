import axios from 'axios';

describe('API health', () => {
  it('returns the welcome message', async () => {
    const res = await axios.get('/api');

    expect(res.status).toBe(200);
    expect(res.data).toEqual({ message: 'Welcome to api!' });
  });
});

describe('booking API flow', () => {
  it('creates and retrieves a booking', async () => {
    const bookingRequest = {
      name: 'Taylor Reed',
      email: 'taylor@example.com',
      company: 'Cleanup Shop',
      teamSize: 6,
      notes: 'Afternoons preferred',
    };

    const createRes = await axios.post('/api/bookings', bookingRequest);

    expect(createRes.status).toBe(201);
    expect(createRes.data.success).toBe(true);
    expect(createRes.data.bookingId).toBeTruthy();

    const bookingId = createRes.data.bookingId as string;
    const getRes = await axios.get(`/api/bookings/${bookingId}`);

    expect(getRes.status).toBe(200);
    expect(getRes.data.success).toBe(true);
    expect(getRes.data.booking.email).toBe(bookingRequest.email);
  });
});
