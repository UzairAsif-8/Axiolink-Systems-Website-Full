import prisma from "../config/database.js";
import { asyncHandler, success, paginated, parsePagination, ApiError } from "../utils/helpers.js";
import { z } from "zod";

const subscribeSchema = z.object({ email: z.string().email() });

export const subscribePublic = asyncHandler(async (req, res) => {
  const { email } = subscribeSchema.parse(req.body);
  const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });

  if (existing && !existing.deletedAt) {
    return success(res, { message: "Already subscribed" });
  }

  if (existing?.deletedAt) {
    await prisma.newsletterSubscriber.update({
      where: { email },
      data: { deletedAt: null, isActive: true, subscribedAt: new Date() },
    });
  } else {
    await prisma.newsletterSubscriber.create({ data: { email } });
  }

  success(res, { message: "Subscribed successfully" }, 201);
});

export const listAdmin = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const where = { deletedAt: null, isActive: true };
  const [data, total] = await prisma.$transaction([
    prisma.newsletterSubscriber.findMany({ where, skip, take: limit, orderBy: { subscribedAt: "desc" } }),
    prisma.newsletterSubscriber.count({ where }),
  ]);
  paginated(res, data, { page, limit, total, pages: Math.ceil(total / limit) });
});

export const remove = asyncHandler(async (req, res) => {
  await prisma.newsletterSubscriber.update({
    where: { id: req.params.id },
    data: { deletedAt: new Date(), isActive: false },
  });
  success(res, { message: "Subscriber removed" });
});

export const exportCsv = asyncHandler(async (_req, res) => {
  const subs = await prisma.newsletterSubscriber.findMany({
    where: { deletedAt: null, isActive: true },
    orderBy: { subscribedAt: "desc" },
  });
  const csv = ["email,subscribedAt", ...subs.map((s) => `${s.email},${s.subscribedAt.toISOString()}`)].join("\n");
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=newsletter-subscribers.csv");
  res.send(csv);
});
