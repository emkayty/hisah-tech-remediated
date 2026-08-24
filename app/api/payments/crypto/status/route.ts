import { NextResponse } from 'next/server';
import { paymentMethodDisabled } from '@/lib/payment-disabled';

export async function GET(): Promise<NextResponse> {
  return paymentMethodDisabled('Cryptocurrency');
}
