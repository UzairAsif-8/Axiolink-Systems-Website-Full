import { env } from "../config/env.js";

function parseDurationToMs(value, fallbackMs) {
  const match = /^(\d+)([smhd])$/i.exec(String(value || "").trim());
  if (!match) return fallbackMs;

  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();
  const multipliers = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };
  return amount * multipliers[unit];
}

/**
 * Cookie attributes for auth JWTs.
 *
 * When the frontend calls the API via a same-origin reverse proxy (Vercel `/api`
 * rewrite), cookies are first-party. Prefer SameSite=Lax in that setup
 * (AUTH_COOKIE_SAMESITE=lax) — more reliable on mobile than cross-site None.
 *
 * Cross-origin (frontend → Render URL directly) needs SameSite=None; Secure,
 * which many mobile browsers block as a third-party cookie.
 */
function baseCookieOptions(maxAgeMs) {
  const isProduction = env.nodeEnv === "production";
  const sameSite = env.authCookieSameSite || (isProduction ? "none" : "lax");
  const secure =
    env.authCookieSecure != null
      ? env.authCookieSecure
      : isProduction || sameSite === "none";

  return {
    httpOnly: true,
    secure,
    sameSite,
    path: "/",
    maxAge: maxAgeMs,
  };
}

function clearCookieOptions() {
  const isProduction = env.nodeEnv === "production";
  const sameSite = env.authCookieSameSite || (isProduction ? "none" : "lax");
  const secure =
    env.authCookieSecure != null
      ? env.authCookieSecure
      : isProduction || sameSite === "none";

  return {
    httpOnly: true,
    secure,
    sameSite,
    path: "/",
  };
}

export function setAuthCookies(res, { accessToken, refreshToken, rememberMe = false }) {
  const accessMaxAge = parseDurationToMs(env.jwt.accessExpires, 15 * 60_000);
  const refreshMaxAge = rememberMe
    ? parseDurationToMs("30d", 30 * 86_400_000)
    : parseDurationToMs(env.jwt.refreshExpires, 7 * 86_400_000);

  res.cookie("accessToken", accessToken, baseCookieOptions(accessMaxAge));
  res.cookie("refreshToken", refreshToken, baseCookieOptions(refreshMaxAge));
}

export function setAccessTokenCookie(res, accessToken) {
  const accessMaxAge = parseDurationToMs(env.jwt.accessExpires, 15 * 60_000);
  res.cookie("accessToken", accessToken, baseCookieOptions(accessMaxAge));
}

export function clearAuthCookies(res) {
  const options = clearCookieOptions();
  res.clearCookie("accessToken", options);
  res.clearCookie("refreshToken", options);
}
