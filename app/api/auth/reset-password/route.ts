import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { revokeAllSessions } from '@/lib/auth';
import { getDatabase } from '@/lib/db';
import { enforceRateLimit } from '@/lib/rate-limit';
import { apiError, ApiError, parseJson, tokenDigest } from '@/lib/security';
import { z } from 'zod';

const resetSchema = z.object({
  token: z.string().min(32).max(256),
  password: z.string().min(12).max(128),
});

export async function POST(request: NextRequest) {
  try {
    enforceRateLimit(request, 'password-reset-complete', 10, 60 * 60 * 1000);
    const { token, password } = await parseJson(request, resetSchema);
    const database = getDatabase();
    const passwordHash = await bcrypt.hash(password, 12);
    const users = await database`
      UPDATE users
      SET password_hash = ${passwordHash},
          reset_token_hash = NULL,
          reset_token_expires = NULL,
          updated_at = NOW()
      WHERE reset_token_hash = ${tokenDigest(token)}
        AND reset_token_expires > NOW()
      RETURNING id
    `;

    if (!users.length) throw new ApiError(400, 'Invalid or expired reset token');
    await revokeAllSessions(Number(users[0].id));
    return NextResponse.json({ message: 'Password has been reset successfully' });
  } catch (error) {
    return apiError(error);
  }
}
