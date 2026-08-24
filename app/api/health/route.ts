import { NextResponse } from 'next/server';
import { getDatabase, isDatabaseConfigured } from '@/lib/db';

export async function GET() {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ status: 'degraded', database: 'unconfigured' }, { status: 503 });
  }

  try {
    await getDatabase()`SELECT 1 AS ok`;
    return NextResponse.json({ status: 'ok' });
  } catch {
    return NextResponse.json({ status: 'degraded', database: 'unavailable' }, { status: 503 });
  }
}
