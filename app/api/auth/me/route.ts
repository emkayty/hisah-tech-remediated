import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { apiError } from '@/lib/security';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    return NextResponse.json({ user });
  } catch (error) {
    return apiError(error);
  }
}
