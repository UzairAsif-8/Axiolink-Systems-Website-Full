import prisma from "../config/database.js";
import { SUPER_ADMIN_ID } from "../config/env.js";

export const audit = async ({ userId, userEmail, action, entity, entityId, module, metadata, ip, userAgent }) => {
  const safeUserId = userId && userId !== SUPER_ADMIN_ID ? userId : null;
  try {
    await prisma.auditLog.create({
      data: {
        userId: safeUserId,
        userEmail: userEmail || null,
        action,
        entity,
        entityId: entityId || null,
        module: module || null,
        metadata,
        ip,
        userAgent: userAgent || null,
      },
    });
  } catch (err) {
    console.error("Audit log failed:", err.message);
  }
};

export const notify = async ({ userId, type, title, message, link }) => {
  await prisma.notification.create({
    data: { userId, type, title, message, link },
  });
};

export const notifyAdmins = async ({ type, title, message, link }) => {
  const admins = await prisma.user.findMany({
    where: {
      role: { in: ["ADMIN", "HR"] },
      isActive: true,
      deletedAt: null,
    },
    select: { id: true },
  });

  const rows = admins.map((a) => ({
    userId: a.id,
    type,
    title,
    message,
    link,
  }));

  rows.push({ userId: null, type, title, message, link });

  if (rows.length) {
    await prisma.notification.createMany({ data: rows });
  }
};
