import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { apiError, ApiError } from '@/lib/security';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ threadId: string }> }) {
  try {
    const { threadId } = await params;
    const id = Number(threadId);
    if (!Number.isInteger(id) || id <= 0) throw new ApiError(400, 'Invalid thread');
    const database = getDatabase();
    const threads = await database`
      SELECT t.id, t.title, t.body, t.created_at, t.updated_at,
             c.id AS category_id, c.slug AS category_slug, c.name AS category_name,
             u.id AS author_id, COALESCE(u.name, u.username, 'Hisah Tech member') AS author_name,
             u.username AS author_username
      FROM forum_threads t
      INNER JOIN forum_categories c ON c.id = t.category_id
      INNER JOIN users u ON u.id = t.author_id
      WHERE t.id = ${id}
      LIMIT 1
    `;
    if (!threads.length) throw new ApiError(404, 'Thread not found');
    return NextResponse.json(threads[0]);
  } catch (error) {
    return apiError(error);
  }
}
