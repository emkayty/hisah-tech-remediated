import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { assertSameOrigin, createSession, requireUser, revokeAllSessions, setSessionCookie } from '@/lib/auth';
import { getDatabase } from '@/lib/db';
import { apiError, ApiError, parseJson } from '@/lib/security';
import { z } from 'zod';

const passwordSchema = z.object({
  currentPassword: z.string().min(1).max(256),
  newPassword: z.string().min(12).max(128),
});

export async function PUT(request: NextRequest) {
  try {
    assertSameOrigin(request);
    const user = await requireUser(request);
    const { currentPassword, newPassword } = await parseJson(request, passwordSchema);
    const database = getDatabase();
    const rows = await database`SELECT password_hash FROM users WHERE id = ${user.id} LIMIT 1`;
    const hash = rows[0]?.password_hash;

    if (typeof hash !== 'string' || !hash.startsWith('$2') || !(await bcrypt.compare(currentPassword, hash))) {
      throw new ApiError(401, 'Current password is incorrect');
    }

    const newHash = await bcrypt.hash(newPassword, 12);
    await database`UPDATE users SET password_hash = ${newHash}, updated_at = NOW() WHERE id = ${user.id}`;
    await revokeAllSessions(user.id);
    const token = await createSession(user.id);

    return setSessionCookie(NextResponse.json({ message: 'Password changed successfully' }), token);
  } catch (error) {
    return apiError(error);
  }
}
