import { expect, test } from '@playwright/test';

const ANALYTICS_ENDPOINT_PATTERNS = [
  /google-analytics\.com/iu,
  /googletagmanager\.com/iu,
  /doubleclick\.net/iu,
  /connect\.facebook\.net/iu,
  /api\.segment\.io|segment\.com\/analytics\.js/iu,
  /plausible\.io/iu,
  /posthog\.com/iu,
  /mixpanel\.com/iu,
];

test('booking and checkout flows make only first-party network calls', async ({
  page,
}, testInfo) => {
  const baseURL = testInfo.project.use.baseURL;
  if (typeof baseURL !== 'string') {
    throw new Error('baseURL must be defined for network guard tests');
  }

  const appOrigin = new URL(baseURL).origin;
  const allowedOrigins = new Set([
    appOrigin,
    'http://localhost:3333',
    'http://127.0.0.1:3333',
  ]);
  const disallowedRequests = new Set<string>();
  const analyticsRequests = new Set<string>();

  page.on('request', (request) => {
    const requestUrl = request.url();
    if (
      requestUrl.startsWith('data:') ||
      requestUrl.startsWith('blob:') ||
      requestUrl.startsWith('about:')
    ) {
      return;
    }

    for (const pattern of ANALYTICS_ENDPOINT_PATTERNS) {
      if (pattern.test(requestUrl)) {
        analyticsRequests.add(requestUrl);
      }
    }

    const parsedUrl = new URL(requestUrl);
    if (!allowedOrigins.has(parsedUrl.origin)) {
      disallowedRequests.add(requestUrl);
    }
  });

  await page.goto('/book');
  await expect(
    page.getByRole('heading', { name: 'Request a 20-min fit check' }),
  ).toBeVisible();

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
        bookingId: 'booking-guard-1',
        message: 'Booking submitted successfully',
      }),
    });
  });

  await page.route('**/api/bookings/booking-guard-1', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        booking: {
          id: 'booking-guard-1',
          name: 'Network Guard',
          email: 'guard@example.com',
          company: 'Angular Cleanup Shop',
          teamSize: 5,
          angularVersion: '21',
          usesNx: true,
          notes: 'No analytics guard test',
          preferredDates: ['2026-03-20'],
          createdAt: new Date().toISOString(),
        },
      }),
    });
  });

  await page.goto('/checkout');
  await page.getByRole('button', { name: 'Continue to details' }).click();
  await page.fill('#name', 'Network Guard');
  await page.fill('#email', 'guard@example.com');
  await page.fill('#company', 'Angular Cleanup Shop');
  await page.getByLabel('Team size').selectOption({ label: '1-5' });
  await page.fill('#angularVersion', '21');
  await page.selectOption('#usesNx', 'yes');
  await page.fill('#notes', 'No analytics guard test');
  await page.check('#checkout-privacy-policy-accepted');
  await page.getByRole('button', { name: 'Continue to scheduling' }).click();
  await page.fill('input[type="date"]', '2026-03-01');
  await page.getByRole('button', { name: 'Complete checkout' }).click();

  await expect(
    page.getByRole('heading', { name: 'Appointment request received' }),
  ).toBeVisible();
  expect([...analyticsRequests]).toEqual([]);
  expect([...disallowedRequests]).toEqual([]);
});
