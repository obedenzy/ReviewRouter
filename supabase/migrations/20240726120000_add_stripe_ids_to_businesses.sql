
ALTER TABLE businesses
ADD COLUMN stripe_subscription_id TEXT,
ADD COLUMN stripe_product_id TEXT,
ADD COLUMN stripe_price_id TEXT;

COMMENT ON COLUMN businesses.stripe_subscription_id IS 'Stores the ID of the active Stripe subscription for the business.';
COMMENT ON COLUMN businesses.stripe_product_id IS 'Stores the ID of the Stripe Product associated with the business subscription.';
COMMENT ON COLUMN businesses.stripe_price_id IS 'Stores the ID of the Stripe Price associated with the business subscription.';
