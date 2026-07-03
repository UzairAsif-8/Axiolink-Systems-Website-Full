import jwt from "jsonwebtoken";
import prisma from "../config/database.js";
import { env } from "../config/env.js";
import { ApiError, SUPER_ADMIN_ROLE } from "../utils/helpers.js";
import { authenticateDemoAdmin, getDemoAdminById } from "./demo-data.service.js";
import {
  authenticateSuperAdmin,
  buildSuperAdminUser,
  changeSuperAdminPassword,
  getSuperAdminCredentials,
  persistSuperAdminCredentials,
  SUPER_ADMIN_SETTING_KEY,
} from "./super-admin.service.js";

export const ENV_TOKEN_TYPE = "env_super_admin";

const signAccess = (user) =>
  jwt.sign(
    {
      sub: user.id,
      role: user.role,
      ...(user.isEnvSuperAdmin && { type: ENV_TOKEN_TYPE }),
    },
    env.jwt.accessSecret,
    { expiresIn: env.jwt.accessExpires }
  );

const signRefresh = (user, rememberMe = false) => {
  const expiresIn = rememberMe ? "30d" : env.jwt.refreshExpires;
  return jwt.sign(
    {
      sub: user.id,
      role: user.role,
      ...(user.isEnvSuperAdmin && { type: ENV_TOKEN_TYPE }),
    },
    env.jwt.refreshSecret,
    { expiresIn }
  );
};

export const authService = {
  async login({ email, password, rememberMe }) {
    const normalizedEmail = email.toLowerCase().trim();

    const superAdmin = await authenticateSuperAdmin(normalizedEmail, password);
    if (superAdmin) {
      const existing = await prisma.siteSetting.findUnique({
        where: { key: SUPER_ADMIN_SETTING_KEY },
      });
      if (!existing) {
        const credentials = await getSuperAdminCredentials();
        if (credentials) await persistSuperAdminCredentials(credentials);
      }

      const accessToken = signAccess(superAdmin);
      const refreshToken = signRefresh(superAdmin, rememberMe);
      return {
        user: {
          id: superAdmin.id,
          email: superAdmin.email,
          name: superAdmin.name,
          role: superAdmin.role,
        },
        accessToken,
        refreshToken,
      };
    }

    if (env.useDemoData) {
      const demoUser = authenticateDemoAdmin(normalizedEmail, password);
      if (demoUser) {
        const accessToken = signAccess(demoUser);
        const refreshToken = signRefresh(demoUser, rememberMe);
        return { user: demoUser, accessToken, refreshToken };
      }
    }

    throw new ApiError(401, "Invalid email or password");
  },

  async refresh(refreshToken) {
    if (!refreshToken) throw new ApiError(401, "Refresh token required");

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, env.jwt.refreshSecret);
    } catch {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (decoded.type === ENV_TOKEN_TYPE) {
      const credentials = await getSuperAdminCredentials();
      if (!credentials) throw new ApiError(401, "Invalid refresh token");
      const user = buildSuperAdminUser(credentials);
      return { accessToken: signAccess(user) };
    }

    if (env.useDemoData) {
      const demoUser = getDemoAdminById(decoded.sub);
      if (demoUser) return { accessToken: signAccess(demoUser) };
    }

    throw new ApiError(401, "Invalid refresh token");
  },

  async logout(_refreshToken) {
    return { message: "Logged out" };
  },

  async me(tokenUser) {
    if (tokenUser.isEnvSuperAdmin) {
      const credentials = await getSuperAdminCredentials();
      if (!credentials) throw new ApiError(503, "Super Admin credentials are not configured");
      return buildSuperAdminUser(credentials);
    }

    if (env.useDemoData) {
      const demoUser = getDemoAdminById(tokenUser.id);
      if (demoUser) return demoUser;
    }

    throw new ApiError(401, "User not found");
  },

  async changePassword(body) {
    return changeSuperAdminPassword(body);
  },

  resolveUserFromToken(decoded) {
    if (decoded.type === ENV_TOKEN_TYPE) {
      return {
        id: decoded.sub,
        role: SUPER_ADMIN_ROLE,
        isEnvSuperAdmin: true,
      };
    }
    if (env.useDemoData) {
      const demoUser = getDemoAdminById(decoded.sub);
      if (demoUser) return demoUser;
    }
    throw new ApiError(401, "Invalid or expired token");
  },
};

export { buildSuperAdminUser };
