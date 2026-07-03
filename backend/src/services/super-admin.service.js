import bcrypt from "bcryptjs";
import prisma from "../config/database.js";
import { env } from "../config/env.js";
import { ApiError, SUPER_ADMIN_ROLE } from "../utils/helpers.js";
import { SUPER_ADMIN_ID } from "../config/env.js";

export const SUPER_ADMIN_SETTING_KEY = "super_admin";

export async function getSuperAdminCredentials() {
  const setting = await prisma.siteSetting.findUnique({
    where: { key: SUPER_ADMIN_SETTING_KEY },
  });

  if (setting?.value?.email && setting?.value?.passwordHash) {
    return {
      email: String(setting.value.email).toLowerCase(),
      passwordHash: setting.value.passwordHash,
      name: setting.value.name || env.admin.name || "Super Admin",
    };
  }

  if (env.admin.email && env.admin.passwordHash) {
    return {
      email: env.admin.email.toLowerCase(),
      passwordHash: env.admin.passwordHash,
      name: env.admin.name || "Super Admin",
    };
  }

  return null;
}

export async function persistSuperAdminCredentials({ email, passwordHash, name }) {
  await prisma.siteSetting.upsert({
    where: { key: SUPER_ADMIN_SETTING_KEY },
    update: {
      value: {
        email: email.toLowerCase(),
        passwordHash,
        name,
      },
    },
    create: {
      key: SUPER_ADMIN_SETTING_KEY,
      value: {
        email: email.toLowerCase(),
        passwordHash,
        name,
      },
    },
  });
}

export function buildSuperAdminUser(credentials) {
  return {
    id: SUPER_ADMIN_ID,
    email: credentials.email,
    name: credentials.name,
    role: SUPER_ADMIN_ROLE,
    isEnvSuperAdmin: true,
  };
}

export async function authenticateSuperAdmin(email, password) {
  const credentials = await getSuperAdminCredentials();
  if (!credentials) {
    throw new ApiError(503, "Super Admin credentials are not configured on the server");
  }

  if (email.toLowerCase() !== credentials.email) return null;

  const valid = await bcrypt.compare(password, credentials.passwordHash);
  if (!valid) return null;

  return buildSuperAdminUser(credentials);
}

export async function changeSuperAdminPassword({ currentPassword, newPassword }) {
  const credentials = await getSuperAdminCredentials();
  if (!credentials) {
    throw new ApiError(503, "Super Admin credentials are not configured on the server");
  }

  const valid = await bcrypt.compare(currentPassword, credentials.passwordHash);
  if (!valid) throw new ApiError(401, "Current password is incorrect");

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await persistSuperAdminCredentials({
    email: credentials.email,
    passwordHash,
    name: credentials.name,
  });

  return { message: "Password updated successfully" };
}
