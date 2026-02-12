import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductsApi {
  private readonly http = inject(HttpClient);

  getAll() {
    return this.http.get<Product[]>('/data/products.json');
  }

  getBySlug(slug: string) {
    return this.getAll().pipe(
      map(
        (products) => products.find((product) => product.slug === slug) ?? null,
      ),
    );
  }
}
