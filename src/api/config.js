/**
 * Shared API configuration for all frontend HTTP requests.
 *
 * Production (recommended): same-origin `/api`.
 * Vercel rewrites `/api/*` → the Render backend so auth cookies are first-party
 * (required for login on mobile Safari / Chrome, which block third-party cookies).
 *
 * Local development:
 *   - Empty VITE_API_URL → Vite proxies `/api` → http://localhost:4000
 *   - Or set VITE_API_URL to a remote API (cross-origin cookies; may fail on mobile)
 *
 * Escape hatch: VITE_API_SAME_ORIGIN=false forces use of VITE_API_URL in production.
 */

function resolveApiBase() {
  const forceRemote =
    import.meta.env.VITE_API_SAME_ORIGIN === "false" ||
    import.meta.env.VITE_API_SAME_ORIGIN === "0";

  // Prefer same-origin `/api` in production so Set-Cookie is first-party.
  if (import.meta.env.PROD && !forceRemote) {
    return "";
  }

  const raw = import.meta.env.VITE_API_URL?.trim() ?? "";
  return raw.replace(/\/$/, "");
}

export const API_BASE = resolveApiBase();

/** Base path for axios client — `/api` when same-origin, else `${API_BASE}/api` */
export const API_ROOT = API_BASE ? `${API_BASE}/api` : "/api";

/**
 * Build a full API URL.
 * @param {string} path - e.g. "jobs", "/jobs", "/api/jobs"
 * @returns {string}
 */
export function apiUrl(path = "") {
  const segment = String(path)
    .replace(/^\/api\/?/, "")
    .replace(/^\//, "");

  if (!API_BASE) {
    return segment ? `/api/${segment}` : "/api";
  }

  return segment ? `${API_BASE}/api/${segment}` : `${API_BASE}/api`;
}
