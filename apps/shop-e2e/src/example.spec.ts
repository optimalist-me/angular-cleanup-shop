import { test, expect } from '@playwright/test';

test('header CTA navigates to booking', async ({ page }) => {
  await page.goto('/');

  // Use the banner role to scope to the header CTA only
  await page.getByRole('banner').getByRole('link', { name: 'Request a 20-min fit check' }).click();

  await expect(page).toHaveURL(/\/book$/u);
  await expect(
    page.getByRole('heading', { name: 'Schedule your 20-min fit check' }),
  ).toBeVisible();
});

test('booking flow submits and confirms', async ({ page }) => {
  await page.route('**/api/bookings', async (route) => {
    const responseBody = {
      id: 'booking-123',
      createdAt: new Date().toISOString(),
    };

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(responseBody),
    });
  });

  await page.goto('/book');

  await page.fill('#name', 'Jane Doe');
  await page.fill('#email', 'jane@example.com');
  await page.fill('#company', 'Cleanup Shop');
  await page.selectOption('#teamSize', '6');
  await page.fill('#notes', 'Interested in a fast audit.');


  // Wait for the first Next step button to be enabled before clicking
  const nextStepBtn = page.getByRole('button', { name: 'Next step' });
  await expect(nextStepBtn).toBeEnabled();
  await nextStepBtn.click();


  // Fill the required preferred date field in the schedule step
  await page.fill('input[type="date"]', '2026-03-01');

  // Wait for the second Next step button to be enabled before clicking
  const nextStepBtn2 = page.getByRole('button', { name: 'Next step' });
  await expect(nextStepBtn2).toBeEnabled();
  await nextStepBtn2.click();

  // Wait for the Confirm booking button to be enabled before clicking
  const confirmBtn = page.getByRole('button', { name: 'Confirm booking' });
  await expect(confirmBtn).toBeEnabled();
  await confirmBtn.click();

  await expect(
    page.getByRole('heading', { name: 'Booking confirmed!' }),
  ).toBeVisible();
  await expect(page.locator('.booking__success')).toContainText('booking-123');
});
