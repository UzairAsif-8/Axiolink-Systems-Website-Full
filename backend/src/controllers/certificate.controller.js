import { asyncHandler, success, paginated, parsePagination } from "../utils/helpers.js";
import { validate, certificateSchema } from "../validators/schemas.js";
import { certificateService } from "../services/certificate.service.js";
import { audit } from "../services/audit.service.js";
import prisma from "../config/database.js";

export const verifyPublic = asyncHandler(async (req, res) => {
  const result = await certificateService.verifyPublic(req.params.code?.trim() || "");
  if (!result.valid) {
    return res.status(404).json(result);
  }
  res.json(result);
});

export const listAdmin = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const where = { deletedAt: null };
  const [data, total] = await prisma.$transaction([
    prisma.certificate.findMany({ where, skip, take: limit, orderBy: { issueDate: "desc" } }),
    prisma.certificate.count({ where }),
  ]);
  paginated(res, data, { page, limit, total, pages: Math.ceil(total / limit) });
});

export const create = asyncHandler(async (req, res) => {
  const body = validate(certificateSchema, req.body);
  const item = await certificateService.createManual(body, req.user);
  await audit({
    userId: req.user?.isEnvSuperAdmin ? null : req.user?.id,
    userEmail: req.user?.email,
    action: "CERTIFICATE_CREATED",
    entity: "Certificate",
    entityId: item.id,
    module: "certificates",
    ip: req.ip,
  });
  success(res, item, 201);
});

export const revoke = asyncHandler(async (req, res) => {
  const item = await certificateService.revoke(req.params.id, req.body.reason, req.user, req.ip);
  await audit({
    userId: req.user?.isEnvSuperAdmin ? null : req.user?.id,
    userEmail: req.user?.email,
    action: "CERTIFICATE_REVOKED",
    entity: "Certificate",
    entityId: item.id,
    module: "certificates",
    ip: req.ip,
  });
  success(res, item);
});

export const remove = asyncHandler(async (req, res) => {
  await prisma.certificate.update({
    where: { id: req.params.id },
    data: { deletedAt: new Date() },
  });
  success(res, { message: "Certificate removed" });
});

export const exportCsv = asyncHandler(async (req, res) => {
  const certs = await prisma.certificate.findMany({
    where: { deletedAt: null },
    orderBy: { issueDate: "desc" },
  });
  const header = "Code,Number,Student,Course,Issue Date,Valid\n";
  const rows = certs
    .map(
      (c) =>
        `${c.certificateCode},${c.certificateNumber || ""},"${c.studentName}","${c.courseName}",${c.issueDate.toISOString()},${c.isValid}`
    )
    .join("\n");
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=certificates.csv");
  res.send(header + rows);
});
