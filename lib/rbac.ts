import { NextRequest } from 'next/server';
import { getAuthenticatedUser, type AuthenticatedUser } from '@/lib/auth';
import { ApiError } from '@/lib/security';

export const ROLES = ['admin', 'moderator', 'editor', 'support', 'member'] as const;
export type Role = typeof ROLES[number];
export const PERMISSIONS = {
  'admin.access': ['admin'],
  'users.manage': ['admin'],
  'membership.manage': ['admin'],
  'payments.manage': ['admin'],
  'files.manage': ['admin', 'editor'],
  'content.manage': ['admin', 'editor'],
  'forum.moderate': ['admin', 'moderator'],
  'support.manage': ['admin', 'support'],
  'analytics.view': ['admin', 'editor', 'support'],
} as const;
export type Permission = keyof typeof PERMISSIONS;

export function roleHasPermission(role: string, permission: Permission): boolean {
  return (PERMISSIONS[permission] as readonly string[]).includes(role);
}

export async function requirePermission(request: NextRequest, permission: Permission): Promise<AuthenticatedUser> {
  const user = await getAuthenticatedUser(request);
  if (!user) throw new ApiError(401, 'Authentication required');
  if (!roleHasPermission(user.role, permission)) throw new ApiError(403, 'You do not have permission to perform this action');
  return user;
}
