import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { type CreateOrderRequest } from '@cleanup/models-orders';
import { OrdersApi } from '../api/orders.api';
import { OrdersRepository } from './orders.repository';

describe('OrdersRepository', () => {
  let repository: OrdersRepository;
  let api: {
    createOrder: ReturnType<typeof vi.fn>;
    getOrderById: ReturnType<typeof vi.fn>;
  };

  const request: CreateOrderRequest = {
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

  beforeEach(() => {
    api = {
      createOrder: vi.fn(() =>
        of({
          success: true,
          order: {
            id: 'order-1',
            items: request.items,
            subtotal: 2400,
            tax: 0,
            total: 2400,
            context: 'storefront',
            createdAt: '2026-03-03T10:00:00.000Z',
          },
        }),
      ),
      getOrderById: vi.fn(() =>
        of({
          success: true,
          order: {
            id: 'order-1',
            items: request.items,
            subtotal: 2400,
            tax: 0,
            total: 2400,
            context: 'storefront',
            createdAt: '2026-03-03T10:00:00.000Z',
          },
        }),
      ),
    };

    TestBed.configureTestingModule({
      providers: [
        OrdersRepository,
        {
          provide: OrdersApi,
          useValue: api,
        },
      ],
    });

    repository = TestBed.inject(OrdersRepository);
  });

  it('should proxy createOrder', () => {
    repository.createOrder(request).subscribe();
    expect(api.createOrder).toHaveBeenCalledWith(request);
  });

  it('should proxy getOrderById', () => {
    repository.getOrderById('order-1').subscribe();
    expect(api.getOrderById).toHaveBeenCalledWith('order-1');
  });
});
