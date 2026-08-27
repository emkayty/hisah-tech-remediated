import { createHash } from 'node:crypto';
import { ApiError } from '@/lib/security';

type Entry = { count: number; resetAt: number };
const developmentBuckets = new Map<string, Entry>();
const REDIS_SCRIPT = `local count = redis.call('INCR', KEYS[1])
if count == 1 then redis.call('PEXPIRE', KEYS[1], ARGV[1]) end
return count`;

function clientKey(request: Request): string {
  const forwarded = request.headers.get('x-vercel-forwarded-for') || request.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
}

function limiterKey(request: Request, scope: string): string {
  const identity = `${scope}:${clientKey(request)}`;
  return `hisah:ratelimit:${createHash('sha256').update(identity).digest('hex')}`;
}

function redisConfig(): { url: string; token: string } | null {
  const url = process.env.UPSTASH_REDIS_REST_URL?.replace(/\/$/, '');
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url, token } : null;
}

function enforceDevelopmentLimit(request: Request, scope: string, maxRequests: number, windowMs: number): void {
  const now = Date.now();
  if (developmentBuckets.size > 10_000) {
    for (const [key, bucket] of developmentBuckets) {
      if (bucket.resetAt <= now) developmentBuckets.delete(key);
    }
  }
  const key = limiterKey(request, scope);
  const entry = developmentBuckets.get(key);
  if (!entry || entry.resetAt <= now) {
    developmentBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }
  entry.count += 1;
  if (entry.count > maxRequests) throw new ApiError(429, 'Too many requests. Please try again later.');
}

async function enforceRedisLimit(request: Request, scope: string, maxRequests: number, windowMs: number, config: { url: string; token: string }): Promise<void> {
  const response = await fetch(config.url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${config.token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(['EVAL', REDIS_SCRIPT, '1', limiterKey(request, scope), String(windowMs)]),
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`Redis rate-limit request failed with ${response.status}`);
  const payload = await response.json() as { result?: number };
  const count = Number(payload.result);
  if (!Number.isSafeInteger(count)) throw new Error('Redis rate-limit response was invalid');
  if (count > maxRequests) throw new ApiError(429, 'Too many requests. Please try again later.');
}

export async function enforceRateLimit(request: Request, scope: string, maxRequests: number, windowMs: number): Promise<void> {
  const config = redisConfig();
  if (config) {
    try {
      await enforceRedisLimit(request, scope, maxRequests, windowMs, config);
      return;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      console.error('Distributed rate limiter unavailable', error);
      if (process.env.NODE_ENV === 'production') throw new ApiError(503, 'Request protection is temporarily unavailable');
    }
  }

  if (process.env.NODE_ENV === 'production') throw new ApiError(503, 'Request protection is not configured');
  enforceDevelopmentLimit(request, scope, maxRequests, windowMs);
}
