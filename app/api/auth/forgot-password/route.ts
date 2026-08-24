import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { sendPasswordResetEmail } from '@/lib/email';
import { enforceRateLimit } from '@/lib/rate-limit';
import { apiError, ApiError, parseJson, randomToken, tokenDigest } from '@/lib/security';
import { z } from 'zod';

const requestSchema = z.object({ email: z.string().trim().toLowerCase().email().max(254) });
const genericResponse = { message: 'If an account exists with that email, a password reset link has been sent.' };

export async function POST(request: NextRequest) {
  try {
    enforceRateLimit(request, 'password-reset-request', 5, 60 * 60 * 1000);
    const { email } = await parseJson(request, requestSchema);
    const database = getDatabase();
    const users = await database`SELECT id, email FROM users WHERE email = ${email} LIMIT 1`;
    if (!users.length) return NextResponse.json(genericResponse);

    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!appUrl || !process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) {
      throw new ApiError(503, 'Password reset is temporarily unavailable');
    }

    const token = randomToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    await database`
      UPDATE users
      SET reset_token_hash = ${tokenDigest(token)}, reset_token_expires = ${expiresAt}
      WHERE id = ${users[0].id}
    `;

    await sendPasswordResetEmail(String(users[0].email), `${appUrl}/reset-password?token=${encodeURIComponent(token)}`);
    return NextResponse.json(genericResponse);
  } catch (error) {
    return apiError(error);
  }
}
