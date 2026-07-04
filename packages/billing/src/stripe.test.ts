import type Stripe from 'stripe';
import { describe, expect, it, vi } from 'vitest';
import { createCheckoutSession, createRefund } from './stripe';

function mockStripe() {
  const create = vi.fn(async (arg: unknown) => arg);
  return {
    stripe: { checkout: { sessions: { create } } } as unknown as Stripe,
    create,
  };
}

describe('createCheckoutSession', () => {
  it('maps order params into a one-time Checkout Session with sensible defaults', async () => {
    const { stripe, create } = mockStripe();
    await createCheckoutSession(stripe, {
      orderId: 'ord_1',
      amount: 1500,
      name: 'T-shirt',
      customerEmail: 'buyer@example.com',
      successUrl: 'https://shop/success',
      cancelUrl: 'https://shop/cancel',
    });
    expect(create).toHaveBeenCalledTimes(1);
    const arg = create.mock.calls[0]![0] as any;
    expect(arg).toMatchObject({
      mode: 'payment',
      client_reference_id: 'ord_1',
      metadata: { orderId: 'ord_1' },
      customer_email: 'buyer@example.com',
      success_url: 'https://shop/success',
      cancel_url: 'https://shop/cancel',
    });
    expect(arg.line_items[0]).toMatchObject({
      quantity: 1,
      price_data: {
        currency: 'jpy',
        unit_amount: 1500,
        product_data: { name: 'T-shirt' },
      },
    });
  });

  it('honors explicit currency and quantity', async () => {
    const { stripe, create } = mockStripe();
    await createCheckoutSession(stripe, {
      orderId: 'o',
      amount: 10,
      name: 'x',
      currency: 'usd',
      quantity: 3,
      successUrl: 's',
      cancelUrl: 'c',
    });
    const arg = create.mock.calls[0]![0] as any;
    expect(arg.line_items[0].quantity).toBe(3);
    expect(arg.line_items[0].price_data.currency).toBe('usd');
  });
});

describe('createRefund', () => {
  it('refunds a full payment by PaymentIntent id', async () => {
    const create = vi.fn(async (arg: unknown) => arg);
    const stripe = { refunds: { create } } as unknown as Stripe;
    await createRefund(stripe, 'pi_1');
    expect(create).toHaveBeenCalledWith({ payment_intent: 'pi_1' });
  });

  it('supports a partial refund amount', async () => {
    const create = vi.fn(async (arg: unknown) => arg);
    const stripe = { refunds: { create } } as unknown as Stripe;
    await createRefund(stripe, 'pi_1', { amount: 500 });
    expect(create).toHaveBeenCalledWith({ payment_intent: 'pi_1', amount: 500 });
  });
});
