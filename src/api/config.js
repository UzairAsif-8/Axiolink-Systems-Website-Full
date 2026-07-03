/**
 * Shared API configuration for all frontend HTTP requests.
 *
 * Set in .env (project root):
 *   VITE_API_URL=https://axiolink-systems-website-full.onrender.com
 *
 * Do NOT include /api or a trailing slash in VITE_API_URL.
 */

function resolveApiBase() {
  const raw = import.meta.env.VITE_API_URL?.trim() ?? "";
  return raw.replace(/\/$/, "");
}

export const API_BASE = resolveApiBase();

/** Base path for axios client — `${API_BASE}/api` */
export const API_ROOT = `${API_BASE}/api`;

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

if (!API_BASE) {
  const hint =
    "Set VITE_API_URL in .env (e.g. https://axiolink-systems-website-full.onrender.com).";

  if (import.meta.env.DEV) {
    console.warn(`[Axiolink] VITE_API_URL is missing — ${hint}`);
  } else {
    console.error(`[Axiolink] VITE_API_URL is missing — ${hint}`);
  }
}
