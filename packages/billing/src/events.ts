/**
 * Stripe webhook event types the order payment state machine reacts to. Shared so
 * the webhook handler switches on named constants rather than duplicated string
 * literals (a typo would otherwise silently skip a transition).
 */
export const STRIPE_WEBHOOK_EVENTS = {
  /** Checkout paid → order PENDING → PAID. */
  checkoutCompleted: 'checkout.session.completed',
  /** Async payment (e.g. bank transfer) failed → order PENDING → FAILED. */
  checkoutAsyncPaymentFailed: 'checkout.session.async_payment_failed',
  /** Charge refunded → order PAID → REFUNDED. */
  chargeRefunded: 'charge.refunded',
} as const;

export type StripeWebhookEvent = (typeof STRIPE_WEBHOOK_EVENTS)[keyof typeof STRIPE_WEBHOOK_EVENTS];
