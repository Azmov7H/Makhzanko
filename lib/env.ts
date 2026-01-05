import { z } from "zod";

const envSchema = z.object({
    DATABASE_URL: z.string().url(),
    SAAS_TOKEN_SECRET: z.string().min(32),

    // Stripe
    STRIPE_SECRET_KEY: z.string().optional(),
    STRIPE_PUBLISHABLE_KEY: z.string().optional(),
    STRIPE_WEBHOOK_SECRET: z.string().optional(),

    // Paymob
    PAYMOB_API_KEY: z.string().optional(),
    PAYMOB_HMAC_SECRET: z.string().optional(),
    PAYMOB_IFRAME_ID: z.string().optional(),
    PAYMOB_INTEGRATION_ID: z.string().optional(),

    // AI
    AI_MODEL_ENDPOINT: z.string().url().optional(),
    AI_API_KEY: z.string().optional(),

    // General
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
    console.error("❌ Invalid environment variables:", _env.error.format());
    throw new Error("Invalid environment variables");
}

export const env = _env.data;
