import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    RESEND_API_KEY: z.string().min(1),
    PDF_PASSWORD: z.string().min(1),
    EMAIL_FROM: z.string().email(),
  },

  client: {},

  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    PDF_PASSWORD: process.env.PDF_PASSWORD,
    EMAIL_FROM: process.env.EMAIL_FROM,
  },

  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
