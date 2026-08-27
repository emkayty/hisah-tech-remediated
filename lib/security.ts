import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export const MAX_JSON_BYTES = 64 * 1024;

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

export function apiError(error: unknown): NextResponse {
  if (error instanceof ApiError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  if (error instanceof Error && error.message === 'DATABASE_URL is not configured') {
    return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
  }

  console.error('Unhandled API error', error);
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}

export function randomToken(): string {
  return randomBytes(32).toString('base64url');
}

export function tokenDigest(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

export function secureTokenEqual(left: string, right: string): boolean {
  const leftDigest = Buffer.from(tokenDigest(left), 'hex');
  const rightDigest = Buffer.from(tokenDigest(right), 'hex');
  return timingSafeEqual(leftDigest, rightDigest);
}

export async function parseJson<T extends z.ZodType>(request: Request, schema: T): Promise<z.infer<T>> {
  const contentLength = Number(request.headers.get('content-length') ?? '0');
  if (Number.isFinite(contentLength) && contentLength > MAX_JSON_BYTES) {
    throw new ApiError(413, 'Request body is too large');
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new ApiError(400, 'Invalid JSON request body');
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    throw new ApiError(400, 'Invalid request payload');
  }

  return parsed.data;
}
