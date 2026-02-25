import { Request, Response, Router } from 'express';
import {
  getProductCatalog,
  getProductDetails,
} from '@angular-cleanup-shop/application-products-service';
import { GetProductResponse } from '@cleanup/models-products';

export function createProductsRouter(): Router {
  const router = Router();

  router.get('/', async (_req: Request, res: Response) => {
    try {
      const products = await getProductCatalog();
      res.status(200).json(products);
    } catch (error) {
      console.error('[CONTROLLER] Error in GET /products:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  });

  router.get('/:slug', async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const product = await getProductDetails(slug);

      if (!product) {
        const response: GetProductResponse = {
          success: false,
          message: 'Product not found',
        };
        res.status(404).json(response);
        return;
      }

      const response: GetProductResponse = {
        success: true,
        product,
      };
      res.status(200).json(response);
    } catch (error) {
      console.error('[CONTROLLER] Error in GET /products/:slug:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  });

  return router;
}
