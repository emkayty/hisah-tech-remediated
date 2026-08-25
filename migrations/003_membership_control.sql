BEGIN;

CREATE TABLE IF NOT EXISTS membership_plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  amount_cents INTEGER NOT NULL CHECK (amount_cents >= 0),
  currency TEXT NOT NULL DEFAULT 'usd' CHECK (currency = LOWER(currency) AND char_length(currency) = 3),
  duration_days INTEGER NOT NULL CHECK (duration_days > 0),
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS membership_activity (
  id BIGSERIAL PRIMARY KEY,
  actor_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  target_user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  plan_id TEXT REFERENCES membership_plans(id) ON DELETE SET NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('plan_created', 'plan_updated', 'plan_enabled', 'plan_disabled', 'subscription_granted', 'subscription_extended', 'subscription_cancelled', 'subscription_expired', 'payment_completed')),
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS membership_activity_created_idx ON membership_activity(created_at DESC);
CREATE INDEX IF NOT EXISTS membership_activity_target_idx ON membership_activity(target_user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS membership_plans_active_order_idx ON membership_plans(is_active, display_order, id);
ALTER TABLE payment_orders DROP CONSTRAINT IF EXISTS payment_orders_plan_id_check;
DO $$ BEGIN
  ALTER TABLE payment_orders ADD CONSTRAINT payment_orders_plan_id_fkey FOREIGN KEY (plan_id) REFERENCES membership_plans(id) ON DELETE RESTRICT;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

INSERT INTO membership_plans (id, name, description, amount_cents, currency, duration_days, features, is_active, display_order)
VALUES
  ('standard_monthly', 'Standard Monthly', 'Practical tools and community access for ongoing repair work.', 900, 'usd', 31, '["Browse repair resources", "Join forum discussions", "Use member tools"]'::jsonb, TRUE, 10),
  ('standard_yearly', 'Standard Yearly', 'A full year of member access at a lower effective monthly cost.', 9900, 'usd', 366, '["Everything in Standard Monthly", "One annual payment", "Priority resource requests"]'::jsonb, TRUE, 20),
  ('premium_monthly', 'Premium Monthly', 'More support for technicians who need deeper assistance.', 2900, 'usd', 31, '["Everything in Standard", "Priority forum visibility", "Premium repair assistance"]'::jsonb, TRUE, 30)
ON CONFLICT (id) DO NOTHING;

COMMIT;
