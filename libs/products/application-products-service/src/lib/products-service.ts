import {
  getAllProducts,
  getProductBySlug,
} from '@angular-cleanup-shop/infrastructure-products-datastore';
import { Product } from '@cleanup/models-products';

export async function getProductCatalog(): Promise<Product[]> {
  return getAllProducts();
}

export async function getProductDetails(slug: string): Promise<Product | null> {
  return getProductBySlug(slug);
}
