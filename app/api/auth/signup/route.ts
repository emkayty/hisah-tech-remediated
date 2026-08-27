import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { createSession, setSessionCookie } from '@/lib/auth';
import { getDatabase } from '@/lib/db';
import { sendWelcomeEmail } from '@/lib/email';
import { enforceRateLimit } from '@/lib/rate-limit';
import { apiError, ApiError, parseJson } from '@/lib/security';
import { z } from 'zod';
import { findCountry } from '@/lib/countries';

const signupSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(12).max(128),
  name: z.string().trim().min(1).max(120).optional(),
  country: z.string().trim().refine((value) => Boolean(findCountry(value)), 'Choose a valid country'),
  whatsapp_number: z.string().trim().regex(/^\+\d{7,15}$/, 'Enter a valid international mobile number'),
});

export async function POST(request: NextRequest) {
  try {
    await enforceRateLimit(request, 'signup', 5, 60 * 60 * 1000);
    const { email, password, name, country, whatsapp_number } = await parseJson(request, signupSchema);
    const database = getDatabase();

    const existing = await database`SELECT id FROM users WHERE email = ${email} LIMIT 1`;
    if (existing.length) throw new ApiError(409, 'An account already exists for that email address');

    const passwordHash = await bcrypt.hash(password, 12);
    const users = await database`
      INSERT INTO users (email, password_hash, name, country, whatsapp_number, created_at)
      VALUES (${email}, ${passwordHash}, ${name ?? null}, ${country}, ${whatsapp_number}, NOW())
      RETURNING id, email, name, username
    `;
    const user = users[0] as Record<string, unknown>;
    const token = await createSession(Number(user.id));

    void sendWelcomeEmail(email, name).catch((error) => {
      console.error('Welcome email delivery failed', error);
    });

    const response = NextResponse.json(
      { user: { id: Number(user.id), email: String(user.email), name: user.name ?? null, username: user.username ?? null } },
      { status: 201 },
    );
    return setSessionCookie(response, token);
  } catch (error) {
    return apiError(error);
  }
}
