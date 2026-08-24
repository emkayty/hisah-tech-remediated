import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { apiError, ApiError } from '@/lib/security';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ username: string }> },
) {
  try {
    const { username } = await params;
    if (!/^[a-zA-Z0-9_]{3,32}$/.test(username)) {
      throw new ApiError(400, 'Invalid username');
    }

    const database = getDatabase();
    const users = await database`
      SELECT username, name, bio, avatar_url, location, website, company, created_at
      FROM users
      WHERE username = ${username}
      LIMIT 1
    `;
    if (!users.length) throw new ApiError(404, 'User not found');

    return NextResponse.json(users[0]);
  } catch (error) {
    return apiError(error);
  }
}
