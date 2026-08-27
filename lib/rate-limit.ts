import { ApiError } from '@/lib/security';

type Entry = { count: number; resetAt: number };
const buckets = new Map<string, Entry>();

function clientKey(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
}

export function enforceRateLimit(
  request: Request,
  scope: string,
  maxRequests: number,
  windowMs: number,
): void {
  const now = Date.now();
  if (buckets.size > 10_000) {
    for (const [bucketKey, bucket] of buckets) {
      if (bucket.resetAt <= now) buckets.delete(bucketKey);
    }
  }
  const key = `${scope}:${clientKey(request)}`;
  const entry = buckets.get(key);

  if (!entry || entry.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }

  entry.count += 1;
  if (entry.count > maxRequests) {
    throw new ApiError(429, 'Too many requests. Please try again later.');
  }
}
