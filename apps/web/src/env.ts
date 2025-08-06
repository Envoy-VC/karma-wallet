import { createEnv } from "@t3-oss/env-core";
import { z } from "zod/v4";

export const env = createEnv({
  client: {
    VITE_BUNDLER_URL: z.string(),
    VITE_REOWN_PROJECT_ID: z.string(),
  },
  clientPrefix: "VITE_",
  emptyStringAsUndefined: true,
  runtimeEnv: import.meta.env,
  server: {
    PORT: z.coerce.number().min(1).max(65535).default(3000),
  },
});
