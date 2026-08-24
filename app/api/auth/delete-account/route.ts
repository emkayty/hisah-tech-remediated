import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { assertSameOrigin, clearSessionCookie, requireUser } from '@/lib/auth';
import { getDatabase } from '@/lib/db';
import { apiError, ApiError, parseJson } from '@/lib/security';
import { z } from 'zod';

const deleteSchema = z.object({
  confirmation: z.literal('DELETE'),
  password: z.string().min(1).max(256),
});

export async function DELETE(request: NextRequest) {
  try {
    assertSameOrigin(request);
    const principal = await requireUser(request);
    const { confirmation, password } = await parseJson(request, deleteSchema);
    void confirmation;
    const database = getDatabase();
    const rows = await database`SELECT password_hash FROM users WHERE id = ${principal.id} LIMIT 1`;
    const hash = rows[0]?.password_hash;
    const matches = typeof hash === 'string' && hash.startsWith('$2') && await bcrypt.compare(password, hash);
    if (!matches) throw new ApiError(401, 'Password confirmation failed');

    // Foreign keys in the migration define the dependent-record cascade atomically.
    await database`DELETE FROM users WHERE id = ${principal.id}`;
    return clearSessionCookie(NextResponse.json({ message: 'Account deleted successfully' }));
  } catch (error) {
    return apiError(error);
  }
}
