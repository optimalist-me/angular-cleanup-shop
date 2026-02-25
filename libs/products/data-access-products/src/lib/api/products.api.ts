import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, of, throwError } from 'rxjs';
import { GetProductResponse, Product } from '@cleanup/models-products';

@Injectable({
  providedIn: 'root',
})
export class ProductsApi {
  private readonly http = inject(HttpClient);

  getAll() {
    return this.http.get<Product[]>('/api/products');
  }

  getBySlug(slug: string) {
    return this.http.get<GetProductResponse>(`/api/products/${slug}`).pipe(
      map((response) => response.product ?? null),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          return of(null);
        }

        return throwError(() => error);
      }),
    );
  }
}
