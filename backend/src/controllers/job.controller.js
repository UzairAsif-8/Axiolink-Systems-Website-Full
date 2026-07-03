import prisma from "../config/database.js";
import { asyncHandler, success, paginated, parsePagination, slugify, ApiError } from "../utils/helpers.js";
import { z } from "zod";
import { audit } from "../services/audit.service.js";

const jobSchema = z.object({
  title: z.string().min(3),
  slug: z.string().optional(),
  department: z.string().min(1),
  description: z.string().min(10),
  responsibilities: z.array(z.string()).optional(),
  requirements: z.array(z.string()).optional(),
  benefits: z.array(z.string()).optional(),
  location: z.string().optional().nullable(),
  type: z.string().optional(),
  workMode: z.enum(["REMOTE", "HYBRID", "ONSITE"]).optional(),
  salaryRange: z.string().optional().nullable(),
  deadline: z.string().datetime().optional().nullable(),
  positions: z.number().int().positive().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  featured: z.boolean().optional(),
  applicationsOpen: z.boolean().optional(),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
});

const WORK_MODE_LABELS = { REMOTE: "Remote", HYBRID: "Hybrid", ONSITE: "Onsite" };

const formatDeadline = (date) => {
  if (!date) return "Rolling basis";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const mapJob = (j) => ({
  ...j,
  workMode: WORK_MODE_LABELS[j.workMode] || j.workMode?.toLowerCase(),
  status: j.status?.toLowerCase(),
  jobType: j.type || "Full-time",
  location: j.location || WORK_MODE_LABELS[j.workMode] || "Hybrid",
  applicationDeadline: formatDeadline(j.deadline),
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
  const data = await prisma.job.findMany({
    where,
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });
  success(res, data.map(mapJob));
});

export const getBySlugPublic = asyncHandler(async (req, res) => {
  const item = await prisma.job.findFirst({
    where: { slug: req.params.slug, deletedAt: null, status: "PUBLISHED" },
  });
  if (!item) throw new ApiError(404, "Job not found");
  success(res, mapJob(item));
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
    prisma.job.findMany({ where, skip, take: limit, orderBy: { updatedAt: "desc" } }),
    prisma.job.count({ where }),
  ]);
  paginated(res, data, { page, limit, total, pages: Math.ceil(total / limit) });
});

export const getById = asyncHandler(async (req, res) => {
  const item = await prisma.job.findFirst({
    where: { id: req.params.id, deletedAt: null },
  });
  if (!item) throw new ApiError(404, "Job not found");
  success(res, item);
});

export const create = asyncHandler(async (req, res) => {
  const body = jobSchema.parse(req.body);
  const slug = body.slug || slugify(body.title);
  const item = await prisma.job.create({
    data: { ...body, slug, deadline: body.deadline ? new Date(body.deadline) : null },
  });
  await audit({ userId: req.user.id, action: "CREATE", entity: "Job", entityId: item.id, ip: req.ip });
  success(res, item, 201);
});

export const update = asyncHandler(async (req, res) => {
  const body = jobSchema.partial().parse(req.body);
  const item = await prisma.job.update({
    where: { id: req.params.id },
    data: {
      ...body,
      ...(body.deadline !== undefined && { deadline: body.deadline ? new Date(body.deadline) : null }),
    },
  });
  await audit({ userId: req.user.id, action: "UPDATE", entity: "Job", entityId: item.id, ip: req.ip });
  success(res, item);
});

export const remove = asyncHandler(async (req, res) => {
  await prisma.job.update({
    where: { id: req.params.id },
    data: { deletedAt: new Date(), status: "ARCHIVED" },
  });
  await audit({ userId: req.user.id, action: "DELETE", entity: "Job", entityId: req.params.id, ip: req.ip });
  success(res, { message: "Job archived" });
});
