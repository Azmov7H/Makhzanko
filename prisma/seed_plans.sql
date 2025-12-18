-- Create Plan table if it doesn't exist
CREATE TABLE IF NOT EXISTS "Plan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "stripeProductId" TEXT,
    "stripePriceId" TEXT,
    "features" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    
    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- Add unique constraints
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Plan_name_key') THEN
        ALTER TABLE "Plan" ADD CONSTRAINT "Plan_name_key" UNIQUE ("name");
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Plan_type_key') THEN
        ALTER TABLE "Plan" ADD CONSTRAINT "Plan_type_key" UNIQUE ("type");
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Plan_stripeProductId_key') THEN
        ALTER TABLE "Plan" ADD CONSTRAINT "Plan_stripeProductId_key" UNIQUE ("stripeProductId");
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Plan_stripePriceId_key') THEN
        ALTER TABLE "Plan" ADD CONSTRAINT "Plan_stripePriceId_key" UNIQUE ("stripePriceId");
    END IF;
END $$;

-- Insert or update Plans
INSERT INTO "Plan" ("id", "name", "type", "price", "stripeProductId", "stripePriceId", "features", "createdAt", "updatedAt")
VALUES 
    ('plan_free', 'Free', 'FREE', 0, NULL, NULL, '[]'::jsonb, NOW(), NOW()),
    ('plan_pro', 'Pro', 'PRO', 29.99, 'prod_TcNY4tllRbZIrq', NULL, '["reports", "analytics", "export"]'::jsonb, NOW(), NOW()),
    ('plan_business', 'Business', 'BUSINESS', 99.99, NULL, NULL, '["reports", "analytics", "export", "advanced_accounting"]'::jsonb, NOW(), NOW())
ON CONFLICT ("type") 
DO UPDATE SET 
    "stripeProductId" = EXCLUDED."stripeProductId",
    "updatedAt" = NOW();

