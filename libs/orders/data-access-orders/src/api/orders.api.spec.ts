import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import {
  type CreateOrderRequest,
  type CreateOrderResponse,
  type GetOrderResponse,
} from '@cleanup/models-orders';
import { OrdersApi } from './orders.api';

describe('OrdersApi', () => {
  let service: OrdersApi;
  let httpMock: HttpTestingController;

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
    name: 'Taylor Reed',
    email: 'taylor@example.com',
    company: 'Cleanup Shop',
    context: 'storefront',
  };

  const createResponse: CreateOrderResponse = {
    success: true,
    order: {
      id: 'order-123',
      items: request.items,
      subtotal: 2400,
      tax: 0,
      total: 2400,
      name: request.name,
      email: request.email,
      company: request.company,
      context: 'storefront',
      createdAt: '2026-03-03T10:00:00.000Z',
    },
  };

  const detailsResponse: GetOrderResponse = {
    success: true,
    order: createResponse.order,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(OrdersApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create order', () => {
    service.createOrder(request).subscribe((result) => {
      expect(result).toEqual(createResponse);
    });

    const httpRequest = httpMock.expectOne('/api/orders');
    expect(httpRequest.request.method).toBe('POST');
    expect(httpRequest.request.body).toEqual(request);
    httpRequest.flush(createResponse);
  });

  it('should fetch order by id', () => {
    service.getOrderById('order-123').subscribe((result) => {
      expect(result).toEqual(detailsResponse);
    });

    const httpRequest = httpMock.expectOne('/api/orders/order-123');
    expect(httpRequest.request.method).toBe('GET');
    httpRequest.flush(detailsResponse);
  });
});
