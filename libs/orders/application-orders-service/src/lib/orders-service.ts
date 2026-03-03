import {
  getOrderById,
  saveOrder,
} from '@angular-cleanup-shop/infrastructure-orders-datastore';
import {
  type CreateOrderRequest,
  type CreateOrderResponse,
  type Order,
  type OrderItem,
} from '@cleanup/models-orders';

const EPSILON = 0.01;

export async function processOrder(
  request: CreateOrderRequest,
): Promise<CreateOrderResponse> {
  const validationError = validateOrderRequest(request);
  if (validationError) {
    return {
      success: false,
      message: validationError,
      error: validationError,
    };
  }

  const normalizedItems = request.items.map((item) => ({
    ...item,
    quantity: Math.floor(item.quantity),
  }));
  const subtotal = roundCurrency(calculateSubtotal(normalizedItems));

  if (!isMoneyEqual(request.subtotal, subtotal)) {
    return {
      success: false,
      message: 'Subtotal does not match item totals.',
      error: 'INVALID_SUBTOTAL',
    };
  }

  if (!isMoneyEqual(request.tax, 0)) {
    return {
      success: false,
      message: 'Tax must be 0 for storefront demo checkout.',
      error: 'INVALID_TAX',
    };
  }

  const total = roundCurrency(subtotal + request.tax);
  if (!isMoneyEqual(request.total, total)) {
    return {
      success: false,
      message: 'Total does not match subtotal + tax.',
      error: 'INVALID_TOTAL',
    };
  }

  try {
    const savedOrder = await saveOrder({
      items: normalizedItems,
      subtotal,
      tax: 0,
      total,
      name: normalizeOptionalString(request.name),
      email: normalizeOptionalString(request.email),
      company: normalizeOptionalString(request.company),
      context: 'storefront',
    });

    console.log(
      '[ORDERS] created',
      JSON.stringify({
        orderId: savedOrder.id,
        total: savedOrder.total,
        itemCount: savedOrder.items.reduce(
          (count, item) => count + item.quantity,
          0,
        ),
      }),
    );

    return {
      success: true,
      order: savedOrder,
    };
  } catch (error) {
    console.error('[ORDERS] Error processing order:', error);

    return {
      success: false,
      message: 'Error processing order',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function getOrderDetails(orderId: string): Promise<Order | null> {
  return getOrderById(orderId);
}

function validateOrderRequest(request: CreateOrderRequest): string | null {
  if (!Array.isArray(request.items) || request.items.length === 0) {
    return 'At least one item is required.';
  }

  const hasInvalidItem = request.items.some((item) => !isValidOrderItem(item));
  if (hasInvalidItem) {
    return 'Items contain invalid values.';
  }

  if (!isValidMoney(request.subtotal)) {
    return 'Subtotal must be a valid amount.';
  }

  if (!isValidMoney(request.tax)) {
    return 'Tax must be a valid amount.';
  }

  if (!isValidMoney(request.total)) {
    return 'Total must be a valid amount.';
  }

  if (!isOptionalContactValueValid(request.name)) {
    return 'Name must be 120 characters or fewer.';
  }

  if (!isOptionalContactValueValid(request.company)) {
    return 'Company must be 120 characters or fewer.';
  }

  if (!isOptionalContactValueValid(request.email)) {
    return 'Email must be 120 characters or fewer.';
  }

  const email = normalizeOptionalString(request.email);
  if (email && !isValidEmail(email)) {
    return 'Email must be valid.';
  }

  return null;
}

function isValidOrderItem(item: OrderItem): boolean {
  return (
    typeof item.id === 'string' &&
    item.id.trim().length > 0 &&
    typeof item.slug === 'string' &&
    item.slug.trim().length > 0 &&
    typeof item.name === 'string' &&
    item.name.trim().length > 0 &&
    typeof item.price === 'number' &&
    Number.isFinite(item.price) &&
    item.price >= 0 &&
    typeof item.quantity === 'number' &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0 &&
    typeof item.imageSrc === 'string' &&
    item.imageSrc.trim().length > 0 &&
    typeof item.imageAlt === 'string' &&
    item.imageAlt.trim().length > 0
  );
}

function calculateSubtotal(items: OrderItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}

function isMoneyEqual(actual: number, expected: number): boolean {
  return Math.abs(roundCurrency(actual) - roundCurrency(expected)) < EPSILON;
}

function isValidMoney(value: number): boolean {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}

function normalizeOptionalString(
  value: string | undefined,
): string | undefined {
  if (!value) {
    return undefined;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : undefined;
}

function isOptionalContactValueValid(value: string | undefined): boolean {
  if (value === undefined) {
    return true;
  }

  return value.trim().length <= 120;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(value);
}
