/** Payment status for an order, replacing the old on-chain XYM order status machine. */
export type OrderPaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface CreateCheckoutParams {
  /** Our order id — round-tripped via Checkout Session `client_reference_id` / metadata. */
  orderId: string;
  /** Human-readable line item name. */
  name: string;
  /** Amount in the smallest currency unit (JPY is zero-decimal, so this is yen). */
  amount: number;
  /** ISO currency code; defaults to 'jpy'. */
  currency?: string;
  quantity?: number;
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
}
