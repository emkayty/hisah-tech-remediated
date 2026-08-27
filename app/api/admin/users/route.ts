import { NextRequest, NextResponse } from 'next/server';
import { assertSameOrigin, revokeAllSessions } from '@/lib/auth';
import { getDatabase } from '@/lib/db';
import { requirePermission, ROLES } from '@/lib/rbac';
import { apiError, ApiError, parseJson } from '@/lib/security';
import { z } from 'zod';

const updateSchema = z.object({ userId: z.number().int().positive(), role: z.enum(ROLES), accountStatus: z.enum(['active', 'suspended', 'pending']) });

export async function GET(request: NextRequest) {
  try {
    await requirePermission(request, 'users.manage');
    const database = getDatabase();
    const search = request.nextUrl.searchParams.get('search')?.trim() || '';
    const pattern = `%${search}%`;
    const users = await database`
      SELECT id, email, name, username, country, role, account_status, is_admin,
             subscription_plan, subscription_expires_at, created_at
      FROM users
      WHERE (${search} = '' OR LOWER(email) LIKE LOWER(${pattern}) OR LOWER(COALESCE(name, '')) LIKE LOWER(${pattern}) OR LOWER(COALESCE(username, '')) LIKE LOWER(${pattern}))
      ORDER BY created_at DESC
      LIMIT 200
    `;
    const activity = await database`SELECT id, activity_type, details, created_at FROM admin_activity ORDER BY created_at DESC LIMIT 30`;
    return NextResponse.json({ users, activity });
  } catch (error) { return apiError(error); }
}

export async function PUT(request: NextRequest) {
  try {
    assertSameOrigin(request);
    const actor = await requirePermission(request, 'users.manage');
    const payload = await parseJson(request, updateSchema);
    if (payload.userId === actor.id) throw new ApiError(400, 'You cannot change your own role or account status here');
    const database = getDatabase();
    const users = await database`SELECT id, role, account_status FROM users WHERE id = ${payload.userId} LIMIT 1`;
    if (!users.length) return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    await database`
      UPDATE users
      SET role = ${payload.role}, is_admin = ${payload.role === 'admin'}, account_status = ${payload.accountStatus}, updated_at = NOW()
      WHERE id = ${payload.userId}
    `;
    if (payload.accountStatus !== 'active') await revokeAllSessions(payload.userId);
    await database`
      INSERT INTO admin_activity (actor_id, target_user_id, activity_type, details)
      VALUES (${actor.id}, ${payload.userId}, 'user_access_updated', ${JSON.stringify({ fromRole: users[0].role, fromStatus: users[0].account_status, role: payload.role, accountStatus: payload.accountStatus })}::jsonb)
    `;
    return NextResponse.json({ success: true });
  } catch (error) { return apiError(error); }
}
