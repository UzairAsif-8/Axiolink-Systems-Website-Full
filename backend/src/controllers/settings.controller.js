import prisma from "../config/database.js";
import { asyncHandler, success, ApiError } from "../utils/helpers.js";
import { z } from "zod";

export const getPublic = asyncHandler(async (_req, res) => {
  const settings = await prisma.siteSetting.findMany();
  const map = Object.fromEntries(settings.map((s) => [s.key, s.value]));
  success(res, map);
});

export const getAdmin = asyncHandler(async (_req, res) => {
  const settings = await prisma.siteSetting.findMany({ orderBy: { key: "asc" } });
  success(res, settings);
});

export const upsert = asyncHandler(async (req, res) => {
  const schema = z.object({ key: z.string().min(1), value: z.unknown() });
  const { key, value } = schema.parse(req.body);

  const item = await prisma.siteSetting.upsert({
    where: { key },
    create: { key, value },
    update: { value },
  });
  success(res, item);
});

export const bulkUpdate = asyncHandler(async (req, res) => {
  const schema = z.record(z.unknown());
  const updates = schema.parse(req.body);

  await prisma.$transaction(
    Object.entries(updates).map(([key, value]) =>
      prisma.siteSetting.upsert({
        where: { key },
        create: { key, value },
        update: { value },
      })
    )
  );

  success(res, { message: "Settings updated" });
});

export const remove = asyncHandler(async (req, res) => {
  const item = await prisma.siteSetting.findUnique({ where: { key: req.params.key } });
  if (!item) throw new ApiError(404, "Setting not found");
  await prisma.siteSetting.delete({ where: { key: req.params.key } });
  success(res, { message: "Setting removed" });
});
