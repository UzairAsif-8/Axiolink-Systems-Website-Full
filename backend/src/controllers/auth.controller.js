import { authService } from "../services/auth.service.js";
import { loginSchema, refreshSchema, changePasswordSchema } from "../validators/schemas.js";
import { validate } from "../utils/validate.js";
import { asyncHandler, success } from "../utils/helpers.js";
import { audit } from "../services/audit.service.js";

export const login = asyncHandler(async (req, res) => {
  const body = validate(loginSchema, req.body);
  const result = await authService.login(body);

  await audit({
    userId: null,
    userEmail: result.user.email,
    action: "ADMIN_LOGIN",
    entity: "User",
    ip: req.ip,
  });

  success(res, result, 200, "Login successful");
});

export const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = validate(refreshSchema, req.body);
  const result = await authService.refresh(refreshToken);
  success(res, result);
});

export const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.body.refreshToken || req.cookies?.refreshToken;
  const result = await authService.logout(refreshToken);
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
