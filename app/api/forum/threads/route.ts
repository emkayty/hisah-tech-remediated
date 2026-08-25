import { NextRequest, NextResponse } from 'next/server';
import { assertSameOrigin, requireUser } from '@/lib/auth';
import { getDatabase } from '@/lib/db';
import { apiError, ApiError, parseJson } from '@/lib/security';
import { z } from 'zod';

const createThreadSchema = z.object({
  categoryId: z.coerce.number().int().positive(),
  title: z.string().trim().min(4).max(160),
  body: z.string().trim().min(1).max(10000),
});

export async function GET(request: NextRequest) {
  try {
    const category = request.nextUrl.searchParams.get('category');
    const database = getDatabase();
    const threads = await database`
      SELECT t.id, t.title, t.body, t.created_at, t.updated_at,
             c.id AS category_id, c.slug AS category_slug, c.name AS category_name,
             u.id AS author_id, COALESCE(u.name, u.username, 'Hisah Tech member') AS author_name,
             u.username AS author_username,
             COUNT(r.id)::int AS reply_count
      FROM forum_threads t
      INNER JOIN forum_categories c ON c.id = t.category_id
      INNER JOIN users u ON u.id = t.author_id
      LEFT JOIN forum_replies r ON r.thread_id = t.id
      WHERE (${category ? category : null}::text IS NULL OR c.slug = ${category || null})
      GROUP BY t.id, c.id, u.id
      ORDER BY t.updated_at DESC
      LIMIT 100
    `;
    return NextResponse.json(threads);
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    const principal = await requireUser(request);
    const payload = await parseJson(request, createThreadSchema);
    const database = getDatabase();
    const categories = await database`SELECT id FROM forum_categories WHERE id = ${payload.categoryId} LIMIT 1`;
    if (!categories.length) throw new ApiError(400, 'Choose a valid forum category');
    const threads = await database`
      INSERT INTO forum_threads (category_id, author_id, title, body)
      VALUES (${payload.categoryId}, ${principal.id}, ${payload.title}, ${payload.body})
      RETURNING id
    `;
    return NextResponse.json({ id: Number(threads[0].id) }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
