import { NextRequest, NextResponse } from 'next/server';
import { assertSameOrigin, getAuthenticatedUser, requireUser } from '@/lib/auth';
import { getDatabase } from '@/lib/db';
import { apiError, ApiError, parseJson } from '@/lib/security';
import { z } from 'zod';

const ratingSchema = z.object({ rating: z.number().int().min(1).max(5) });

async function fileIdFrom(params: Promise<{ id: string }>): Promise<number> {
  const { id } = await params;
  const fileId = Number(id);
  if (!Number.isSafeInteger(fileId) || fileId < 1) throw new ApiError(400, 'Invalid file id');
  return fileId;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const [fileId, currentUser] = await Promise.all([fileIdFrom(params), getAuthenticatedUser(request)]);
    const database = getDatabase();
    const aggregate = await database`
      SELECT COALESCE(AVG(rating), 0) AS average_rating, COUNT(*) AS total_ratings
      FROM file_ratings WHERE file_id = ${fileId}
    `;
    const ownRating = currentUser
      ? await database`SELECT rating FROM file_ratings WHERE file_id = ${fileId} AND user_id = ${currentUser.id} LIMIT 1`
      : [];

    return NextResponse.json({
      averageRating: Number(aggregate[0]?.average_rating ?? 0),
      totalRatings: Number(aggregate[0]?.total_ratings ?? 0),
      userRating: ownRating.length ? Number(ownRating[0].rating) : null,
    });
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
    const { rating } = await parseJson(request, ratingSchema);
    const database = getDatabase();
    const files = await database`SELECT id FROM files WHERE id = ${fileId} LIMIT 1`;
    if (!files.length) throw new ApiError(404, 'File not found');

    await database`
      INSERT INTO file_ratings (file_id, user_id, rating, created_at)
      VALUES (${fileId}, ${principal.id}, ${rating}, NOW())
      ON CONFLICT (file_id, user_id)
      DO UPDATE SET rating = EXCLUDED.rating, created_at = NOW()
    `;
    const aggregate = await database`
      SELECT COALESCE(AVG(rating), 0) AS average_rating, COUNT(*) AS total_ratings
      FROM file_ratings WHERE file_id = ${fileId}
    `;
    return NextResponse.json({
      success: true,
      averageRating: Number(aggregate[0]?.average_rating ?? 0),
      totalRatings: Number(aggregate[0]?.total_ratings ?? 0),
      userRating: rating,
    });
  } catch (error) {
    return apiError(error);
  }
}
