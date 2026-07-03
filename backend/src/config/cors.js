import { env } from "./env.js";

/** Normalized allowed frontend origins (no trailing slash). */
const allowedOrigins = new Set(
  env.clientUrls.map((url) => url.replace(/\/$/, ""))
);

/**
 * Dynamic CORS origin check for multiple frontend URLs.
 * - No Origin header → allow (Postman, health checks, server-to-server).
 * - Origin in CLIENT_URL list → allow with credentials.
 * - Otherwise → reject.
 */
export function corsOriginCallback(origin, callback) {
  if (!origin) {
    callback(null, true);
    return;
  }

  const normalized = origin.replace(/\/$/, "");

  if (allowedOrigins.has(normalized)) {
    callback(null, true);
    return;
  }

  callback(new Error(`CORS blocked for origin: ${origin}`));
}

export const corsOptions = {
  origin: corsOriginCallback,
  credentials: true,
};
