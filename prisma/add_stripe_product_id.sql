-- Add stripeProductId column to Plan table if it doesn't exist
ALTER TABLE "Plan" 
ADD COLUMN IF NOT EXISTS "stripeProductId" TEXT;

-- Add unique constraint if column was just added
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'Plan_stripeProductId_key'
    ) THEN
        ALTER TABLE "Plan" 
        ADD CONSTRAINT "Plan_stripeProductId_key" UNIQUE ("stripeProductId");
    END IF;
END $$;

-- Update PRO plan with Stripe Product ID
UPDATE "Plan" 
SET "stripeProductId" = 'prod_TcNY4tllRbZIrq' 
WHERE type = 'PRO';

