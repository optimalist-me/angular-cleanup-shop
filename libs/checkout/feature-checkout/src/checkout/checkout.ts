import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { catchError, of, startWith, take } from 'rxjs';
import {
  CheckoutCartRepository,
  CheckoutOrderRepository,
} from '@cleanup/data-access-checkout';
import { type SubmitCheckoutRequest } from '@cleanup/models-checkout';
import { SharedDesignSurface } from '@cleanup/shared-ui-design-surface';
import { SharedDesignText } from '@cleanup/shared-ui-design-text';
import { CheckoutLineItem, CheckoutSummary } from '@cleanup/ui-checkout';

type CheckoutStep = 'review' | 'details';

@Component({
  selector: 'checkout-checkout',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    CheckoutLineItem,
    CheckoutSummary,
    SharedDesignSurface,
    SharedDesignText,
  ],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutCheckout {
  private readonly cartRepository = inject(CheckoutCartRepository);
  private readonly ordersRepository = inject(CheckoutOrderRepository);
  private readonly router = inject(Router);

  readonly step = signal<CheckoutStep>('review');
  readonly submitting = signal(false);
  readonly submissionError = signal<string | null>(null);

  readonly items = this.cartRepository.items;
  readonly itemCount = this.cartRepository.itemCount;
  readonly subtotal = this.cartRepository.subtotal;
  readonly tax = signal(0);
  readonly total = computed(() => this.subtotal() + this.tax());
  readonly hasItems = computed(() => this.items().length > 0);

  readonly detailsForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(120)],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(120), Validators.email],
    }),
    company: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(120)],
    }),
  });

  private readonly detailsStatus = toSignal(
    this.detailsForm.statusChanges.pipe(startWith(this.detailsForm.status)),
    { initialValue: this.detailsForm.status },
  );

  readonly canSubmit = computed(
    () => this.detailsStatus() === 'VALID' && !this.submitting(),
  );

  updateQuantity(id: string, quantity: number): void {
    this.cartRepository.updateQuantity(id, quantity);
  }

  removeItem(id: string): void {
    this.cartRepository.removeItem(id);
  }

  toDetailsStep(): void {
    this.submissionError.set(null);
    this.step.set('details');
  }

  backToReview(): void {
    this.step.set('review');
  }

  submit(): void {
    if (this.detailsForm.invalid) {
      this.detailsForm.markAllAsTouched();
      return;
    }

    const payload = this.buildRequest();
    if (!payload) {
      this.submissionError.set(
        'Your cart is empty. Add an item to place an order.',
      );
      return;
    }

    this.submitting.set(true);
    this.submissionError.set(null);

    this.ordersRepository
      .submit(payload)
      .pipe(
        take(1),
        catchError(() => {
          this.submitting.set(false);
          this.submissionError.set(
            'We could not place your order. Please try again.',
          );
          return of(null);
        }),
      )
      .subscribe((response) => {
        this.submitting.set(false);
        if (!response) {
          return;
        }

        if (!response.success || !response.orderId) {
          this.submissionError.set(
            response.message ?? 'We could not place your order.',
          );
          return;
        }

        this.cartRepository.clear();
        void this.router.navigate(['/checkout/success', response.orderId]);
      });
  }

  private buildRequest(): SubmitCheckoutRequest | null {
    if (!this.hasItems()) {
      return null;
    }

    const request: SubmitCheckoutRequest = {
      items: this.items(),
      subtotal: this.subtotal(),
      tax: 0,
      total: this.total(),
      context: 'storefront',
    };

    const name = normalizeOptionalString(this.detailsForm.controls.name.value);
    const email = normalizeOptionalString(
      this.detailsForm.controls.email.value,
    );
    const company = normalizeOptionalString(
      this.detailsForm.controls.company.value,
    );

    if (name) {
      request.name = name;
    }

    if (email) {
      request.email = email;
    }

    if (company) {
      request.company = company;
    }

    return request;
  }
}

function normalizeOptionalString(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}
