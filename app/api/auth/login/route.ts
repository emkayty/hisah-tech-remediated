import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { createSession, setSessionCookie } from '@/lib/auth';
import { getDatabase } from '@/lib/db';
import { enforceRateLimit } from '@/lib/rate-limit';
import { apiError, ApiError, parseJson } from '@/lib/security';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(1).max(256),
});

export async function POST(request: NextRequest) {
  try {
    await enforceRateLimit(request, 'login', 10, 15 * 60 * 1000);
    const { email, password } = await parseJson(request, loginSchema);
    const database = getDatabase();
    const rows = await database`
      SELECT id, email, password_hash, name, username, role, account_status
      FROM users
      WHERE email = ${email}
      LIMIT 1
    `;

    const user = rows[0] as Record<string, unknown> | undefined;
    const validHash = typeof user?.password_hash === 'string' && user.password_hash.startsWith('$2');
    const passwordMatches = validHash ? await bcrypt.compare(password, user.password_hash as string) : false;

    if (!user || !passwordMatches) {
      throw new ApiError(401, 'Invalid email or password');
    }
    if (user.account_status && user.account_status !== 'active') {
      throw new ApiError(403, 'This account is not active. Contact support if you need help.');
    }

    const token = await createSession(Number(user.id));
    const response = NextResponse.json({
      user: {
        id: Number(user.id),
        email: String(user.email),
        name: user.name ? String(user.name) : null,
        username: user.username ? String(user.username) : null,
      },
    });

    return setSessionCookie(response, token);
  } catch (error) {
    return apiError(error);
  }
}
