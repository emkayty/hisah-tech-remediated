import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { getDatabase } from '@/lib/db';
import { apiError } from '@/lib/security';

export async function GET(request: NextRequest) {
  try { await requireAdmin(request); const database = getDatabase(); const users = await database`SELECT id, email, name, username, country, is_admin, subscription_plan, subscription_expires_at, created_at FROM users ORDER BY created_at DESC LIMIT 200`; return NextResponse.json({ users }); }
  catch (error) { return apiError(error); }
}
