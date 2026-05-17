import { z } from 'zod';

const envSchema = z.object({
  IBM_CLOUD_API_KEY: z.string().min(1),
  WATSONX_PROJECT_ID: z.string().min(1),
  WATSONX_URL: z.string().url(),
  STT_APIKEY: z.string().min(1),
  STT_URL: z.string().url(),
});

export const config = envSchema.parse({
  IBM_CLOUD_API_KEY: process.env.IBM_CLOUD_API_KEY,
  WATSONX_PROJECT_ID: process.env.WATSONX_PROJECT_ID,
  WATSONX_URL: process.env.WATSONX_URL,
  STT_APIKEY: process.env.STT_APIKEY,
  STT_URL: process.env.STT_URL,
});

// Made with Bob
