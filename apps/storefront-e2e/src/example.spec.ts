import { expect, test } from '@playwright/test';

test('cart to checkout creates order and shows success CTA', async ({
  page,
}) => {
  await page.route('**/api/products', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        {
          slug: 'boundary-polish',
          name: 'Boundary Polish',
          outcome: 'Clear ownership.',
          pattern: 'Explicit boundaries.',
          domainTag: 'boundaries',
          shortDescription: 'Keeps domains clean.',
          description: 'Clarify domain ownership with firm boundaries.',
          bestFor: ['Blurred ownership'],
          timeline: '2 sessions',
          price: 2400,
          imageSrc: '/images/products/boundary-polish.png',
          imageAlt: 'Boundary Polish image',
        },
      ]),
    });
  });

  await page.route('**/api/orders', async (route) => {
    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        order: {
          id: 'order-123',
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
          createdAt: '2026-03-03T10:00:00.000Z',
        },
      }),
    });
  });

  await page.route('**/api/orders/order-123', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        order: {
          id: 'order-123',
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
          createdAt: '2026-03-03T10:00:00.000Z',
        },
      }),
    });
  });

  await page.goto('/products/boundary-polish');
  await page.getByRole('button', { name: 'Add to cart' }).click();
  await page.getByRole('link', { name: 'View cart' }).click();

  await expect(page).toHaveURL(/\/cart$/u);
  await page.getByRole('button', { name: 'Continue to checkout' }).click();

  await expect(page).toHaveURL(/\/checkout$/u);
  await page.getByRole('button', { name: 'Continue to details' }).click();
  await page.getByRole('button', { name: 'Place order' }).click();

  await expect(page).toHaveURL(/\/checkout\/success\/order-123$/u);
  await expect(
    page.getByText('This checkout is part of a technical storefront demo.'),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Explore the Governance Program' }),
  ).toHaveAttribute('href', 'https://angularcleanup.shop');
});
