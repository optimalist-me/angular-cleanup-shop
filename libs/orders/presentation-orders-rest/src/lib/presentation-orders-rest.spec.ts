import { Request, Response } from 'express';
import { type ILayer } from 'express-serve-static-core';
import { createOrdersRouter } from './orders-controller';
import * as OrdersService from '@angular-cleanup-shop/application-orders-service';

jest.mock('@angular-cleanup-shop/application-orders-service', () => ({
  processOrder: jest.fn(),
  getOrderDetails: jest.fn(),
}));

type Handler = (
  req: Partial<Request>,
  res: Partial<Response>,
) => Promise<void> | void;

function createResponse() {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

function findHandler(method: 'get' | 'post', path: string): Handler {
  const router = createOrdersRouter();
  const layer = router.stack.find(
    (entry) =>
      entry.route?.path === path &&
      entry.route?.stack?.some((h: ILayer) => h.method === method),
  );

  if (!layer) {
    throw new Error(`Route ${method.toUpperCase()} ${path} not found`);
  }

  return layer.route.stack[0].handle as Handler;
}

describe('orders controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 201 on successful order submission', async () => {
    (OrdersService.processOrder as jest.Mock).mockResolvedValue({
      success: true,
      order: { id: 'order-1' },
    });

    const handler = findHandler('post', '/');
    const res = createResponse();

    await handler({ body: { subtotal: 0 } }, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      order: { id: 'order-1' },
    });
  });

  it('returns 400 when order submission fails', async () => {
    (OrdersService.processOrder as jest.Mock).mockResolvedValue({
      success: false,
      message: 'Invalid payload',
      error: 'INVALID_PAYLOAD',
    });

    const handler = findHandler('post', '/');
    const res = createResponse();

    await handler({ body: {} }, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns order details when found', async () => {
    (OrdersService.getOrderDetails as jest.Mock).mockResolvedValue({
      id: 'order-2',
    });

    const handler = findHandler('get', '/:id');
    const res = createResponse();

    await handler({ params: { id: 'order-2' } }, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      order: { id: 'order-2' },
    });
  });

  it('returns 404 when order not found', async () => {
    (OrdersService.getOrderDetails as jest.Mock).mockResolvedValue(null);

    const handler = findHandler('get', '/:id');
    const res = createResponse();

    await handler({ params: { id: 'missing' } }, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});
