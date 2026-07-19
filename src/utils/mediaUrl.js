/**
 * Resolve stored upload URLs so admin can open CVs / payment slips reliably.
 *
 * Some older records point at the frontend host (`www.axiolinksystems.com/uploads/...`)
 * or a raw `/uploads/...` path. Those must go through the Vercel → Render `/uploads`
 * rewrite (or the Render origin), not the SPA.
 *
 * Cloudinary URLs are returned unchanged.
 */

const FRONTEND_HOSTS = new Set([
  "axiolinksystems.com",
  "www.axiolinksystems.com",
  "localhost",
  "127.0.0.1",
]);

function hostnameOf(url) {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return "";
  }
}

/**
 * @param {string | null | undefined} url
 * @returns {string | null}
 */
export function resolveMediaUrl(url) {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  // Already a same-origin uploads path
  if (trimmed.startsWith("/uploads/")) return trimmed;

  // Absolute URL
  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const parsed = new URL(trimmed);
      const path = parsed.pathname || "";

      // Local disk uploads mistakenly saved against the frontend domain
      if (path.startsWith("/uploads/") && FRONTEND_HOSTS.has(parsed.hostname.toLowerCase())) {
        return path + parsed.search;
      }

      // Keep Cloudinary / Render / other absolute URLs as-is
      return trimmed;
    } catch {
      return trimmed;
    }
  }

  // Bare filename → treat as local upload
  if (!trimmed.includes("/") && trimmed.includes(".")) {
    return `/uploads/${trimmed}`;
  }

  if (trimmed.startsWith("uploads/")) {
    return `/${trimmed}`;
  }

  return trimmed;
}

export function isLikelyLocalUpload(url) {
  const resolved = resolveMediaUrl(url);
  if (!resolved) return false;
  if (resolved.startsWith("/uploads/")) return true;
  const host = hostnameOf(resolved);
  return host.includes("onrender.com") && resolved.includes("/uploads/");
}
