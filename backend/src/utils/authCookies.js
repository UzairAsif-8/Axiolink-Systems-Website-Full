import { env } from "../config/env.js";

function parseDurationToMs(value, fallbackMs) {
  const match = /^(\d+)([smhd])$/i.exec(String(value || "").trim());
  if (!match) return fallbackMs;

  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();
  const multipliers = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };
  return amount * multipliers[unit];
}

function baseCookieOptions(maxAgeMs) {
  const isProduction = env.nodeEnv === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
    maxAge: maxAgeMs,
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
  const isProduction = env.nodeEnv === "production";
  const options = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  };

  res.clearCookie("accessToken", options);
  res.clearCookie("refreshToken", options);
}
