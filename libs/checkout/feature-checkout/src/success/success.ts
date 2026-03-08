import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  CheckoutOrderRepository,
  MAIN_DOMAIN_URL,
} from '@cleanup/data-access-checkout';
import { SharedDesignSurface } from '@cleanup/shared-ui-design-surface';
import { SharedDesignText } from '@cleanup/shared-ui-design-text';
import { catchError, map, of, startWith, switchMap } from 'rxjs';

type SuccessState = {
  loading: boolean;
  error: string | null;
  orderId: string | null;
  order: {
    id: string;
    items: {
      quantity: number;
    }[];
    subtotal: number;
    tax: number;
    total: number;
    createdAt: string;
  } | null;
};

@Component({
  selector: 'checkout-success',
  imports: [
    CommonModule,
    RouterLink,
    CurrencyPipe,
    DatePipe,
    SharedDesignSurface,
    SharedDesignText,
  ],
  templateUrl: './success.html',
  styleUrl: './success.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutSuccess {
  private readonly route = inject(ActivatedRoute);
  private readonly repository = inject(CheckoutOrderRepository);

  readonly mainDomainUrl = inject(MAIN_DOMAIN_URL);

  readonly successState = toSignal(
    this.route.paramMap.pipe(
      map((params) => params.get('orderId')),
      switchMap((orderId) => {
        if (!orderId) {
          return of<SuccessState>({
            loading: false,
            error: 'Order ID is missing.',
            orderId: null,
            order: null,
          });
        }

        return this.repository.getById(orderId).pipe(
          map((response) => {
            if (response.success && response.order) {
              return {
                loading: false,
                error: null,
                orderId,
                order: response.order,
              } satisfies SuccessState;
            }

            return {
              loading: false,
              error: response.message ?? 'Order could not be found.',
              orderId,
              order: null,
            } satisfies SuccessState;
          }),
          startWith({
            loading: true,
            error: null,
            orderId,
            order: null,
          } satisfies SuccessState),
          catchError(() =>
            of<SuccessState>({
              loading: false,
              error: 'Could not load order details.',
              orderId,
              order: null,
            }),
          ),
        );
      }),
    ),
    {
      initialValue: {
        loading: true,
        error: null,
        orderId: null,
        order: null,
      } satisfies SuccessState,
    },
  );

  readonly loading = computed(() => this.successState().loading);
  readonly error = computed(() => this.successState().error);
  readonly order = computed(() => this.successState().order);
  readonly itemCount = computed(() =>
    (this.order()?.items ?? []).reduce(
      (count, item) => count + item.quantity,
      0,
    ),
  );
}
