export type ProductDomainTag =
  | 'components'
  | 'state'
  | 'rxjs'
  | 'boundaries'
  | 'testing'
  | 'upgrades'
  | 'performance';

export type Product = {
  slug: string;
  name: string;
  outcome: string;
  pattern: string;
  domainTag: ProductDomainTag;
  shortDescription: string;
  description: string;
  bestFor: string[];
  timeline: string;
  price: number;
  imageSrc: string;
  imageAlt: string;
};

export type GetProductResponse = {
  success: boolean;
  product?: Product;
  message?: string;
};
