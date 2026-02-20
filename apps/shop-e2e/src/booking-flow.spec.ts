import { expect, test } from '@playwright/test';

test('header CTA navigates to booking', async ({ page }) => {
  await page.goto('/');

  await page
    .getByRole('banner')
    .getByRole('link', { name: 'Request a 20-min fit check' })
    .click();

  await expect(page).toHaveURL(/\/book$/u);
  await expect(
    page.getByRole('heading', { name: 'Request a 20-min fit check' }),
  ).toBeVisible();
});
