import { z } from 'zod';
import 'dotenv/config';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3001),
  DATABASE_URL: z.string().url(),
  CORS_ORIGIN: z.string().url(),

  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters long'),
  COOKIE_NAME: z.string().default('nr_session'),
  JWT_EXPIRES_IN: z.string().default('7d'),

  DISCORD_CLIENT_ID: z.string().optional(),
  DISCORD_CLIENT_SECRET: z.string().optional(),
  DISCORD_REDIRECT_URI: z.string().url().optional(),
  DISCORD_WEBHOOK_URL: z.string().url().optional(),

  S3_ENDPOINT: z.string().url().optional(),
  S3_BUCKET: z.string().optional(),
  S3_ACCESS_KEY: z.string().optional(),
  S3_SECRET_KEY: z.string().optional(),

  API_KEY: z.string().min(1, 'Google AI Studio API_KEY is required for moderation'),
  MODERATION_THRESHOLD_BLOCK: z.coerce.number().min(0).max(1).default(0.85),
  MODERATION_THRESHOLD_FLAG: z.coerce.number().min(0).max(1).default(0.6),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    '❌ Invalid environment variables:',
    parsedEnv.error.flatten().fieldErrors,
  );
  throw new Error('Invalid environment variables.');
}

export const env = parsedEnv.data;
