import { NextRequest, NextResponse } from 'next/server';
import { assertSameOrigin, requireAdmin } from '@/lib/auth';
import { getDatabase } from '@/lib/db';
import { apiError, parseJson } from '@/lib/security';
import { z } from 'zod';

const planSchema = z.object({
  id: z.string().regex(/^[a-z0-9_]+$/).max(64),
  name: z.string().trim().min(2).max(80),
  description: z.string().trim().max(300),
  amountCents: z.number().int().min(0).max(100000000),
  currency: z.string().regex(/^[a-z]{3}$/),
  durationDays: z.number().int().min(1).max(3660),
  features: z.array(z.string().trim().min(1).max(120)).max(20),
  isActive: z.boolean(),
  displayOrder: z.number().int().min(0).max(10000),
});

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    const database = getDatabase();
    const plans = await database`SELECT id, name, description, amount_cents, currency, duration_days, features, is_active, display_order, updated_at FROM membership_plans ORDER BY display_order ASC, id ASC LIMIT 100`;
    return NextResponse.json({ plans });
  } catch (error) { return apiError(error); }
}

export async function PUT(request: NextRequest) {
  try {
    assertSameOrigin(request);
    const admin = await requireAdmin(request);
    const payload = await parseJson(request, planSchema);
    const database = getDatabase();
    const existing = await database`SELECT id FROM membership_plans WHERE id = ${payload.id} LIMIT 1`;
    await database`
      INSERT INTO membership_plans (id, name, description, amount_cents, currency, duration_days, features, is_active, display_order, updated_at)
      VALUES (${payload.id}, ${payload.name}, ${payload.description}, ${payload.amountCents}, ${payload.currency.toLowerCase()}, ${payload.durationDays}, ${JSON.stringify(payload.features)}::jsonb, ${payload.isActive}, ${payload.displayOrder}, NOW())
      ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, amount_cents = EXCLUDED.amount_cents, currency = EXCLUDED.currency, duration_days = EXCLUDED.duration_days, features = EXCLUDED.features, is_active = EXCLUDED.is_active, display_order = EXCLUDED.display_order, updated_at = NOW()
    `;
    await database`
      INSERT INTO membership_activity (actor_id, plan_id, activity_type, details)
      VALUES (${admin.id}, ${payload.id}, ${existing.length ? 'plan_updated' : 'plan_created'}, ${JSON.stringify({ name: payload.name, amountCents: payload.amountCents, currency: payload.currency, isActive: payload.isActive })}::jsonb)
    `;
    return NextResponse.json({ success: true });
  } catch (error) { return apiError(error); }
}
