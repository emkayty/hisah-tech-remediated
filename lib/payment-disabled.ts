import { NextResponse } from 'next/server';

export function paymentMethodDisabled(provider: string): NextResponse {
  return NextResponse.json(
    { error: `${provider} payments are unavailable while secure provider verification is being configured.` },
    { status: 503 },
  );
}
