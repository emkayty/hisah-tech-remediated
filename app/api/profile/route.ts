import { NextRequest, NextResponse } from 'next/server';
import { assertSameOrigin, requireUser } from '@/lib/auth';
import { getDatabase } from '@/lib/db';
import { apiError, parseJson } from '@/lib/security';
import { z } from 'zod';
import { findCountry } from '@/lib/countries';

const profileSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  bio: z.string().trim().max(1000).nullable().optional(),
  avatar_url: z.string().url().max(2048).nullable().optional(),
  location: z.string().trim().max(160).nullable().optional(),
  website: z.string().url().max(2048).nullable().optional(),
  company: z.string().trim().max(160).nullable().optional(),
  country: z.string().trim().refine((value) => Boolean(findCountry(value)), 'Choose a valid country').nullable().optional(),
  whatsapp_number: z.string().trim().regex(/^\+\d{7,15}$/, 'Enter a valid international mobile number').nullable().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const principal = await requireUser(request);
    const database = getDatabase();
    const users = await database`
      SELECT id, username, email, name, bio, avatar_url, location, website, company, country, whatsapp_number, created_at
      FROM users
      WHERE id = ${principal.id}
      LIMIT 1
    `;
    return NextResponse.json({ user: users[0] ?? null });
  } catch (error) {
    return apiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    assertSameOrigin(request);
    const principal = await requireUser(request);
    const profile = await parseJson(request, profileSchema);
    const database = getDatabase();
    const users = await database`
      UPDATE users
      SET name = COALESCE(${profile.name ?? null}, name),
          bio = ${profile.bio ?? null},
          avatar_url = ${profile.avatar_url ?? null},
          location = ${profile.location ?? null},
          website = ${profile.website ?? null},
          company = ${profile.company ?? null},
          country = COALESCE(${profile.country ?? null}, country),
          whatsapp_number = COALESCE(${profile.whatsapp_number ?? null}, whatsapp_number),
          updated_at = NOW()
      WHERE id = ${principal.id}
      RETURNING id, username, email, name, bio, avatar_url, location, website, company, country, whatsapp_number, created_at
    `;

    return NextResponse.json({ message: 'Profile updated successfully', user: users[0] });
  } catch (error) {
    return apiError(error);
  }
}
