import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  type CreateOrderRequest,
  type CreateOrderResponse,
  type GetOrderResponse,
} from '@cleanup/models-orders';

@Injectable({
  providedIn: 'root',
})
export class OrdersApi {
  private readonly http = inject(HttpClient);

  createOrder(request: CreateOrderRequest) {
    return this.http.post<CreateOrderResponse>('/api/orders', request);
  }

  getOrderById(orderId: string) {
    return this.http.get<GetOrderResponse>(`/api/orders/${orderId}`);
  }
}
