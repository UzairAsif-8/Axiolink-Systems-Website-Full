import prisma from "../config/database.js";
import { ApiError, parsePagination } from "../utils/helpers.js";
import { audit } from "./audit.service.js";

export const internService = {
  async listAdmin(query) {
    const { page, limit, skip } = parsePagination(query);
    const { status, internshipId, search } = query;

    const where = {
      deletedAt: null,
      ...(status && { status: status.toUpperCase() }),
      ...(internshipId && { internshipId }),
      ...(search && {
        OR: [
          { fullName: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    const [data, total] = await prisma.$transaction([
      prisma.intern.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          internship: { select: { id: true, title: true, slug: true } },
          application: {
            select: {
              id: true,
              status: true,
              certificateIssued: true,
              activeInternAt: true,
              internshipCompletedAt: true,
            },
          },
        },
      }),
      prisma.intern.count({ where }),
    ]);

    return { data, meta: { page, limit, total, pages: Math.ceil(total / limit) } };
  },

  async getById(id) {
    const item = await prisma.intern.findFirst({
      where: { id, deletedAt: null },
      include: {
        internship: true,
        application: {
          include: {
            statusHistory: { orderBy: { createdAt: "desc" }, take: 20 },
            certificateRecord: true,
          },
        },
      },
    });
    if (!item) throw new ApiError(404, "Intern not found");
    return item;
  },

  async updateStatus(id, status, user, ip) {
    const existing = await prisma.intern.findFirst({ where: { id, deletedAt: null } });
    if (!existing) throw new ApiError(404, "Intern not found");

    const data = { status };
    if (status === "COMPLETED") data.endDate = new Date();
    if (status === "WITHDRAWN" || status === "TERMINATED") data.endDate = new Date();

    const item = await prisma.intern.update({
      where: { id },
      data,
      include: { internship: { select: { title: true } }, application: true },
    });

    await audit({
      userId: user?.isEnvSuperAdmin ? null : user?.id,
      userEmail: user?.email,
      action: "INTERN_STATUS_UPDATED",
      entity: "Intern",
      entityId: id,
      module: "internships",
      metadata: { status },
      ip,
    });

    return item;
  },
};
