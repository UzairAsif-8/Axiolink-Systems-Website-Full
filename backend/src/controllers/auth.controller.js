import { authService } from "../services/auth.service.js";
import { loginSchema, changePasswordSchema } from "../validators/schemas.js";
import { validate } from "../utils/validate.js";
import { asyncHandler, success, ApiError } from "../utils/helpers.js";
import { audit } from "../services/audit.service.js";
import {
  setAuthCookies,
  setAccessTokenCookie,
  clearAuthCookies,
} from "../utils/authCookies.js";

export const login = asyncHandler(async (req, res) => {
  const body = validate(loginSchema, req.body);
  const { user, accessToken, refreshToken } = await authService.login(body);

  setAuthCookies(res, {
    accessToken,
    refreshToken,
    rememberMe: body.rememberMe,
  });

  await audit({
    userId: null,
    userEmail: user.email,
    action: "ADMIN_LOGIN",
    entity: "User",
    ip: req.ip,
  });

  success(res, { user }, 200, "Login successful");
});

export const refresh = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    throw new ApiError(401, "Refresh token required");
  }

  const { accessToken } = await authService.refresh(refreshToken);
  setAccessTokenCookie(res, accessToken);
  success(res, { refreshed: true });
});

export const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  const result = await authService.logout(refreshToken);
  clearAuthCookies(res);
  success(res, result, 200, "Logged out successfully");
});

export const changePassword = asyncHandler(async (req, res) => {
  const body = validate(changePasswordSchema, req.body);
  const result = await authService.changePassword(body);

  await audit({
    userId: null,
    userEmail: req.user?.email,
    action: "PASSWORD_CHANGED",
    entity: "User",
    ip: req.ip,
  });

  success(res, result, 200, "Password updated successfully");
});

export const me = asyncHandler(async (req, res) => {
  const user = await authService.me(req.user);
  success(res, user);
});
