import prisma from "../config/database.js";
import { asyncHandler, success, paginated, parsePagination, ApiError } from "../utils/helpers.js";
import { validate, contactSchema } from "../validators/schemas.js";
import { notifyAdmins } from "../services/audit.service.js";

export const submitPublic = asyncHandler(async (req, res) => {
  const body = validate(contactSchema, req.body);
  const message = await prisma.contactMessage.create({ data: body });

  await notifyAdmins({
    type: "message",
    title: "New contact message",
    message: `${body.name}: ${body.subject || "General inquiry"}`,
    link: `/admin/messages/${message.id}`,
  });

  success(res, { id: message.id, message: "Message sent" }, 201);
});

export const listAdmin = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const { status, search } = req.query;

  const where = {
    deletedAt: null,
    ...(status && { status: status.toUpperCase() }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { subject: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  const [data, total] = await prisma.$transaction([
    prisma.contactMessage.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" } }),
    prisma.contactMessage.count({ where }),
  ]);

  paginated(res, data, { page, limit, total, pages: Math.ceil(total / limit) });
});

export const getById = asyncHandler(async (req, res) => {
  const item = await prisma.contactMessage.findFirst({
    where: { id: req.params.id, deletedAt: null },
  });
  if (!item) throw new ApiError(404, "Message not found");

  if (item.status === "NEW") {
    await prisma.contactMessage.update({
      where: { id: item.id },
      data: { status: "READ" },
    });
  }

  success(res, item);
});

export const updateStatus = asyncHandler(async (req, res) => {
  const { status, reply } = req.body;
  const item = await prisma.contactMessage.update({
    where: { id: req.params.id },
    data: { status, reply },
  });
  success(res, item);
});

export const remove = asyncHandler(async (req, res) => {
  await prisma.contactMessage.update({
    where: { id: req.params.id },
    data: { deletedAt: new Date(), status: "ARCHIVED" },
  });
  success(res, { message: "Message archived" });
});
