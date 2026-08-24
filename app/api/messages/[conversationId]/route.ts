import { NextRequest, NextResponse } from 'next/server';
import { assertSameOrigin, requireUser } from '@/lib/auth';
import { getDatabase } from '@/lib/db';
import { apiError, ApiError, parseJson } from '@/lib/security';
import { z } from 'zod';

const messageSchema = z.object({ content: z.string().trim().min(1).max(4000) });

async function getConversationId(params: Promise<{ conversationId: string }>): Promise<number> {
  const { conversationId } = await params;
  const id = Number(conversationId);
  if (!Number.isSafeInteger(id) || id < 1) throw new ApiError(400, 'Invalid conversation id');
  return id;
}

async function assertParticipant(conversationId: number, userId: number): Promise<void> {
  const database = getDatabase();
  const participant = await database`
    SELECT 1 FROM conversation_participants
    WHERE conversation_id = ${conversationId} AND user_id = ${userId}
    LIMIT 1
  `;
  if (!participant.length) throw new ApiError(403, 'Conversation access denied');
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> },
) {
  try {
    const principal = await requireUser(request);
    const conversationId = await getConversationId(params);
    await assertParticipant(conversationId, principal.id);
    const database = getDatabase();

    const messages = await database`
      SELECT m.id, m.content, m.created_at, m.sender_id,
             u.username AS sender_username, u.name AS sender_name, u.avatar_url AS sender_profile_image
      FROM messages m
      INNER JOIN users u ON u.id = m.sender_id
      WHERE m.conversation_id = ${conversationId}
      ORDER BY m.created_at ASC
      LIMIT 500
    `;
    await database`
      UPDATE conversation_participants
      SET last_read_at = NOW()
      WHERE conversation_id = ${conversationId} AND user_id = ${principal.id}
    `;

    return NextResponse.json(messages);
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> },
) {
  try {
    assertSameOrigin(request);
    const principal = await requireUser(request);
    const conversationId = await getConversationId(params);
    const { content } = await parseJson(request, messageSchema);
    await assertParticipant(conversationId, principal.id);
    const database = getDatabase();

    const inserted = await database`
      INSERT INTO messages (conversation_id, sender_id, content, created_at)
      VALUES (${conversationId}, ${principal.id}, ${content}, NOW())
      RETURNING id, content, created_at, sender_id
    `;
    return NextResponse.json(inserted[0], { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
