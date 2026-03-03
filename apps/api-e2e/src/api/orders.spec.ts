import axios from 'axios';

describe('orders API flow', () => {
  it('creates and retrieves an order without creating a booking', async () => {
    const uniqueEmail = `orders-only-${Date.now()}@example.com`;

    const orderRequest = {
      items: [
        {
          id: 'boundary-polish',
          slug: 'boundary-polish',
          name: 'Boundary Polish',
          price: 2400,
          quantity: 1,
          imageSrc: '/images/products/boundary-polish.png',
          imageAlt: 'Boundary Polish image',
        },
      ],
      subtotal: 2400,
      tax: 0,
      total: 2400,
      name: 'Taylor Reed',
      email: uniqueEmail,
      company: 'Cleanup Shop',
      context: 'storefront',
    };

    const createRes = await axios.post('/api/orders', orderRequest);

    expect(createRes.status).toBe(201);
    expect(createRes.data.success).toBe(true);
    expect(createRes.data.order?.id).toBeTruthy();

    const orderId = createRes.data.order.id as string;
    const getRes = await axios.get(`/api/orders/${orderId}`);

    expect(getRes.status).toBe(200);
    expect(getRes.data.success).toBe(true);
    expect(getRes.data.order.email).toBe(uniqueEmail);

    const bookingsRes = await axios.get(`/api/bookings?email=${uniqueEmail}`);

    expect(bookingsRes.status).toBe(200);
    expect(bookingsRes.data.success).toBe(true);
    expect(bookingsRes.data.bookings).toEqual([]);
  });

  it('rejects order submission when totals do not match', async () => {
    const orderRequest = {
      items: [
        {
          id: 'boundary-polish',
          slug: 'boundary-polish',
          name: 'Boundary Polish',
          price: 2400,
          quantity: 1,
          imageSrc: '/images/products/boundary-polish.png',
          imageAlt: 'Boundary Polish image',
        },
      ],
      subtotal: 2400,
      tax: 0,
      total: 1,
      context: 'storefront',
    };

    await expect(axios.post('/api/orders', orderRequest)).rejects.toMatchObject(
      {
        response: {
          status: 400,
        },
      },
    );
  });
});
