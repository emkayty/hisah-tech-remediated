import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { getDatabase } from '@/lib/db';
import { apiError } from '@/lib/security';

export async function GET(request: NextRequest) {
  try {
    const principal = await requireUser(request);
    const database = getDatabase();
    const result = await database`
      SELECT COUNT(*) AS count
      FROM messages m
      INNER JOIN conversation_participants cp ON cp.conversation_id = m.conversation_id
      WHERE cp.user_id = ${principal.id}
        AND m.sender_id <> ${principal.id}
        AND m.created_at > cp.last_read_at
    `;
    return NextResponse.json({ count: Number(result[0]?.count ?? 0) });
  } catch (error) {
    return apiError(error);
  }
}
