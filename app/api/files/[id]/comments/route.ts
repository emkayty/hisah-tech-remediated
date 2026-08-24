import { NextRequest, NextResponse } from 'next/server';
import { assertSameOrigin, requireUser } from '@/lib/auth';
import { getDatabase } from '@/lib/db';
import { apiError, ApiError, parseJson } from '@/lib/security';
import { z } from 'zod';

const commentSchema = z.object({ comment: z.string().trim().min(1).max(2000) });

async function fileIdFrom(params: Promise<{ id: string }>): Promise<number> {
  const { id } = await params;
  const fileId = Number(id);
  if (!Number.isSafeInteger(fileId) || fileId < 1) throw new ApiError(400, 'Invalid file id');
  return fileId;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const fileId = await fileIdFrom(params);
    const database = getDatabase();
    const comments = await database`
      SELECT c.id, c.comment, c.created_at, u.username, u.name AS full_name
      FROM file_comments c
      INNER JOIN users u ON u.id = c.user_id
      WHERE c.file_id = ${fileId}
      ORDER BY c.created_at ASC
      LIMIT 200
    `;
    return NextResponse.json({ comments });
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    assertSameOrigin(request);
    const principal = await requireUser(request);
    const fileId = await fileIdFrom(params);
    const { comment } = await parseJson(request, commentSchema);
    const database = getDatabase();
    const files = await database`SELECT id FROM files WHERE id = ${fileId} LIMIT 1`;
    if (!files.length) throw new ApiError(404, 'File not found');

    const inserted = await database`
      INSERT INTO file_comments (file_id, user_id, comment, created_at)
      VALUES (${fileId}, ${principal.id}, ${comment}, NOW())
      RETURNING id, comment, created_at
    `;
    return NextResponse.json(inserted[0], { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
