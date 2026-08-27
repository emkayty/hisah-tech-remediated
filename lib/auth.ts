import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { ApiError, randomToken, tokenDigest } from '@/lib/security';

export const SESSION_COOKIE = 'hisah_session';
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

export type AuthenticatedUser = {
  id: number;
  email: string;
  name: string | null;
  username: string | null;
  isAdmin: boolean;
  role: string;
  accountStatus: string;
  subscriptionPlan: string | null;
  subscriptionExpiresAt: string | null;
};

function serializeUser(row: Record<string, unknown>): AuthenticatedUser {
  return {
    id: Number(row.id),
    email: String(row.email),
    name: row.name ? String(row.name) : null,
    username: row.username ? String(row.username) : null,
    isAdmin: Boolean(row.is_admin),
    role: String(row.role || (row.is_admin ? 'admin' : 'member')),
    accountStatus: String(row.account_status || 'active'),
    subscriptionPlan: row.subscription_plan ? String(row.subscription_plan) : null,
    subscriptionExpiresAt: row.subscription_expires_at ? String(row.subscription_expires_at) : null,
  };
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  };
}

export async function createSession(userId: number): Promise<string> {
  const database = getDatabase();
  const token = randomToken();
  const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000).toISOString();

  await database`
    INSERT INTO sessions (user_id, token_hash, expires_at, created_at)
    VALUES (${userId}, ${tokenDigest(token)}, ${expiresAt}, NOW())
  `;

  return token;
}

export async function revokeSession(token: string | undefined): Promise<void> {
  if (!token) return;
  const database = getDatabase();
  await database`DELETE FROM sessions WHERE token_hash = ${tokenDigest(token)}`;
}

export async function revokeAllSessions(userId: number): Promise<void> {
  const database = getDatabase();
  await database`DELETE FROM sessions WHERE user_id = ${userId}`;
}

export async function getAuthenticatedUser(request: NextRequest): Promise<AuthenticatedUser | null> {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const database = getDatabase();
  const rows = await database`
    SELECT u.id, u.email, u.name, u.username, u.is_admin, u.role, u.account_status,
           u.subscription_plan, u.subscription_expires_at
    FROM sessions s
    INNER JOIN users u ON u.id = s.user_id
    WHERE s.token_hash = ${tokenDigest(token)}
      AND s.expires_at > NOW()
    LIMIT 1
  `;

  if (!rows.length) return null;
  const user = serializeUser(rows[0] as Record<string, unknown>);
  if (user.accountStatus !== 'active') return null;
  return user;
}

export async function requireUser(request: NextRequest): Promise<AuthenticatedUser> {
  const user = await getAuthenticatedUser(request);
  if (!user) throw new ApiError(401, 'Authentication required');
  return user;
}

export async function requireAdmin(request: NextRequest): Promise<AuthenticatedUser> {
  const user = await requireUser(request);
  if (!user.isAdmin) throw new ApiError(403, 'Administrator access required');
  return user;
}

export function setSessionCookie(response: NextResponse, token: string): NextResponse {
  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
  return response;
}

export function clearSessionCookie(response: NextResponse): NextResponse {
  response.cookies.set(SESSION_COOKIE, '', { ...sessionCookieOptions(), maxAge: 0 });
  return response;
}

export function assertSameOrigin(request: NextRequest): void {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL;
  const allowedOrigins = new Set([request.nextUrl.origin]);
  if (configuredUrl) allowedOrigins.add(new URL(configuredUrl).origin);

  const origin = request.headers.get('origin');
  if (origin) {
    if (!allowedOrigins.has(origin)) throw new ApiError(403, 'Cross-origin request rejected');
    return;
  }

  const referer = request.headers.get('referer');
  if (referer) {
    try {
      if (allowedOrigins.has(new URL(referer).origin)) return;
    } catch {
      // Fall through to the same-origin rejection below.
    }
  }

  throw new ApiError(403, 'Same-origin request metadata is required');
}
