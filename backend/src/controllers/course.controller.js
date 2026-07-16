import prisma from "../config/database.js";
import { asyncHandler, success, paginated, parsePagination, slugify, ApiError } from "../utils/helpers.js";
import { validate, courseSchema, enrollmentSchema, enrollmentStatusSchema, enrollmentUpdateSchema, enrollmentCertificateSchema } from "../validators/schemas.js";
import { notifyAdmins } from "../services/audit.service.js";
import { enrollmentService } from "../services/enrollment.service.js";
import { uploadFile } from "../services/upload.service.js";

function isMissingColumnError(err) {
  return err?.code === "P2022";
}

function stripCourseCompletionFields(data = {}) {
  const next = { ...data };
  delete next.isCompleted;
  delete next.completedAt;
  return next;
}

function normalizeCourseBody(body) {
  const next = { ...body };
  if (next.isCompleted) {
    next.enrollmentOpen = false;
    if (!next.completedAt) next.completedAt = new Date();
  } else if (next.isCompleted === false) {
    next.completedAt = null;
  }
  return next;
}

export const listPublic = asyncHandler(async (_req, res) => {
  let data;
  try {
    data = await prisma.course.findMany({
      where: {
        deletedAt: null,
        status: "PUBLISHED",
        enrollmentOpen: true,
        isCompleted: false,
      },
      orderBy: { title: "asc" },
    });
  } catch (err) {
    if (!isMissingColumnError(err)) throw err;
    data = await prisma.course.findMany({
      where: {
        deletedAt: null,
        status: "PUBLISHED",
        enrollmentOpen: true,
      },
      orderBy: { title: "asc" },
    });
  }
  success(res, data);
});

export const listPreviousPublic = asyncHandler(async (_req, res) => {
  let data;
  try {
    data = await prisma.course.findMany({
      where: {
        deletedAt: null,
        status: "PUBLISHED",
        isCompleted: true,
      },
      orderBy: [{ completedAt: "desc" }, { updatedAt: "desc" }],
    });
  } catch (err) {
    if (!isMissingColumnError(err)) throw err;
    data = [];
  }
  success(res, data);
});

export const getBySlugPublic = asyncHandler(async (req, res) => {
  const item = await prisma.course.findFirst({
    where: { slug: req.params.slug, deletedAt: null, status: "PUBLISHED" },
  });
  if (!item) throw new ApiError(404, "Course not found");
  success(res, item);
});

export const listAdmin = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const where = { deletedAt: null };
  const [data, total] = await prisma.$transaction([
    prisma.course.findMany({ where, skip, take: limit, orderBy: { updatedAt: "desc" } }),
    prisma.course.count({ where }),
  ]);
  paginated(res, data, { page, limit, total, pages: Math.ceil(total / limit) });
});

export const getById = asyncHandler(async (req, res) => {
  const item = await prisma.course.findFirst({
    where: { id: req.params.id, deletedAt: null },
  });
  if (!item) throw new ApiError(404, "Course not found");
  success(res, item);
});

export const create = asyncHandler(async (req, res) => {
  const body = normalizeCourseBody(validate(courseSchema, req.body));
  const slug = body.slug || slugify(body.title);
  const createData = {
    ...body,
    slug,
    thumbnailUrl: body.thumbnailUrl || null,
    bannerUrl: body.bannerUrl || null,
    completedAt: body.completedAt ? new Date(body.completedAt) : body.isCompleted ? new Date() : null,
  };

  let item;
  try {
    item = await prisma.course.create({ data: createData });
  } catch (err) {
    if (!isMissingColumnError(err)) throw err;
    item = await prisma.course.create({ data: stripCourseCompletionFields(createData) });
  }
  success(res, item, 201);
});

export const update = asyncHandler(async (req, res) => {
  const body = normalizeCourseBody(validate(courseSchema.partial(), req.body));
  const updateData = {
    ...body,
    ...(body.thumbnailUrl !== undefined && { thumbnailUrl: body.thumbnailUrl || null }),
    ...(body.bannerUrl !== undefined && { bannerUrl: body.bannerUrl || null }),
    ...(body.completedAt !== undefined && {
      completedAt: body.completedAt ? new Date(body.completedAt) : null,
    }),
    ...(body.isCompleted === true && !body.completedAt && { completedAt: new Date() }),
    ...(body.isCompleted === false && { completedAt: null }),
  };

  let item;
  try {
    item = await prisma.course.update({
      where: { id: req.params.id },
      data: updateData,
    });
  } catch (err) {
    if (!isMissingColumnError(err)) throw err;
    item = await prisma.course.update({
      where: { id: req.params.id },
      data: stripCourseCompletionFields(updateData),
    });
  }
  success(res, item);
});

export const uploadThumbnail = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, "Image file is required");
  const uploaded = await uploadFile(req.file, { folder: "courses", req });
  success(res, {
    thumbnailUrl: uploaded.url,
    thumbnailPublicId: uploaded.publicId,
  }, 200, "Image uploaded");
});

export const remove = asyncHandler(async (req, res) => {
  await prisma.course.update({
    where: { id: req.params.id },
    data: { deletedAt: new Date(), status: "ARCHIVED" },
  });
  success(res, { message: "Course archived" });
});

export const enrollPublic = asyncHandler(async (req, res) => {
  let raw = {};
  if (req.body.enrollment) {
    raw = typeof req.body.enrollment === "string" ? JSON.parse(req.body.enrollment) : req.body.enrollment;
  } else {
    raw = req.body;
  }

  const body = validate(enrollmentSchema, raw);
  const slug = body.courseSlug || body.course_id;

  if (!req.file) {
    throw new ApiError(400, "Payment slip is required to complete enrollment");
  }

  let course = null;
  if (body.courseId) {
    course = await prisma.course.findFirst({ where: { id: body.courseId, deletedAt: null } });
  } else if (slug) {
    course = await prisma.course.findFirst({ where: { slug, deletedAt: null } });
  }

  if (!course) throw new ApiError(404, "Course not found");
  if (course.isCompleted || !course.enrollmentOpen) {
    throw new ApiError(400, "Enrollment is closed for this course");
  }

  const uploaded = await uploadFile(req.file, { folder: "payment-slips", req });

  const enrollment = await prisma.enrollment.create({
    data: {
      fullName: body.name,
      email: body.email,
      phone: body.phone,
      courseId: course.id,
      paymentStatus: "PENDING",
      paymentSlipUrl: uploaded.url,
      paymentSlipPublicId: uploaded.publicId,
    },
  });

  await notifyAdmins({
    type: "enrollment",
    title: "New course enrollment",
    message: `${body.name} enrolled in ${course.title} (payment slip uploaded)`,
    link: `/admin/students/${enrollment.id}`,
  });

  success(
    res,
    {
      id: enrollment.id,
      message:
        "Your response has been recorded. You will receive a confirmation email once your payment is verified.",
    },
    201
  );
});

export const listEnrollments = asyncHandler(async (req, res) => {
  const { data, meta } = await enrollmentService.listAdmin(req.query);
  paginated(res, data, meta);
});

export const getEnrollment = asyncHandler(async (req, res) => {
  const item = await enrollmentService.getById(req.params.id);
  success(res, item);
});

export const updateEnrollment = asyncHandler(async (req, res) => {
  const body = validate(enrollmentUpdateSchema, req.body);
  const item = await enrollmentService.update(req.params.id, body, req.user, req.ip);
  success(res, item);
});

export const updateEnrollmentStatus = asyncHandler(async (req, res) => {
  const { status, note } = validate(enrollmentStatusSchema, req.body);
  const item = await enrollmentService.updateStatus(req.params.id, status, req.user, { note }, req.ip);
  success(res, item);
});

export const markEnrollmentCertificate = asyncHandler(async (req, res) => {
  const { issued } = validate(enrollmentCertificateSchema, req.body);
  const item = await enrollmentService.markCertificateIssued(req.params.id, issued !== false, req.user, req.ip);
  success(res, item);
});

export const deleteEnrollment = asyncHandler(async (req, res) => {
  const result = await enrollmentService.remove(req.params.id, req.user, req.ip);
  success(res, result);
});

export const exportEnrollmentsCsv = asyncHandler(async (req, res) => {
  const enrollments = await prisma.enrollment.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
    include: { course: { select: { title: true } } },
  });
  const header = "ID,Name,Email,Phone,Course,Status,Progress,Payment,Created\n";
  const rows = enrollments
    .map(
      (e) =>
        `${e.id},"${e.fullName}","${e.email}","${e.phone || ""}","${e.course?.title || ""}",${e.status},${e.progressPercentage},${e.paymentStatus},${e.createdAt.toISOString()}`
    )
    .join("\n");
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=students.csv");
  res.send(header + rows);
});
