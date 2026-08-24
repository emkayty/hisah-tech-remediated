import { NextResponse } from 'next/server';
import { getDatabase, isDatabaseConfigured } from '@/lib/db';
import { apiError } from '@/lib/security';

export async function GET() {
  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ enabledProviders: [] });
    }
    const database = getDatabase();
    const settings = await database`
      SELECT provider FROM payment_settings WHERE enabled = TRUE ORDER BY provider
    `;
    return NextResponse.json({ enabledProviders: settings.map((setting) => setting.provider) });
  } catch (error) {
    return apiError(error);
  }
}
