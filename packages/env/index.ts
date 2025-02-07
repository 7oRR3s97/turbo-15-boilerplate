import { createEnv } from "@t3-oss/env-nextjs";
import { vercel } from "@t3-oss/env-nextjs/presets";
import { z } from "zod";

const server = {
  APP_ENV: z.enum(["development", "production", "test"]).default("development"),

  // VERCEL_URL: z.string().min(1).url(),

  AUTH_SECRET:
    process.env.NODE_ENV === "production"
      ? z.string().min(1)
      : z.string().min(1).optional(),
  AUTH_TRUST_HOST: z.string().min(1).optional(),

  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),

  UPLOADTHING_TOKEN: z.string().optional(),

  MANDATORY_EMAIL_CONFIRMATION: z.enum(["true", "false"]).default("false"),
  EMAIL_CONFIRMATION_METHOD: z.enum(["token", "link"]).default("token"),
  RESET_PASSWORD_METHOD: z.enum(["token", "link"]).default("token"),
  DEFAULT_LOGIN_REDIRECT: z.string().min(1),

  POSTGRES_URL: z.string(),
  POSTGRES_PRISMA_URL: z.string(),
  POSTGRES_URL_NO_SSL: z.string(),
  POSTGRES_URL_NON_POOLING: z.string(),
  POSTGRES_USER: z.string(),
  POSTGRES_HOST: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DATABASE: z.string(),

  UPSTASH_REDIS_REST_URL: z.string(),
  UPSTASH_REDIS_REST_TOKEN: z.string(),

  RESEND_AUDIENCE_ID: z.string().min(1),
  RESEND_FROM: z.string().min(1).email(),
  RESEND_TOKEN: z.string().min(1).startsWith("re_"),

  STRIPE_SECRET_KEY: z.string().min(1).startsWith("sk_"),
  // STRIPE_WEBHOOK_SECRET: z.string().min(1).startsWith('whsec_'),

  BETTERSTACK_API_KEY: z.string().min(1),
  BETTERSTACK_URL: z.string().min(1).url(),

  // ARCJET_KEY: z.string().min(1).startsWith('ajkey_'),
  ANALYZE: z.string().optional(),

  // Added by Sentry Integration, Vercel Marketplace
  SENTRY_ORG: z.string().min(1).optional(),
  SENTRY_PROJECT: z.string().min(1).optional(),

  // Added by Vercel
  VERCEL: z.string().optional(),
  VERCEL_URL: z.string(),
  NEXT_RUNTIME: z.enum(["nodejs", "edge"]).optional(),
  FLAGS_SECRET: z.string().min(1),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
};

const client = {
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().min(1).startsWith("G-"),

  NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1).startsWith("phc_"),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().min(1).url(),

  // Added by Vercel
  // NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL: z.string(),
};

export const env = createEnv({
  extends: [vercel()],
  client,
  server,
  runtimeEnv: {
    APP_ENV: process.env.APP_ENV,

    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_TRUST_HOST: process.env.AUTH_TRUST_HOST,

    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

    UPLOADTHING_TOKEN: process.env.UPLOADTHING_TOKEN,

    MANDATORY_EMAIL_CONFIRMATION: process.env.MANDATORY_EMAIL_CONFIRMATION,
    EMAIL_CONFIRMATION_METHOD: process.env.EMAIL_CONFIRMATION_METHOD,
    RESET_PASSWORD_METHOD: process.env.RESET_PASSWORD_METHOD,
    DEFAULT_LOGIN_REDIRECT: process.env.DEFAULT_LOGIN_REDIRECT,

    POSTGRES_URL: process.env.POSTGRES_URL,
    POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL,
    POSTGRES_URL_NO_SSL: process.env.POSTGRES_URL_NO_SSL,
    POSTGRES_URL_NON_POOLING: process.env.POSTGRES_URL_NON_POOLING,
    POSTGRES_USER: process.env.POSTGRES_USER,
    POSTGRES_HOST: process.env.POSTGRES_HOST,
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
    POSTGRES_DATABASE: process.env.POSTGRES_DATABASE,

    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,

    RESEND_AUDIENCE_ID: process.env.RESEND_AUDIENCE_ID,
    RESEND_FROM: process.env.RESEND_FROM,
    RESEND_TOKEN: process.env.RESEND_TOKEN,

    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    // STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,

    BETTERSTACK_API_KEY: process.env.BETTERSTACK_API_KEY,
    BETTERSTACK_URL: process.env.BETTERSTACK_URL,

    // ARCJET_KEY: process.env.ARCJET_KEY,
    ANALYZE: process.env.ANALYZE,

    SENTRY_ORG: process.env.SENTRY_ORG,
    SENTRY_PROJECT: process.env.SENTRY_PROJECT,

    VERCEL: process.env.VERCEL,
    VERCEL_URL: process.env.VERCEL_URL,
    NEXT_RUNTIME: process.env.NEXT_RUNTIME,
    FLAGS_SECRET: process.env.FLAGS_SECRET,

    NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,

    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,

    NODE_ENV: process.env.NODE_ENV,
  },
});
