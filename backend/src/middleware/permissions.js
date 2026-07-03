import { ApiError, SUPER_ADMIN_ROLE } from "../utils/helpers.js";

export function requirePermission(..._codes) {
  return (req, _res, next) => {
    if (!req.user) return next(new ApiError(401, "Authentication required"));
    if (req.user.isEnvSuperAdmin || req.user.role === SUPER_ADMIN_ROLE) {
      return next();
    }
    return next(new ApiError(403, "Insufficient permissions"));
  };
}

export async function getPermissionsForRole(role) {
  if (role === SUPER_ADMIN_ROLE) return ["*"];
  return [];
}
