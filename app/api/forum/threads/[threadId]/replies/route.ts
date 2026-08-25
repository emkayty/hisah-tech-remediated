import { NextRequest, NextResponse } from 'next/server';
import { assertSameOrigin, requireUser } from '@/lib/auth';
import { getDatabase } from '@/lib/db';
import { apiError, ApiError, parseJson } from '@/lib/security';
import { z } from 'zod';

const replySchema = z.object({ body: z.string().trim().min(1).max(10000) });

function parseThreadId(value: string) {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) throw new ApiError(400, 'Invalid thread');
  return id;
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ threadId: string }> }) {
  try {
    const id = parseThreadId((await params).threadId);
    const database = getDatabase();
    const replies = await database`
      SELECT r.id, r.body, r.created_at, r.updated_at,
             u.id AS author_id, COALESCE(u.name, u.username, 'Hisah Tech member') AS author_name,
             u.username AS author_username
      FROM forum_replies r
      INNER JOIN users u ON u.id = r.author_id
      WHERE r.thread_id = ${id}
      ORDER BY r.created_at ASC
      LIMIT 200
    `;
    return NextResponse.json(replies);
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ threadId: string }> }) {
  try {
    assertSameOrigin(request);
    const principal = await requireUser(request);
    const id = parseThreadId((await params).threadId);
    const payload = await parseJson(request, replySchema);
    const database = getDatabase();
    const threads = await database`SELECT id FROM forum_threads WHERE id = ${id} LIMIT 1`;
    if (!threads.length) throw new ApiError(404, 'Thread not found');
    const replies = await database`
      INSERT INTO forum_replies (thread_id, author_id, body)
      VALUES (${id}, ${principal.id}, ${payload.body})
      RETURNING id
    `;
    await database`UPDATE forum_threads SET updated_at = NOW() WHERE id = ${id}`;
    return NextResponse.json({ id: Number(replies[0].id) }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
