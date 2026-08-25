import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { apiError } from '@/lib/security';

export async function GET() {
  try {
    const database = getDatabase();
    const categories = await database`
      SELECT c.id, c.slug, c.name, c.description, c.sort_order,
             COUNT(t.id)::int AS thread_count
      FROM forum_categories c
      LEFT JOIN forum_threads t ON t.category_id = c.id
      GROUP BY c.id
      ORDER BY c.sort_order ASC, c.name ASC
      LIMIT 50
    `;
    return NextResponse.json(categories);
  } catch (error) {
    return apiError(error);
  }
}
