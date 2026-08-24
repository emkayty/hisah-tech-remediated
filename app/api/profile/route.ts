import { NextRequest, NextResponse } from 'next/server';
import { assertSameOrigin, requireUser } from '@/lib/auth';
import { getDatabase } from '@/lib/db';
import { apiError, parseJson } from '@/lib/security';
import { z } from 'zod';

const profileSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  bio: z.string().trim().max(1000).nullable().optional(),
  avatar_url: z.string().url().max(2048).nullable().optional(),
  location: z.string().trim().max(160).nullable().optional(),
  website: z.string().url().max(2048).nullable().optional(),
  company: z.string().trim().max(160).nullable().optional(),
});

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
          updated_at = NOW()
      WHERE id = ${principal.id}
      RETURNING id, username, email, name, bio, avatar_url, location, website, company, created_at
    `;

    return NextResponse.json({ message: 'Profile updated successfully', user: users[0] });
  } catch (error) {
    return apiError(error);
  }
}
