import prisma from "../config/database.js";
import { asyncHandler, success, paginated, parsePagination, slugify, ApiError } from "../utils/helpers.js";
import { z } from "zod";

const teamSchema = z.object({
  name: z.string().min(2),
  role: z.string().min(2),
  department: z.string().optional(),
  bio: z.string().optional(),
  photoUrl: z.string().optional().nullable(),
  linkedin: z.string().optional().nullable(),
  github: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  displayOrder: z.number().int().optional(),
  featured: z.boolean().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
});

export const listPublic = asyncHandler(async (_req, res) => {
  const data = await prisma.teamMember.findMany({
    where: { deletedAt: null, status: "PUBLISHED" },
    orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
  });
  success(res, data);
});

export const listAdmin = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const where = { deletedAt: null };
  const [data, total] = await prisma.$transaction([
    prisma.teamMember.findMany({ where, skip, take: limit, orderBy: { displayOrder: "asc" } }),
    prisma.teamMember.count({ where }),
  ]);
  paginated(res, data, { page, limit, total, pages: Math.ceil(total / limit) });
});

export const create = asyncHandler(async (req, res) => {
  const body = teamSchema.parse(req.body);
  const item = await prisma.teamMember.create({ data: body });
  success(res, item, 201);
});

export const update = asyncHandler(async (req, res) => {
  const body = teamSchema.partial().parse(req.body);
  const item = await prisma.teamMember.update({ where: { id: req.params.id }, data: body });
  success(res, item);
});

export const remove = asyncHandler(async (req, res) => {
  await prisma.teamMember.update({
    where: { id: req.params.id },
    data: { deletedAt: new Date(), status: "ARCHIVED" },
  });
  success(res, { message: "Team member archived" });
});
