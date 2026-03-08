import { Router, Request, Response } from 'express';
import {
  getOrderDetails,
  processOrder,
} from '@angular-cleanup-shop/application-orders-service';
import { type CreateOrderRequest } from '@cleanup/models-orders';

export function createOrdersRouter(): Router {
  const router = Router();

  router.post('/', async (req: Request, res: Response) => {
    try {
      const orderRequest = req.body as CreateOrderRequest;
      const result = await processOrder(orderRequest);

      if (result.success && result.order) {
        res.status(201).json({
          success: true,
          order: result.order,
        });
        return;
      }

      res.status(400).json({
        success: false,
        message: result.message,
        error: result.error,
      });
    } catch (error) {
      console.error('[CONTROLLER] Error in POST /orders:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  router.get('/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const order = await getOrderDetails(id);

      if (!order) {
        res.status(404).json({
          success: false,
          message: 'Order not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        order,
      });
    } catch (error) {
      console.error('[CONTROLLER] Error in GET /orders/:id:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  return router;
}
