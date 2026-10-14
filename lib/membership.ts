export type MembershipLevel = 'free' | 'standard' | 'premium';
export type MembershipStatus = 'free' | 'active' | 'expired';
export type RequiredMembershipLevel = Exclude<MembershipLevel, 'free'>;

export type MembershipSnapshot = {
  level: MembershipLevel;
  status: MembershipStatus;
  label: string;
  planId: string | null;
  expiresAt: string | null;
};

const MEMBERSHIP_LEVEL_ORDER: Record<MembershipLevel, number> = { free: 0, standard: 1, premium: 2 };

export function membershipHasAccess(snapshot: MembershipSnapshot, requiredLevel: RequiredMembershipLevel): boolean {
  return snapshot.status === 'active' && MEMBERSHIP_LEVEL_ORDER[snapshot.level] >= MEMBERSHIP_LEVEL_ORDER[requiredLevel];
}

export function getMembershipSnapshot(planId: string | null, expiresAt: string | null, now = new Date()): MembershipSnapshot {
  if (!planId || !expiresAt) {
    return { level: 'free', status: 'free', label: 'Free access', planId: null, expiresAt: null };
  }

  const level: MembershipLevel = planId.toLowerCase().includes('premium') ? 'premium' : 'standard';
  const active = new Date(expiresAt).getTime() > now.getTime();
  const label = level === 'premium' ? 'Premium membership' : 'Standard membership';

  return {
    level,
    status: active ? 'active' : 'expired',
    label: active ? label : `${label} expired`,
    planId,
    expiresAt,
  };
}

export function formatMembershipExpiry(expiresAt: string | null): string | null {
  if (!expiresAt) return null;
  const date = new Date(expiresAt);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(date);
}
