import { NextRequest, NextResponse } from 'next/server';
import { assertSameOrigin, requireUser } from '@/lib/auth';
import { getDatabase } from '@/lib/db';
import { apiError, ApiError } from '@/lib/security';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    assertSameOrigin(request);
    const principal = await requireUser(request);
    const { id } = await params;
    const commentId = Number(id);
    if (!Number.isSafeInteger(commentId) || commentId < 1) throw new ApiError(400, 'Invalid comment id');

    const database = getDatabase();
    const deleted = await database`
      DELETE FROM file_comments
      WHERE id = ${commentId} AND user_id = ${principal.id}
      RETURNING id
    `;
    if (!deleted.length) throw new ApiError(404, 'Comment not found or not owned by this user');
    return NextResponse.json({ success: true });
  } catch (error) {
    return apiError(error);
  }
}
