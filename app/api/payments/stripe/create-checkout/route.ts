import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';
import { assertSameOrigin, requireUser } from '@/lib/auth';
import { getDatabase } from '@/lib/db';
import { PLANS, type PlanId } from '@/lib/plans';
import { enforceRateLimit } from '@/lib/rate-limit';
import { apiError, ApiError, parseJson } from '@/lib/security';
import { z } from 'zod';

const checkoutSchema = z.object({
  planId: z.enum(['standard_monthly', 'standard_yearly', 'premium_monthly']),
});

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    enforceRateLimit(request, 'stripe-checkout', 10, 60 * 60 * 1000);
    const user = await requireUser(request);
    const { planId } = await parseJson(request, checkoutSchema);
    const plan = PLANS[planId as PlanId];
    const secretKey = process.env.STRIPE_SECRET_KEY;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!secretKey || !appUrl) throw new ApiError(503, 'Card checkout is not configured');

    const database = getDatabase();
    const orders = await database`
      INSERT INTO payment_orders (user_id, provider, plan_id, amount_cents, currency, status, created_at, updated_at)
      VALUES (${user.id}, 'stripe', ${plan.id}, ${plan.amountCents}, ${plan.currency}, 'pending', NOW(), NOW())
      RETURNING id
    `;
    const orderId = Number(orders[0].id);
    const stripe = new Stripe(secretKey);
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: user.email,
      client_reference_id: String(orderId),
      metadata: { orderId: String(orderId) },
      line_items: [{
        quantity: 1,
        price_data: {
          currency: plan.currency,
          unit_amount: plan.amountCents,
          product_data: { name: plan.name },
        },
      }],
      success_url: `${appUrl}/pricing?checkout=success`,
      cancel_url: `${appUrl}/pricing?checkout=cancelled`,
    }, { idempotencyKey: `hisah-order-${orderId}` });

    await database`
      UPDATE payment_orders
      SET provider_reference = ${session.id}, updated_at = NOW()
      WHERE id = ${orderId}
    `;
    return NextResponse.json({ checkoutUrl: session.url });
  } catch (error) {
    return apiError(error);
  }
}
