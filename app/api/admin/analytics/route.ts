import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { getDatabase } from '@/lib/db';
import { apiError } from '@/lib/security';

export async function GET(request: NextRequest) {
  try { await requireAdmin(request); const database = getDatabase(); const [users, files, threads, replies, orders, plans] = await Promise.all([database`SELECT COUNT(*)::int AS count FROM users`, database`SELECT COUNT(*)::int AS count, COALESCE(SUM(downloads), 0)::int AS downloads FROM files`, database`SELECT COUNT(*)::int AS count FROM forum_threads`, database`SELECT COUNT(*)::int AS count FROM forum_replies`, database`SELECT COUNT(*)::int AS count, COALESCE(SUM(amount_cents) FILTER (WHERE status = 'paid'), 0)::int AS paid_cents FROM payment_orders`, database`SELECT id, name, is_active FROM membership_plans ORDER BY display_order ASC, id ASC LIMIT 50`]); return NextResponse.json({ totals: { users: Number(users[0]?.count || 0), files: Number(files[0]?.count || 0), downloads: Number(files[0]?.downloads || 0), threads: Number(threads[0]?.count || 0), replies: Number(replies[0]?.count || 0), orders: Number(orders[0]?.count || 0), paidCents: Number(orders[0]?.paid_cents || 0) }, plans }); }
  catch (error) { return apiError(error); }
}
