# Hisah Tech Web Application

## Production prerequisites

The application requires Node.js 22 or later, a PostgreSQL-compatible Neon database, and the environment variables documented in [`.env.example`](.env.example). Do not commit `.env` files. Payment, upload, email, and AI provider credentials must be stored in the deployment platform's secret manager, never in `payment_settings` or source control.

Apply [`migrations/001_production_hardening.sql`](migrations/001_production_hardening.sql) to an empty staging database before use. The migration invalidates legacy plaintext/opaque session records and flags any non-bcrypt password records for forced password reset. Review it against an existing production schema and back up the database before applying it to a live environment.

## Payment safety

Only the Stripe card flow is implemented. It derives plan, amount, and currency from `lib/plans.ts`, creates an internal pending order, validates the Stripe webhook signature, validates the paid amount/currency, records a unique provider event, and activates the entitlement idempotently.

Crypto, PayPal, and Paystack routes intentionally return HTTP 503. They must remain disabled until each provider is rebuilt with a server-owned order ledger, verified provider callback or settlement monitoring, event idempotency, and provider sandbox tests.

## Release gates

Run the following commands in a clean environment:

```bash
npm ci
npm run typecheck
npm run lint
npm test
npm run build
npm run audit:prod
```

The `npm run verify` command runs the same checks. A release must not proceed if any command fails, if high/critical production dependency advisories remain, or if migration/backup/restore exercises have not passed in staging.

## Operations

Monitor application error rates, authentication failures, rate-limit events, webhook delivery errors, failed migrations, and Stripe reconciliation. Configure your hosting platform with health checks and log aggregation before production deployment. Retain database backups and test restoration on a recurring schedule.
