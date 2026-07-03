import prisma from "../config/database.js";
import { asyncHandler, success, paginated, parsePagination, slugify, ApiError } from "../utils/helpers.js";
import { validate, internshipSchema } from "../validators/schemas.js";
import { audit } from "../services/audit.service.js";

const WORK_MODE_LABELS = { REMOTE: "Remote", HYBRID: "Hybrid", ONSITE: "Onsite" };

const formatDeadline = (date) => {
  if (!date) return "Rolling basis";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const mapInternship = (i) => ({
  ...i,
  workMode: WORK_MODE_LABELS[i.workMode] || i.workMode?.toLowerCase(),
  status: i.status?.toLowerCase(),
  internshipType: i.type || "Internship",
  location: i.location || WORK_MODE_LABELS[i.workMode] || "Remote / Hybrid",
  workingHours: i.workingHours || "Flexible (20–40 hrs/week)",
  joiningDate: i.joiningDate || "Rolling basis",
  applicationDeadline: formatDeadline(i.deadline),
});

export const listPublic = asyncHandler(async (req, res) => {
  const { department, featured } = req.query;
  const where = {
    deletedAt: null,
    status: "PUBLISHED",
    applicationsOpen: true,
    ...(department && { department }),
    ...(featured === "true" && { featured: true }),
  };

  const data = await prisma.internship.findMany({
    where,
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  success(res, data.map(mapInternship));
});

export const getBySlugPublic = asyncHandler(async (req, res) => {
  const item = await prisma.internship.findFirst({
    where: { slug: req.params.slug, deletedAt: null, status: "PUBLISHED" },
  });
  if (!item) throw new ApiError(404, "Internship not found");
  success(res, mapInternship(item));
});

export const listAdmin = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const { status, search, department } = req.query;

  const where = {
    deletedAt: null,
    ...(status && { status: status.toUpperCase() }),
    ...(department && { department }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  const [data, total] = await prisma.$transaction([
    prisma.internship.findMany({ where, skip, take: limit, orderBy: { updatedAt: "desc" } }),
    prisma.internship.count({ where }),
  ]);

  paginated(res, data, { page, limit, total, pages: Math.ceil(total / limit) });
});

export const getById = asyncHandler(async (req, res) => {
  const item = await prisma.internship.findFirst({
    where: { id: req.params.id, deletedAt: null },
  });
  if (!item) throw new ApiError(404, "Internship not found");
  success(res, item);
});

export const create = asyncHandler(async (req, res) => {
  const body = validate(internshipSchema, req.body);
  const slug = body.slug || slugify(body.title);

  const item = await prisma.internship.create({
    data: { ...body, slug, deadline: body.deadline ? new Date(body.deadline) : null },
  });

  await audit({ userId: req.user.id, action: "CREATE", entity: "Internship", entityId: item.id, ip: req.ip });
  success(res, item, 201);
});

export const update = asyncHandler(async (req, res) => {
  const body = validate(internshipSchema.partial(), req.body);
  const item = await prisma.internship.update({
    where: { id: req.params.id },
    data: {
      ...body,
      ...(body.deadline !== undefined && { deadline: body.deadline ? new Date(body.deadline) : null }),
    },
  });
  await audit({ userId: req.user.id, action: "UPDATE", entity: "Internship", entityId: item.id, ip: req.ip });
  success(res, item);
});

export const remove = asyncHandler(async (req, res) => {
  await prisma.internship.update({
    where: { id: req.params.id },
    data: { deletedAt: new Date(), status: "ARCHIVED" },
  });
  await audit({ userId: req.user.id, action: "DELETE", entity: "Internship", entityId: req.params.id, ip: req.ip });
  success(res, { message: "Internship archived" });
});

export const duplicate = asyncHandler(async (req, res) => {
  const original = await prisma.internship.findFirst({ where: { id: req.params.id, deletedAt: null } });
  if (!original) throw new ApiError(404, "Internship not found");

  const { id, createdAt, updatedAt, deletedAt, slug, ...rest } = original;
  const newSlug = `${slug}-copy-${Date.now()}`;

  const item = await prisma.internship.create({
    data: { ...rest, slug: newSlug, title: `${rest.title} (Copy)`, status: "DRAFT" },
  });

  success(res, item, 201);
});
