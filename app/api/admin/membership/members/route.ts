import { NextRequest, NextResponse } from 'next/server';
import { assertSameOrigin } from '@/lib/auth';
import { requirePermission } from '@/lib/rbac';
import { getDatabase } from '@/lib/db';
import { apiError, parseJson } from '@/lib/security';
import { z } from 'zod';

const memberSchema = z.object({
  userId: z.number().int().positive(),
  action: z.enum(['grant', 'extend', 'cancel']),
  planId: z.string().regex(/^[a-z0-9_]+$/).max(64).nullable().optional(),
});

export async function GET(request: NextRequest) {
  try {
    await requirePermission(request, 'membership.manage');
    const database = getDatabase();
    const members = await database`
      SELECT id, email, name, username, country, subscription_plan, subscription_expires_at, created_at
      FROM users
      ORDER BY created_at DESC
      LIMIT 200
    `;
    return NextResponse.json({ members });
  } catch (error) { return apiError(error); }
}

export async function PUT(request: NextRequest) {
  try {
    assertSameOrigin(request);
    const admin = await requirePermission(request, 'membership.manage');
    const payload = await parseJson(request, memberSchema);
    const database = getDatabase();
    const users = await database`SELECT id, subscription_plan, subscription_expires_at FROM users WHERE id = ${payload.userId} LIMIT 1`;
    if (!users.length) return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    if (payload.action !== 'cancel' && !payload.planId) return NextResponse.json({ error: 'Choose a plan' }, { status: 400 });
    let planDurationDays = 0;
    if (payload.planId) {
      const plans = await database`SELECT id, duration_days FROM membership_plans WHERE id = ${payload.planId} AND is_active = TRUE LIMIT 1`;
      if (!plans.length) return NextResponse.json({ error: 'Choose an active plan' }, { status: 400 });
      planDurationDays = Number(plans[0].duration_days);
    }
    const currentExpiry = users[0].subscription_expires_at ? new Date(String(users[0].subscription_expires_at)) : new Date();
    const days = payload.action === 'cancel' ? 0 : planDurationDays;
    const expiry = new Date(Math.max(currentExpiry.getTime(), Date.now()) + days * 86400000).toISOString();
    if (payload.action === 'cancel') {
      await database`UPDATE users SET subscription_plan = NULL, subscription_expires_at = NULL, updated_at = NOW() WHERE id = ${payload.userId}`;
    } else {
      await database`UPDATE users SET subscription_plan = ${payload.planId}, subscription_expires_at = ${expiry}::timestamptz, updated_at = NOW() WHERE id = ${payload.userId}`;
    }
    await database`INSERT INTO membership_activity (actor_id, target_user_id, plan_id, activity_type, details) VALUES (${admin.id}, ${payload.userId}, ${payload.planId}, ${payload.action === 'cancel' ? 'subscription_cancelled' : payload.action === 'grant' ? 'subscription_granted' : 'subscription_extended'}, ${JSON.stringify({ durationDays: days, source: 'plan_duration' })}::jsonb)`;
    return NextResponse.json({ success: true });
  } catch (error) { return apiError(error); }
}
