import axios from 'axios';

describe('API health', () => {
  it('returns the welcome message', async () => {
    const res = await axios.get('/api');

    expect(res.status).toBe(200);
    expect(res.data).toEqual({ message: 'Welcome to api!' });
  });
});
