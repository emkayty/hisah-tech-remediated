import { NextRequest, NextResponse } from 'next/server';
import { clearSessionCookie, revokeSession } from '@/lib/auth';
import { apiError } from '@/lib/security';

export async function POST(request: NextRequest) {
  try {
    await revokeSession(request.cookies.get('hisah_session')?.value);
    return clearSessionCookie(NextResponse.json({ success: true }));
  } catch (error) {
    return apiError(error);
  }
}
