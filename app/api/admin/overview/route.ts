import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { getDatabase } from '@/lib/db';
import { apiError } from '@/lib/security';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    const database = getDatabase();
    const [users, files, subscriptions, revenue, activity] = await Promise.all([
      database`SELECT COUNT(*)::int AS count FROM users`,
      database`SELECT COUNT(*)::int AS count FROM files`,
      database`SELECT COUNT(*)::int AS count FROM users WHERE subscription_plan IS NOT NULL AND subscription_expires_at > NOW()`,
      database`SELECT COALESCE(SUM(amount_cents), 0)::int AS cents FROM payment_orders WHERE status = 'paid'`,
      database`SELECT id, activity_type, plan_id, target_user_id, created_at FROM membership_activity ORDER BY created_at DESC LIMIT 8`,
    ]);
    return NextResponse.json({
      stats: { users: Number(users[0]?.count || 0), files: Number(files[0]?.count || 0), activeSubscriptions: Number(subscriptions[0]?.count || 0), revenueCents: Number(revenue[0]?.cents || 0) },
      activity,
    });
  } catch (error) { return apiError(error); }
}
