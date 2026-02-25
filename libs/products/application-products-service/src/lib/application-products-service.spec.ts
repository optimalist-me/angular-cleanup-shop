import * as ProductsDatastore from '@angular-cleanup-shop/infrastructure-products-datastore';
import { Product } from '@cleanup/models-products';
import { getProductCatalog, getProductDetails } from './products-service';

jest.mock('@angular-cleanup-shop/infrastructure-products-datastore', () => ({
  getAllProducts: jest.fn(),
  getProductBySlug: jest.fn(),
}));

const products: Product[] = [
  {
    slug: 'boundary-polish',
    name: 'Boundary Polish',
    outcome: 'Clear ownership.',
    pattern: 'Explicit boundaries.',
    domainTag: 'boundaries',
    shortDescription: 'Keeps domains clean.',
    description: 'Clarify domain ownership with firm boundaries.',
    bestFor: ['Blurred ownership'],
    timeline: '2-3 sessions',
    price: 2400,
    imageSrc: '/images/products/boundary-polish.png',
    imageAlt: 'Illustration of the Boundary Polish cleaning product.',
  },
];

describe('products service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns the product catalog from datastore', async () => {
    (ProductsDatastore.getAllProducts as jest.Mock).mockResolvedValue(products);

    const result = await getProductCatalog();

    expect(result).toEqual(products);
    expect(ProductsDatastore.getAllProducts).toHaveBeenCalledTimes(1);
  });

  it('returns product details by slug', async () => {
    (ProductsDatastore.getProductBySlug as jest.Mock).mockResolvedValue(
      products[0],
    );

    const result = await getProductDetails('boundary-polish');

    expect(result).toEqual(products[0]);
    expect(ProductsDatastore.getProductBySlug).toHaveBeenCalledWith(
      'boundary-polish',
    );
  });

  it('passes null through when a product is missing', async () => {
    (ProductsDatastore.getProductBySlug as jest.Mock).mockResolvedValue(null);

    const result = await getProductDetails('missing');

    expect(result).toBeNull();
  });
});
