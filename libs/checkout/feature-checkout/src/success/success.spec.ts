import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of, Subject, throwError } from 'rxjs';
import {
  CheckoutOrderRepository,
  MAIN_DOMAIN_URL,
} from '@cleanup/data-access-checkout';
import { type GetCheckoutOrderResponse } from '@cleanup/models-checkout';
import { CheckoutSuccess } from './success';

describe('CheckoutSuccess', () => {
  it('renders order summary and main domain CTA', async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutSuccess],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ orderId: 'order-123' })),
          },
        },
        {
          provide: CheckoutOrderRepository,
          useValue: {
            getById: () =>
              of({
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
              } satisfies GetCheckoutOrderResponse),
          },
        },
        {
          provide: MAIN_DOMAIN_URL,
          useValue: 'https://angularcleanup.shop',
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(CheckoutSuccess);
    await fixture.whenStable();
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain(
      'This checkout is part of a technical storefront demo.',
    );
    expect(element.textContent).toContain('order-123');

    const cta = element.querySelector('a[href="https://angularcleanup.shop"]');
    expect(cta?.textContent).toContain('Explore the Governance Program');
    expect(cta?.getAttribute('target')).toBe('_blank');
    expect(cta?.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('shows missing order id error when route param is absent', async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutSuccess],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({})),
          },
        },
        {
          provide: CheckoutOrderRepository,
          useValue: {
            getById: vi.fn(),
          },
        },
        {
          provide: MAIN_DOMAIN_URL,
          useValue: 'https://angularcleanup.shop',
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(CheckoutSuccess);
    await fixture.whenStable();

    expect(fixture.componentInstance.error()).toBe('Order ID is missing.');
  });

  it('shows loading state first and then not-found message', async () => {
    const stream = new Subject<GetCheckoutOrderResponse>();

    await TestBed.configureTestingModule({
      imports: [CheckoutSuccess],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ orderId: 'order-missing' })),
          },
        },
        {
          provide: CheckoutOrderRepository,
          useValue: {
            getById: () => stream,
          },
        },
        {
          provide: MAIN_DOMAIN_URL,
          useValue: 'https://angularcleanup.shop',
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(CheckoutSuccess);

    expect(fixture.componentInstance.loading()).toBe(true);

    stream.next({ success: false, message: 'Order could not be found.' });
    stream.complete();

    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.componentInstance.loading()).toBe(false);
    expect(fixture.componentInstance.error()).toBe('Order could not be found.');
  });

  it('shows fetch error when order request fails', async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutSuccess],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ orderId: 'order-500' })),
          },
        },
        {
          provide: CheckoutOrderRepository,
          useValue: {
            getById: () => throwError(() => new Error('network')),
          },
        },
        {
          provide: MAIN_DOMAIN_URL,
          useValue: 'https://angularcleanup.shop',
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(CheckoutSuccess);
    await fixture.whenStable();

    expect(fixture.componentInstance.error()).toBe(
      'Could not load order details.',
    );
  });
});
