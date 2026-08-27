import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';
import { assertSameOrigin, requireUser } from '@/lib/auth';
import { getDatabase } from '@/lib/db';
import { enforceRateLimit } from '@/lib/rate-limit';
import { apiError, ApiError, parseJson } from '@/lib/security';
import { z } from 'zod';

const checkoutSchema = z.object({ planId: z.string().regex(/^[a-z0-9_]+$/).max(64) });

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    await enforceRateLimit(request, 'stripe-checkout', 10, 60 * 60 * 1000);
    const user = await requireUser(request);
    const { planId } = await parseJson(request, checkoutSchema);
    const database = getDatabase();
    const plans = await database`SELECT id, name, amount_cents, currency, duration_days FROM membership_plans WHERE id = ${planId} AND is_active = TRUE LIMIT 1`;
    if (!plans.length) throw new ApiError(400, 'Choose an available membership plan');
    const plan = plans[0];
    const secretKey = process.env.STRIPE_SECRET_KEY;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!secretKey || !appUrl) throw new ApiError(503, 'Card checkout is not configured');

    const orders = await database`
      INSERT INTO payment_orders (user_id, provider, plan_id, amount_cents, currency, status, created_at, updated_at)
      VALUES (${user.id}, 'stripe', ${plan.id}, ${Number(plan.amount_cents)}, ${String(plan.currency).toLowerCase()}, 'pending', NOW(), NOW())
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
          currency: String(plan.currency).toLowerCase(),
          unit_amount: Number(plan.amount_cents),
          product_data: { name: String(plan.name) },
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
