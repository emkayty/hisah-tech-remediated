import { NextRequest, NextResponse } from 'next/server';
import { assertSameOrigin, requireUser } from '@/lib/auth';
import { getDatabase } from '@/lib/db';
import { apiError, ApiError, parseJson } from '@/lib/security';
import { z } from 'zod';

const createConversationSchema = z.object({ otherUserId: z.number().int().positive() });

export async function GET(request: NextRequest) {
  try {
    const principal = await requireUser(request);
    const database = getDatabase();
    const conversations = await database`
      SELECT c.id, other_user.id AS other_user_id, other_user.username AS other_username,
             other_user.name AS other_name, other_user.avatar_url AS other_profile_image,
             latest.content AS last_message, latest.created_at AS last_message_at,
             COALESCE(unread.count, 0) AS unread_count
      FROM conversation_participants mine
      INNER JOIN conversations c ON c.id = mine.conversation_id
      INNER JOIN conversation_participants other ON other.conversation_id = c.id AND other.user_id <> ${principal.id}
      INNER JOIN users other_user ON other_user.id = other.user_id
      LEFT JOIN LATERAL (
        SELECT content, created_at FROM messages
        WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1
      ) latest ON TRUE
      LEFT JOIN LATERAL (
        SELECT COUNT(*) AS count FROM messages
        WHERE conversation_id = c.id AND sender_id <> ${principal.id} AND created_at > mine.last_read_at
      ) unread ON TRUE
      WHERE mine.user_id = ${principal.id}
      ORDER BY latest.created_at DESC NULLS LAST, c.created_at DESC
      LIMIT 100
    `;
    return NextResponse.json(conversations);
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    const principal = await requireUser(request);
    const { otherUserId } = await parseJson(request, createConversationSchema);
    if (otherUserId === principal.id) throw new ApiError(400, 'A conversation requires another user');
    const database = getDatabase();

    const otherUsers = await database`SELECT id FROM users WHERE id = ${otherUserId} LIMIT 1`;
    if (!otherUsers.length) throw new ApiError(404, 'Recipient not found');

    const directKey = [principal.id, otherUserId].sort((a, b) => a - b).join(':');
    const conversations = await database`
      INSERT INTO conversations (direct_key, created_at)
      VALUES (${directKey}, NOW())
      ON CONFLICT (direct_key) DO UPDATE SET direct_key = EXCLUDED.direct_key
      RETURNING id
    `;
    const conversationId = Number(conversations[0].id);
    await database`
      INSERT INTO conversation_participants (conversation_id, user_id, last_read_at)
      VALUES (${conversationId}, ${principal.id}, NOW()), (${conversationId}, ${otherUserId}, NOW())
      ON CONFLICT (conversation_id, user_id) DO NOTHING
    `;

    return NextResponse.json({ id: conversationId }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
