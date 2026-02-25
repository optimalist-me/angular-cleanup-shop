import axios from 'axios';

describe('products API', () => {
  it('returns the seeded product catalog', async () => {
    const res = await axios.get('/api/products');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);
    expect(res.data.length).toBeGreaterThan(0);
    expect(
      (res.data as Array<{ slug: string }>).some(
        (product) => product.slug === 'boundary-polish',
      ),
    ).toBe(true);
  });

  it('returns details for a known slug', async () => {
    const res = await axios.get('/api/products/state-simplifier');

    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    expect(res.data.product?.slug).toBe('state-simplifier');
  });

  it('returns 404 for an unknown slug', async () => {
    await expect(
      axios.get('/api/products/does-not-exist'),
    ).rejects.toMatchObject({
      response: {
        status: 404,
        data: {
          success: false,
          message: 'Product not found',
        },
      },
    });
  });
});
