import prisma from "../config/database.js";
import { asyncHandler, success, paginated, parsePagination, ApiError } from "../utils/helpers.js";
import { validate, applicationStatusSchema, noteSchema, certificateIssuedSchema } from "../validators/schemas.js";
import { notifyAdmins } from "../services/audit.service.js";
import { applicationService } from "../services/application.service.js";
import { uploadFile, virusScanHook } from "../services/upload.service.js";

export const submitInternship = asyncHandler(async (req, res) => {
  let payload = {};
  if (req.body.application) {
    payload = JSON.parse(req.body.application);
  } else {
    payload = req.body;
  }

  const internship = payload.internshipPosition
    ? await prisma.internship.findFirst({ where: { slug: payload.internshipPosition } })
    : null;

  let resumeUrl = null;
  let resumePublicId = null;
  if (req.file) {
    await virusScanHook(req.file.path);
    const uploaded = await uploadFile(req.file, { folder: "resumes", req });
    resumeUrl = uploaded.url;
    resumePublicId = uploaded.publicId;
  }

  const application = await prisma.application.create({
    data: {
      applicationType: "internship",
      fullName: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      currentCity: payload.currentCity,
      linkedin: payload.linkedin,
      githubPortfolio: payload.githubPortfolio,
      internshipId: internship?.id,
      internshipTitle: payload.internshipTitle || internship?.title,
      university: payload.university,
      degree: payload.degree,
      semester: payload.semester,
      graduationYear: payload.graduationYear,
      skills: payload.skills || [],
      whyJoin: payload.whyJoin,
      proudProject: payload.proudProject,
      portfolioWebsite: payload.portfolioWebsite,
      availableStartDate: payload.availableStartDate ? new Date(payload.availableStartDate) : null,
      resumeUrl,
      resumePublicId,
      payload,
    },
  });

  await notifyAdmins({
    type: "application",
    title: "New internship application",
    message: `${application.fullName} applied for ${application.internshipTitle || "an internship"}`,
    link: `/admin/applications/${application.id}`,
  });

  success(res, { id: application.id, message: "Application submitted" }, 201);
});

export const submitJob = asyncHandler(async (req, res) => {
  let payload = {};
  if (req.body.application) {
    payload = JSON.parse(req.body.application);
  } else {
    payload = req.body;
  }

  const job = payload.jobPosition
    ? await prisma.job.findFirst({ where: { slug: payload.jobPosition, deletedAt: null } })
    : null;

  let resumeUrl = null;
  let resumePublicId = null;
  if (req.file) {
    await virusScanHook(req.file.path);
    const uploaded = await uploadFile(req.file, { folder: "resumes", req });
    resumeUrl = uploaded.url;
    resumePublicId = uploaded.publicId;
  }

  const application = await prisma.application.create({
    data: {
      applicationType: "job",
      fullName: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      currentCity: payload.currentCity,
      linkedin: payload.linkedin,
      githubPortfolio: payload.githubPortfolio,
      jobId: job?.id,
      internshipTitle: payload.jobTitle || job?.title,
      university: payload.university,
      degree: payload.degree,
      semester: payload.semester,
      graduationYear: payload.graduationYear,
      skills: payload.skills || [],
      whyJoin: payload.whyJoin,
      proudProject: payload.proudProject,
      portfolioWebsite: payload.portfolioWebsite,
      availableStartDate: payload.availableStartDate ? new Date(payload.availableStartDate) : null,
      resumeUrl,
      resumePublicId,
      payload,
    },
  });

  await notifyAdmins({
    type: "application",
    title: "New job application",
    message: `${application.fullName} applied for ${application.internshipTitle || "a job"}`,
    link: `/admin/applications/${application.id}`,
  });

  success(res, { id: application.id, message: "Application submitted" }, 201);
});

export const listAdmin = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const { status, search, internshipId, jobId, applicationType } = req.query;

  const where = {
    deletedAt: null,
    ...(applicationType && { applicationType }),
    ...(status && { status: status.toUpperCase() }),
    ...(internshipId && { internshipId }),
    ...(jobId && { jobId }),
    ...(search && {
      OR: [
        { fullName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  const [data, total] = await prisma.$transaction([
    prisma.application.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        internship: { select: { title: true, slug: true } },
        job: { select: { title: true, slug: true } },
        intern: { select: { startDate: true, endDate: true } },
        statusHistory: { orderBy: { createdAt: "desc" }, take: 3 },
      },
    }),
    prisma.application.count({ where }),
  ]);

  paginated(res, data, { page, limit, total, pages: Math.ceil(total / limit) });
});

export const getById = asyncHandler(async (req, res) => {
  const item = await applicationService.getById(req.params.id);
  success(res, item);
});

export const updateStatus = asyncHandler(async (req, res) => {
  const { status, note, internshipStartDate, internshipEndDate } = validate(applicationStatusSchema, req.body);
  const item = await applicationService.updateStatus(req.params.id, status, req.user, {
    note,
    internshipStartDate,
    internshipEndDate,
  }, req.ip);
  success(res, item);
});

export const markCertificate = asyncHandler(async (req, res) => {
  const { issued } = validate(certificateIssuedSchema, req.body);
  const item = await applicationService.markCertificateIssued(
    req.params.id,
    issued !== false,
    req.user,
    req.ip
  );
  success(res, item);
});

export const addNote = asyncHandler(async (req, res) => {
  const { content } = validate(noteSchema, req.body);
  const note = await prisma.applicationNote.create({
    data: {
      applicationId: req.params.id,
      content,
      authorId: req.user.isEnvSuperAdmin ? null : req.user.id,
    },
    include: { author: { select: { name: true } } },
  });
  success(res, note, 201);
});

export const remove = asyncHandler(async (req, res) => {
  const item = await prisma.application.findFirst({
    where: { id: req.params.id, deletedAt: null },
  });
  if (!item) throw new ApiError(404, "Application not found");
  await prisma.application.update({
    where: { id: req.params.id },
    data: { deletedAt: new Date() },
  });
  success(res, { message: "Application deleted" });
});

export const exportCsv = asyncHandler(async (req, res) => {
  const apps = await prisma.application.findMany({
    where: { deletedAt: null, applicationType: "internship" },
    orderBy: { createdAt: "desc" },
  });

  const header = "ID,Name,Email,Phone,Status,Internship,Certificate Issued,Created\n";
  const rows = apps
    .map(
      (a) =>
        `${a.id},"${a.fullName}","${a.email}","${a.phone}",${a.status},"${a.internshipTitle || ""}",${a.certificateIssued},${a.createdAt.toISOString()}`
    )
    .join("\n");

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=applications.csv");
  res.send(header + rows);
});
