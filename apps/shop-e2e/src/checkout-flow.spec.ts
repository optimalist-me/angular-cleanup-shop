import { expect, test } from '@playwright/test';

test('checkout flow submits and confirms', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      'cleanup-shop-cart',
      JSON.stringify([
        {
          id: 'boundary-polish',
          slug: 'boundary-polish',
          name: 'Boundary Polish',
          price: 2400,
          imageSrc: '/images/products/boundary-polish.png',
          imageAlt: 'Boundary Polish image',
          quantity: 1,
        },
      ]),
    );
  });

  await page.route('**/api/bookings', async (route) => {
    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        bookingId: 'booking-123',
        message: 'Booking submitted successfully',
      }),
    });
  });

  await page.route('**/api/bookings/booking-123', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        booking: {
          id: 'booking-123',
          name: 'Jane Doe',
          email: 'jane@example.com',
          company: 'Cleanup Shop',
          teamSize: 10,
          angularVersion: '21',
          usesNx: true,
          notes: 'Interested in a fast audit.',
          preferredDates: ['2026-03-20'],
          createdAt: new Date().toISOString(),
        },
      }),
    });
  });

  await page.goto('/checkout');
  await page.getByRole('button', { name: 'Continue to details' }).click();

  await page.fill('#name', 'Jane Doe');
  await page.fill('#email', 'jane@example.com');
  await page.fill('#company', 'Cleanup Shop');
  await page.selectOption('#teamSize', '10');
  await page.fill('#angularVersion', '21');
  await page.selectOption('#usesNx', 'yes');
  await page.fill('#notes', 'Interested in a fast audit.');

  await page.getByRole('button', { name: 'Continue to scheduling' }).click();
  await page.fill('input[type="date"]', '2026-03-01');
  await page.getByRole('button', { name: 'Complete checkout' }).click();

  await expect(
    page.getByRole('heading', { name: 'Appointment request received' }),
  ).toBeVisible();
  await expect(page).toHaveURL(/\/book\/confirmed\/booking-123$/u);
});
