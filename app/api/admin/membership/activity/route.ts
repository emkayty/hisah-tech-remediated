import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { getDatabase } from '@/lib/db';
import { apiError } from '@/lib/security';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    const database = getDatabase();
    const activity = await database`
      SELECT a.id, a.activity_type, a.details, a.created_at, a.plan_id,
             actor.email AS actor_email, target.email AS target_email
      FROM membership_activity a
      LEFT JOIN users actor ON actor.id = a.actor_id
      LEFT JOIN users target ON target.id = a.target_user_id
      ORDER BY a.created_at DESC
      LIMIT 200
    `;
    return NextResponse.json({ activity });
  } catch (error) { return apiError(error); }
}
