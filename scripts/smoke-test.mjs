#!/usr/bin/env node

const baseUrl = (process.argv[2] || 'https://hisahtech.com').replace(/\/$/, '');
const timeoutMs = Number(process.env.SMOKE_TIMEOUT_MS || 15_000);
const sessionCookie = process.env.SMOKE_TEST_COOKIE || '';
const results = [];

async function request(path, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const headers = new Headers(options.headers || {});
    headers.set('accept', 'application/json');
    if (sessionCookie) headers.set('cookie', sessionCookie);
    const response = await fetch(`${baseUrl}${path}`, { ...options, headers, signal: controller.signal, redirect: 'manual' });
    const text = await response.text();
    let body = null;
    try { body = text ? JSON.parse(text) : null; } catch { body = text.slice(0, 300); }
    return { status: response.status, headers: Object.fromEntries(response.headers.entries()), body };
  } finally {
    clearTimeout(timeout);
  }
}

async function check(name, path, expected, options = {}) {
  try {
    const response = await request(path, options);
    const pass = Array.isArray(expected) ? expected.includes(response.status) : response.status === expected;
    results.push({ name, path, expected, actual: response.status, pass, body: response.body });
  } catch (error) {
    results.push({ name, path, expected, actual: null, pass: false, error: error instanceof Error ? error.message : String(error) });
  }
}

const sameOriginHeaders = { origin: baseUrl };

await check('health is ready', '/api/health', 200);
await check('anonymous session endpoint responds', '/api/auth/me', 200);
await check('public membership plans load', '/api/membership/plans', 200);
await check('public blog index loads', '/api/blog', 200);
await check('public forum categories load', '/api/forum/categories', 200);
await check('public forum threads load', '/api/forum/threads', 200);
await check('payment status endpoint loads', '/api/admin/payment-settings/status', 200);
await check('anonymous admin access is denied', '/api/admin/overview', [401, 403]);
await check('anonymous checkout is denied', '/api/payments/stripe/create-checkout', [401, 403], {
  method: 'POST', headers: { ...sameOriginHeaders, 'content-type': 'application/json' }, body: JSON.stringify({ planId: 'standard_monthly' }),
});
await check('cross-origin logout is rejected', '/api/auth/logout', 403, {
  method: 'POST', headers: { origin: 'https://smoke-attacker.invalid' },
});
await check('disabled PayPal route does not accept an order', '/api/payments/paypal/create-order', 503, { method: 'POST' });

const failures = results.filter((result) => !result.pass);
const report = { baseUrl, checkedAt: new Date().toISOString(), sessionCookieProvided: Boolean(sessionCookie), total: results.length, passed: results.length - failures.length, failed: failures.length, results };
console.log(JSON.stringify(report, null, 2));
if (failures.length) process.exitCode = 1;
