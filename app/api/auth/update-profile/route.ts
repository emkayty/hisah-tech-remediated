import { NextRequest, NextResponse } from 'next/server';
import { assertSameOrigin, requireUser } from '@/lib/auth';
import { getDatabase } from '@/lib/db';
import { sendEmailAddressChanged } from '@/lib/email';
import { apiError, ApiError, parseJson } from '@/lib/security';
import { z } from 'zod';

const updateProfileSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().toLowerCase().email().max(254),
  username: z.string().trim().min(3).max(32).regex(/^[a-zA-Z0-9_]+$/),
});

export async function PUT(request: NextRequest) {
  try {
    assertSameOrigin(request);
    const principal = await requireUser(request);
    const { name, email, username } = await parseJson(request, updateProfileSchema);
    const database = getDatabase();

    const conflicts = await database`
      SELECT id FROM users
      WHERE (email = ${email} OR username = ${username}) AND id <> ${principal.id}
      LIMIT 1
    `;
    if (conflicts.length) throw new ApiError(409, 'Email address or username is already in use');

    const rows = await database`
      UPDATE users
      SET name = ${name}, email = ${email}, username = ${username}, updated_at = NOW()
      WHERE id = ${principal.id}
      RETURNING id, email, name, username, created_at
    `;

    if (principal.email !== email) {
      void sendEmailAddressChanged(principal.email, name).catch((error) => {
        console.error('Email-change notification delivery failed', error);
      });
    }

    return NextResponse.json({ message: 'Profile updated successfully', user: rows[0] });
  } catch (error) {
    return apiError(error);
  }
}
