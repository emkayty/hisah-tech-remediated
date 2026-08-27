import { describe, expect, it } from 'vitest';
import { isPlanId, PLANS } from '../lib/plans';
import { enforceRateLimit } from '../lib/rate-limit';
import { assertSameOrigin } from '../lib/auth';
import { ApiError, apiError, parseJson, randomToken, tokenDigest } from '../lib/security';
import { NextRequest } from 'next/server';
import { z } from 'zod';

describe('server-owned subscription catalog', () => {
  it('accepts only known plan identifiers', () => {
    expect(isPlanId('standard_monthly')).toBe(true);
    expect(isPlanId('premium_monthly')).toBe(true);
    expect(isPlanId('premium_free')).toBe(false);
    expect(PLANS.standard_monthly.amountCents).toBe(900);
  });
});

describe('opaque token helpers', () => {
  it('creates high-entropy token values and a deterministic non-raw digest', () => {
    const token = randomToken();
    expect(token.length).toBeGreaterThanOrEqual(43);
    expect(tokenDigest(token)).toMatch(/^[a-f0-9]{64}$/);
    expect(tokenDigest(token)).not.toBe(token);
    expect(tokenDigest(token)).toBe(tokenDigest(token));
  });
});

describe('JSON input boundary', () => {
  const schema = z.object({ planId: z.literal('standard_monthly') });

  it('accepts validated JSON only', async () => {
    const request = new Request('https://example.test/api', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ planId: 'standard_monthly' }),
    });
    await expect(parseJson(request, schema)).resolves.toEqual({ planId: 'standard_monthly' });
  });

  it('rejects unrecognized client-controlled plan values', async () => {
    const request = new Request('https://example.test/api', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ planId: 'premium_free' }),
    });
    await expect(parseJson(request, schema)).rejects.toBeInstanceOf(ApiError);
  });
});

describe('rate limiter', () => {
  it('rejects a request after its configured limit', () => {
    const request = new Request('https://example.test/api', { headers: { 'x-real-ip': '203.0.113.10' } });
    const scope = `test-${Date.now()}-${Math.random()}`;
    enforceRateLimit(request, scope, 1, 60_000);
    expect(() => enforceRateLimit(request, scope, 1, 60_000)).toThrow(ApiError);
  });
});

describe('browser request protections', () => {
  it('accepts an explicitly same-origin mutation', () => {
    const request = new NextRequest('https://example.test/api', { method: 'POST', headers: { origin: 'https://example.test' } });
    expect(() => assertSameOrigin(request)).not.toThrow();
  });

  it('rejects missing or cross-origin mutation metadata', () => {
    const missing = new NextRequest('https://example.test/api', { method: 'POST' });
    const crossOrigin = new NextRequest('https://example.test/api', { method: 'POST', headers: { origin: 'https://attacker.example' } });
    expect(() => assertSameOrigin(missing)).toThrow(ApiError);
    expect(() => assertSameOrigin(crossOrigin)).toThrow(ApiError);
  });

  it('classifies missing database configuration as a dependency outage', async () => {
    const response = apiError(new Error('DATABASE_URL is not configured'));
    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({ error: 'Service temporarily unavailable' });
  });
});
