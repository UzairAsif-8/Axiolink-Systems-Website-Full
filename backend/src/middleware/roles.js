import { ApiError, SUPER_ADMIN_ROLE } from "../utils/helpers.js";

export const requireRoles = (...roles) => (req, _res, next) => {
  if (!req.user) return next(new ApiError(401, "Authentication required"));
  const effectiveRole = req.user.isEnvSuperAdmin ? SUPER_ADMIN_ROLE : req.user.role;
  if (!roles.includes(effectiveRole)) {
    return next(new ApiError(403, "Insufficient permissions"));
  }
  next();
};

/** Super Admin only — single unified admin panel */
export const canAccessAdmin = requireRoles(SUPER_ADMIN_ROLE);

export const canViewDashboard = canAccessAdmin;
export const canManageHR = canAccessAdmin;
export const canManageCourses = canAccessAdmin;
export const canManageCMS = canAccessAdmin;
export const canManageMessages = canAccessAdmin;
export const canViewHR = canAccessAdmin;
export const canViewCourses = canAccessAdmin;
export const canViewCMS = canAccessAdmin;
export const canViewMessages = canAccessAdmin;
export const canViewSettings = canAccessAdmin;
export const canManageContent = canAccessAdmin;
export const canManageUsers = canAccessAdmin;
