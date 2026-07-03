import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { ApiError } from "../utils/helpers.js";
import { authService, ENV_TOKEN_TYPE } from "../services/auth.service.js";
import { getDemoAdminById } from "../services/demo-data.service.js";
import { buildSuperAdminUser, getSuperAdminCredentials } from "../services/super-admin.service.js";

export const authenticate = async (req, _res, next) => {
  try {
    const header = req.headers.authorization;
    const token =
      header?.startsWith("Bearer ") ? header.slice(7) : req.cookies?.accessToken;

    if (!token) throw new ApiError(401, "Authentication required");

    const decoded = jwt.verify(token, env.jwt.accessSecret);

    if (decoded.type === ENV_TOKEN_TYPE) {
      const credentials = await getSuperAdminCredentials();
      if (!credentials) throw new ApiError(401, "Invalid or expired token");
      req.user = buildSuperAdminUser(credentials);
      return next();
    }

    if (env.useDemoData) {
      const demoUser = getDemoAdminById(decoded.sub);
      if (demoUser && demoUser.role === decoded.role) {
        req.user = demoUser;
        return next();
      }
    }

    req.user = authService.resolveUserFromToken(decoded);
    next();
  } catch (err) {
    if (err instanceof ApiError) return next(err);
    next(new ApiError(401, "Invalid or expired token"));
  }
};
