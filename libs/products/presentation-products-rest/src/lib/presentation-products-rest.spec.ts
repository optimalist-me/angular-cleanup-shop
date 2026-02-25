import { Request, Response } from 'express';
import { createProductsRouter } from './products-controller';
import * as ProductsService from '@angular-cleanup-shop/application-products-service';

jest.mock('@angular-cleanup-shop/application-products-service', () => ({
  getProductCatalog: jest.fn(),
  getProductDetails: jest.fn(),
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
  const router = createProductsRouter();
  const layer = router.stack.find(
    (entry) =>
      entry.route?.path === path &&
      entry.route?.stack?.some((h: { method: string }) => h.method === method),
  );

  if (!layer) {
    throw new Error(`Route ${method.toUpperCase()} ${path} not found`);
  }

  return layer.route.stack[0].handle as Handler;
}

describe('products controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns catalog list', async () => {
    (ProductsService.getProductCatalog as jest.Mock).mockResolvedValue([
      {
        slug: 'boundary-polish',
      },
    ]);

    const handler = findHandler('get', '/');
    const res = createResponse();

    await handler({}, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([{ slug: 'boundary-polish' }]);
  });

  it('returns product detail when found', async () => {
    (ProductsService.getProductDetails as jest.Mock).mockResolvedValue({
      slug: 'boundary-polish',
    });

    const handler = findHandler('get', '/:slug');
    const res = createResponse();

    await handler({ params: { slug: 'boundary-polish' } }, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      product: { slug: 'boundary-polish' },
    });
  });

  it('returns 404 when product is missing', async () => {
    (ProductsService.getProductDetails as jest.Mock).mockResolvedValue(null);

    const handler = findHandler('get', '/:slug');
    const res = createResponse();

    await handler({ params: { slug: 'missing' } }, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Product not found',
    });
  });
});
