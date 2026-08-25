import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { apiError } from '@/lib/security';

export async function GET() {
  try {
    const database = getDatabase();
    const plans = await database`
      SELECT id, name, description, amount_cents, currency, duration_days, features, is_active, display_order
      FROM membership_plans
      WHERE is_active = TRUE
      ORDER BY display_order ASC, id ASC
      LIMIT 50
    `;
    return NextResponse.json({ plans });
  } catch (error) {
    return apiError(error);
  }
}
