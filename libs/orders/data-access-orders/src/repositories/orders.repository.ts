import { inject, Injectable } from '@angular/core';
import {
  type CreateOrderRequest,
  type CreateOrderResponse,
  type GetOrderResponse,
} from '@cleanup/models-orders';
import { Observable } from 'rxjs';
import { OrdersApi } from '../api/orders.api';

@Injectable({
  providedIn: 'root',
})
export class OrdersRepository {
  private readonly api = inject(OrdersApi);

  createOrder(request: CreateOrderRequest): Observable<CreateOrderResponse> {
    return this.api.createOrder(request);
  }

  getOrderById(orderId: string): Observable<GetOrderResponse> {
    return this.api.getOrderById(orderId);
  }
}
