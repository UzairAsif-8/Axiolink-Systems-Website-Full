import prisma from "../config/database.js";

import { ApiError } from "../utils/helpers.js";

import { audit, notifyAdmins } from "./audit.service.js";

import { certificateService } from "./certificate.service.js";



const ACTIVE_INTERN_STATUSES = ["SELECTED", "INTERNSHIP_STARTED"];



function actorMeta(user) {

  return {

    changedById: user?.isEnvSuperAdmin ? null : user?.id,

    changedByName: user?.name || user?.email || "Admin",

    updatedById: user?.isEnvSuperAdmin ? null : user?.id,

  };

}



function parseDateInput(value, label = "date") {

  if (!value) return null;

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {

    throw new ApiError(400, `Invalid ${label}`);

  }

  return parsed;

}



function formatDateLabel(value) {

  return parseDateInput(value).toLocaleDateString("en-CA");

}



function buildStatusTimestamps(status, existing, { startDate } = {}) {

  const now = new Date();

  const patch = {};

  const start = startDate || now;



  if (ACTIVE_INTERN_STATUSES.includes(status)) {

    if (!existing.activeInternAt) patch.activeInternAt = start;

    patch.internshipStartedAt = startDate || existing.internshipStartedAt || now;

  }

  if (status === "INTERNSHIP_COMPLETED") {

    patch.internshipCompletedAt = now;

  }

  if (status === "WITHDRAWN") {

    patch.withdrawnAt = now;

  }

  if (ACTIVE_INTERN_STATUSES.includes(status)) {

    patch.certificateIssued = false;

    patch.certificateIssuedAt = null;

  }

  return patch;

}



async function syncInternRecord(application, status, tx, { startDate, endDate } = {}) {

  if (!application.internshipId) return;



  const client = tx || prisma;

  const existing = await client.intern.findFirst({

    where: { applicationId: application.id, deletedAt: null },

  });



  if (ACTIVE_INTERN_STATUSES.includes(status)) {

    const start = startDate || existing?.startDate || new Date();

    const data = { status: "ACTIVE", startDate: start };

    if (endDate) data.endDate = endDate;



    if (existing) {

      await client.intern.update({

        where: { id: existing.id },

        data,

      });

    } else {

      await client.intern.create({

        data: {

          applicationId: application.id,

          internshipId: application.internshipId,

          fullName: application.fullName,

          email: application.email,

          phone: application.phone,

          status: "ACTIVE",

          startDate: start,

          endDate: endDate || null,

        },

      });

    }

  } else if (status === "INTERNSHIP_COMPLETED" && existing) {

    await client.intern.update({

      where: { id: existing.id },

      data: { status: "COMPLETED", endDate: new Date() },

    });

  } else if (status === "WITHDRAWN" && existing) {

    await client.intern.update({

      where: { id: existing.id },

      data: { status: "WITHDRAWN", endDate: new Date() },

    });

  }

}



export const applicationService = {

  async getById(id) {

    const item = await prisma.application.findFirst({

      where: { id, deletedAt: null },

      include: {

        internship: true,

        notes: { include: { author: { select: { name: true } } }, orderBy: { createdAt: "desc" } },

        statusHistory: { orderBy: { createdAt: "desc" }, take: 50 },

        certificateRecord: true,

        intern: true,

      },

    });

    if (!item) throw new ApiError(404, "Application not found");

    return item;

  },



  async updateStatus(id, status, user, { note, internshipStartDate, internshipEndDate } = {}, ip) {

    const existing = await prisma.application.findFirst({ where: { id, deletedAt: null } });

    if (!existing) throw new ApiError(404, "Application not found");



    const wasActiveIntern = ACTIVE_INTERN_STATUSES.includes(existing.status);

    const isApproving = status === "SELECTED" && !wasActiveIntern;



    let parsedStart = null;

    let parsedEnd = null;



    if (isApproving) {

      if (!internshipStartDate || !internshipEndDate) {

        throw new ApiError(400, "Internship start and end dates are required when approving");

      }

      parsedStart = parseDateInput(internshipStartDate, "start date");

      parsedEnd = parseDateInput(internshipEndDate, "end date");

      if (parsedEnd < parsedStart) {

        throw new ApiError(400, "End date must be on or after start date");

      }

    }



    const meta = actorMeta(user);

    const timestamps = buildStatusTimestamps(status, existing, { startDate: parsedStart });

    const historyNote =

      note ||

      (isApproving

        ? `Approved with internship ${formatDateLabel(internshipStartDate)} to ${formatDateLabel(internshipEndDate)}`

        : `Status changed to ${status.replace(/_/g, " ")}`);



    const item = await prisma.$transaction(async (tx) => {

      const updated = await tx.application.update({

        where: { id },

        data: {

          status,

          ...timestamps,

          updatedById: meta.updatedById,

          currentStage: status.replace(/_/g, " "),

        },

        include: { internship: { select: { title: true, slug: true } } },

      });



      await tx.applicationStatusHistory.create({

        data: {

          applicationId: id,

          fromStatus: existing.status,

          toStatus: status,

          changedById: meta.changedById,

          changedByName: meta.changedByName,

          remarks: historyNote,

        },

      });



      await syncInternRecord(updated, status, tx, {

        startDate: parsedStart,

        endDate: parsedEnd,

      });

      return updated;

    });



    await audit({

      userId: meta.changedById,

      userEmail: user?.email,

      action: "APPLICATION_STATUS_UPDATED",

      entity: "Application",

      entityId: id,

      module: "applications",

      metadata: {

        fromStatus: existing.status,

        toStatus: status,

        ...(parsedStart && { internshipStartDate: parsedStart.toISOString() }),

        ...(parsedEnd && { internshipEndDate: parsedEnd.toISOString() }),

      },

      ip,

    });



    return item;

  },



  async markCertificateIssued(id, issued, user, ip) {

    const existing = await prisma.application.findFirst({

      where: { id, deletedAt: null },

      include: { internship: true },

    });

    if (!existing) throw new ApiError(404, "Application not found");

    if (existing.status !== "INTERNSHIP_COMPLETED") {

      throw new ApiError(400, "Certificate can only be issued for completed internships");

    }



    const meta = actorMeta(user);

    const now = new Date();



    if (!issued) {

      const item = await prisma.application.update({

        where: { id },

        data: {

          certificateIssued: false,

          certificateIssuedAt: null,

          updatedById: meta.updatedById,

        },

      });

      return item;

    }



    const item = await prisma.$transaction(async (tx) => {

      let certificateId = existing.certificateId;



      if (!certificateId) {

        const cert = await certificateService.createForApplication(

          {

            application: existing,

            courseName: existing.internshipTitle || existing.internship?.title || "Internship Program",

            studentName: existing.fullName,

          },

          user,

          tx

        );

        certificateId = cert.id;

      }



      const updated = await tx.application.update({

        where: { id },

        data: {

          certificateIssued: true,

          certificateIssuedAt: now,

          certificateId,

          status: "CERTIFICATE_ISSUED",

          updatedById: meta.updatedById,

        },

        include: {

          internship: { select: { title: true, slug: true } },

          certificateRecord: true,

        },

      });



      await tx.applicationStatusHistory.create({

        data: {

          applicationId: id,

          fromStatus: existing.status,

          toStatus: "CERTIFICATE_ISSUED",

          changedById: meta.changedById,

          changedByName: meta.changedByName,

          remarks: "Certificate issued",

        },

      });



      return updated;

    });



    await audit({

      userId: meta.changedById,

      userEmail: user?.email,

      action: "CERTIFICATE_ISSUED",

      entity: "Application",

      entityId: id,

      module: "certificates",

      ip,

    });



    await notifyAdmins({

      type: "certificate",

      title: "Internship certificate issued",

      message: `Certificate issued for ${existing.fullName}`,

      link: `/admin/applications/${id}`,

    });



    return item;

  },

};

