import prisma from "../config/database.js";
import { ApiError, parsePagination } from "../utils/helpers.js";
import { audit, notifyAdmins } from "./audit.service.js";
import { certificateService } from "./certificate.service.js";

function actorMeta(user) {
  return {
    changedById: user?.isEnvSuperAdmin ? null : user?.id,
    changedByName: user?.name || user?.email || "Admin",
    updatedById: user?.isEnvSuperAdmin ? null : user?.id,
  };
}

function buildStatusTimestamps(status, existing) {
  const now = new Date();
  const patch = {};
  if (status === "ACTIVE" && !existing.startedAt) patch.startedAt = now;
  if (status === "COMPLETED") {
    patch.completedAt = now;
    patch.progressPercentage = Math.max(existing.progressPercentage || 0, 100);
    patch.progress = 100;
  }
  if (status === "WITHDRAWN") patch.withdrawnAt = now;
  if (status === "ACTIVE") {
    patch.certificateIssued = false;
    patch.certificateIssuedAt = null;
  }
  return patch;
}

export const enrollmentService = {
  async listAdmin(query) {
    const { page, limit, skip } = parsePagination(query);
    const { status, courseId, search } = query;

    const where = {
      deletedAt: null,
      ...(status && { status: status.toUpperCase() }),
      ...(courseId && { courseId }),
      ...(search && {
        OR: [
          { fullName: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    const [data, total] = await prisma.$transaction([
      prisma.enrollment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          course: { select: { id: true, title: true, slug: true } },
          statusHistory: { orderBy: { createdAt: "desc" }, take: 5 },
        },
      }),
      prisma.enrollment.count({ where }),
    ]);

    return { data, meta: { page, limit, total, pages: Math.ceil(total / limit) } };
  },

  async getById(id) {
    const item = await prisma.enrollment.findFirst({
      where: { id, deletedAt: null },
      include: {
        course: true,
        student: true,
        statusHistory: { orderBy: { createdAt: "desc" } },
        certificates: { where: { deletedAt: null }, orderBy: { issueDate: "desc" } },
      },
    });
    if (!item) throw new ApiError(404, "Enrollment not found");
    return item;
  },

  async update(id, body, user, ip) {
    await this.getById(id);
    const meta = actorMeta(user);

    const data = {
      ...(body.progress !== undefined && {
        progress: body.progress,
        progressPercentage: body.progress,
      }),
      ...(body.attendance !== undefined && {
        attendance: body.attendance,
        attendancePercentage: body.attendance,
      }),
      ...(body.paymentStatus && { paymentStatus: body.paymentStatus }),
      ...(body.remarks !== undefined && { remarks: body.remarks }),
      updatedById: meta.updatedById,
    };

    const item = await prisma.enrollment.update({
      where: { id },
      data,
      include: { course: { select: { title: true, slug: true } } },
    });

    await audit({
      userId: meta.changedById,
      userEmail: user?.email,
      action: "ENROLLMENT_UPDATED",
      entity: "Enrollment",
      entityId: id,
      module: "students",
      ip,
    });

    return item;
  },

  async updateStatus(id, status, user, { note } = {}, ip) {
    const existing = await prisma.enrollment.findFirst({ where: { id, deletedAt: null } });
    if (!existing) throw new ApiError(404, "Enrollment not found");

    const meta = actorMeta(user);
    const timestamps = buildStatusTimestamps(status, existing);

    const item = await prisma.$transaction(async (tx) => {
      const updated = await tx.enrollment.update({
        where: { id },
        data: { status, ...timestamps, updatedById: meta.updatedById },
        include: { course: { select: { title: true, slug: true } } },
      });

      await tx.enrollmentStatusHistory.create({
        data: {
          enrollmentId: id,
          fromStatus: existing.status,
          toStatus: status,
          changedById: meta.changedById,
          changedByName: meta.changedByName,
          remarks: note || `Status changed to ${status.replace(/_/g, " ")}`,
        },
      });

      return updated;
    });

    await audit({
      userId: meta.changedById,
      userEmail: user?.email,
      action: "ENROLLMENT_STATUS_UPDATED",
      entity: "Enrollment",
      entityId: id,
      module: "students",
      metadata: { fromStatus: existing.status, toStatus: status },
      ip,
    });

    return item;
  },

  async markCertificateIssued(id, issued, user, ip) {
    const existing = await prisma.enrollment.findFirst({
      where: { id, deletedAt: null },
      include: { course: true },
    });
    if (!existing) throw new ApiError(404, "Enrollment not found");
    if (existing.status !== "COMPLETED") {
      throw new ApiError(400, "Certificate can only be issued for completed enrollments");
    }

    const meta = actorMeta(user);
    const now = new Date();

    if (!issued) {
      return prisma.enrollment.update({
        where: { id },
        data: { certificateIssued: false, certificateIssuedAt: null, updatedById: meta.updatedById },
      });
    }

    const item = await prisma.$transaction(async (tx) => {
      await certificateService.createForEnrollment(
        {
          enrollment: existing,
          courseName: existing.course?.title || "Course",
          studentName: existing.fullName,
        },
        user,
        tx
      );

      return tx.enrollment.update({
        where: { id },
        data: {
          certificateIssued: true,
          certificateIssuedAt: now,
          updatedById: meta.updatedById,
        },
        include: { course: { select: { title: true, slug: true } } },
      });
    });

    await audit({
      userId: meta.changedById,
      userEmail: user?.email,
      action: "CERTIFICATE_ISSUED",
      entity: "Enrollment",
      entityId: id,
      module: "certificates",
      ip,
    });

    await notifyAdmins({
      type: "certificate",
      title: "Course certificate issued",
      message: `Certificate issued for ${existing.fullName}`,
      link: `/admin/students/${id}`,
    });

    return item;
  },

  async remove(id, user, ip) {
    await this.getById(id);
    const meta = actorMeta(user);

    await prisma.enrollment.update({
      where: { id },
      data: { deletedAt: new Date(), updatedById: meta.updatedById },
    });

    await audit({
      userId: meta.changedById,
      userEmail: user?.email,
      action: "ENROLLMENT_DELETED",
      entity: "Enrollment",
      entityId: id,
      module: "students",
      ip,
    });

    return { message: "Enrollment deleted" };
  },
};
