import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import {
  CHECKOUT_ORDER_PORT,
  type CheckoutOrderPort,
} from '../ports/checkout-order.port';
import { CheckoutOrderRepository } from './checkout-order.repository';
import {
  type GetCheckoutOrderResponse,
  type SubmitCheckoutRequest,
} from '@cleanup/models-checkout';

describe('CheckoutOrderRepository', () => {
  const request: SubmitCheckoutRequest = {
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

  it('proxies submit and getById to configured checkout order port', () => {
    const port: CheckoutOrderPort = {
      submit: vi.fn(() =>
        of({
          success: true,
          orderId: 'order-123',
        }),
      ),
      getById: vi.fn(() =>
        of<GetCheckoutOrderResponse>({
          success: true,
          order: {
            id: 'order-123',
            items: request.items,
            subtotal: 2400,
            tax: 0,
            total: 2400,
            context: 'storefront' as const,
            createdAt: '2026-03-03T10:00:00.000Z',
          },
        }),
      ),
    };

    TestBed.configureTestingModule({
      providers: [
        CheckoutOrderRepository,
        { provide: CHECKOUT_ORDER_PORT, useValue: port },
      ],
    });

    const repository = TestBed.inject(CheckoutOrderRepository);
    repository.submit(request).subscribe();
    repository.getById('order-123').subscribe();

    expect(port.submit).toHaveBeenCalledWith(request);
    expect(port.getById).toHaveBeenCalledWith('order-123');
  });
});
