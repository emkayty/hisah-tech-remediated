import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';
import { activateStripeOrder } from '@/lib/payments';
import { apiError, ApiError } from '@/lib/security';

export async function POST(request: NextRequest) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const signature = request.headers.get('stripe-signature');
    if (!secretKey || !webhookSecret) throw new ApiError(503, 'Stripe webhook is not configured');
    if (!signature) throw new ApiError(400, 'Missing Stripe signature');

    const stripe = new Stripe(secretKey);
    const event = stripe.webhooks.constructEvent(await request.text(), signature, webhookSecret);
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.payment_status !== 'paid') throw new ApiError(409, 'Checkout is not paid');
      await activateStripeOrder({
        providerEventId: event.id,
        stripeSessionId: session.id,
        paymentIntentId: typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id ?? null,
        amountTotal: session.amount_total,
        currency: session.currency,
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return apiError(error);
  }
}
