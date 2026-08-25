import { NextRequest, NextResponse } from 'next/server';
import { findCountry } from '@/lib/countries';

const COUNTRY_CODE = /^[A-Z]{2}$/;

export function GET(request: NextRequest) {
  // Vercel derives this header at the edge. We only return a two-letter country
  // code and never expose or persist the visitor IP address.
  const countryCode = [
    request.headers.get('x-vercel-ip-country'),
    request.headers.get('cf-ipcountry'),
    request.headers.get('x-country-code'),
  ].map((value) => value?.trim().toUpperCase()).find((value) => value && COUNTRY_CODE.test(value) && findCountry(value));

  return NextResponse.json(
    { countryCode: countryCode || null },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
