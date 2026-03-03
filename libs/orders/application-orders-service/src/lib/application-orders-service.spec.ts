import * as OrdersDatastore from '@angular-cleanup-shop/infrastructure-orders-datastore';
import { type CreateOrderRequest } from '@cleanup/models-orders';
import { getOrderDetails, processOrder } from './orders-service';

jest.mock('@angular-cleanup-shop/infrastructure-orders-datastore', () => ({
  saveOrder: jest.fn(),
  getOrderById: jest.fn(),
}));

const baseRequest: CreateOrderRequest = {
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
  context: 'storefront',
};

describe('orders service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('rejects invalid payload', async () => {
    const result = await processOrder({ ...baseRequest, items: [] });

    expect(result.success).toBe(false);
    expect(result.message).toBe('At least one item is required.');
    expect(OrdersDatastore.saveOrder).not.toHaveBeenCalled();
  });

  it('rejects non-zero tax', async () => {
    const result = await processOrder({ ...baseRequest, tax: 10, total: 2410 });

    expect(result.success).toBe(false);
    expect(result.message).toBe('Tax must be 0 for storefront demo checkout.');
  });

  it('rejects total mismatch', async () => {
    const result = await processOrder({ ...baseRequest, total: 9999 });

    expect(result.success).toBe(false);
    expect(result.message).toBe('Total does not match subtotal + tax.');
  });

  it('creates order and normalizes context to storefront', async () => {
    (OrdersDatastore.saveOrder as jest.Mock).mockResolvedValue({
      id: 'order-1',
      items: baseRequest.items,
      subtotal: 2400,
      tax: 0,
      total: 2400,
      context: 'storefront',
      createdAt: '2026-03-03T10:00:00.000Z',
    });

    const result = await processOrder({ ...baseRequest, context: undefined });

    expect(result.success).toBe(true);
    expect(result.order?.id).toBe('order-1');
    expect(OrdersDatastore.saveOrder).toHaveBeenCalledWith(
      expect.objectContaining({
        context: 'storefront',
      }),
    );
  });

  it('returns order details', async () => {
    (OrdersDatastore.getOrderById as jest.Mock).mockResolvedValue({
      id: 'order-1',
    });

    await getOrderDetails('order-1');

    expect(OrdersDatastore.getOrderById).toHaveBeenCalledWith('order-1');
  });
});
