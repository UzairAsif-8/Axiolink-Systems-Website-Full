import prisma from "../config/database.js";
import { env } from "../config/env.js";
import { ApiError } from "../utils/helpers.js";
import {
  displayCertificateCode,
  formatCertificateCode,
  stripCertificateCode,
} from "../utils/certificateCode.js";

function generateCertificateCode() {
  const year = String(new Date().getFullYear());
  // 17 alphanumeric chars → XXXX-XX-XXXX-XXXX-XXX
  const rand = Math.random().toString(36).substring(2, 15).toUpperCase().padEnd(13, "0");
  return formatCertificateCode(`AX${year}${rand}`.slice(0, 17));
}

function generateCertificateNumber() {
  const ts = Date.now().toString(36).toUpperCase();
  return `CERT-${ts}`;
}

function buildVerificationUrl(code) {
  const base = env.clientUrl.replace(/\/$/, "");
  const formatted = formatCertificateCode(code) || code;
  return `${base}/verify-certificate/${formatted}`;
}

function codesMatch(stored, incoming) {
  const a = stripCertificateCode(stored);
  const b = stripCertificateCode(incoming);
  if (!a || !b) return false;
  return a === b;
}

export const certificateService = {
  generateCertificateCode,
  generateCertificateNumber,

  async createForApplication({ application, courseName, studentName }, user, tx) {
    const client = tx || prisma;
    const certificateCode = generateCertificateCode();
    const certificateNumber = generateCertificateNumber();
    const verificationUrl = buildVerificationUrl(certificateCode);

    return client.certificate.create({
      data: {
        certificateCode,
        certificateNumber,
        studentName,
        courseName,
        issueDate: new Date(),
        verificationUrl,
        qrCode: verificationUrl,
        templateVersion: "v1",
        issuedById: user?.isEnvSuperAdmin ? null : user?.id,
      },
    });
  },

  async createForEnrollment({ enrollment, courseName, studentName }, user, tx) {
    const client = tx || prisma;
    const certificateCode = generateCertificateCode();
    const certificateNumber = generateCertificateNumber();
    const verificationUrl = buildVerificationUrl(certificateCode);

    return client.certificate.create({
      data: {
        certificateCode,
        certificateNumber,
        studentName,
        courseName,
        studentId: enrollment.studentId,
        courseId: enrollment.courseId,
        enrollmentId: enrollment.id,
        issueDate: new Date(),
        verificationUrl,
        qrCode: verificationUrl,
        templateVersion: "v1",
        issuedById: user?.isEnvSuperAdmin ? null : user?.id,
      },
    });
  },

  async createManual(body, user) {
    const certificateCode =
      formatCertificateCode(body.certificateCode || generateCertificateCode()) ||
      generateCertificateCode();
    const certificateNumber = body.certificateNumber || generateCertificateNumber();
    const verificationUrl = body.verificationUrl || buildVerificationUrl(certificateCode);

    return prisma.certificate.create({
      data: {
        ...body,
        certificateCode,
        certificateNumber,
        issueDate: body.issueDate ? new Date(body.issueDate) : new Date(),
        expiryDate: body.expiryDate ? new Date(body.expiryDate) : null,
        verificationUrl,
        qrCode: body.qrCode || verificationUrl,
        templateVersion: body.templateVersion || "v1",
        issuedById: user?.isEnvSuperAdmin ? null : user?.id,
      },
    });
  },

  async verifyPublic(code) {
    const incoming = String(code || "").trim();
    if (!incoming) {
      return {
        valid: false,
        message: "Please enter a certificate code.",
      };
    }

    const formattedIncoming = formatCertificateCode(incoming);
    const rawIncoming = stripCertificateCode(incoming);

    // Exact match first (formatted or as entered), then fall back to dash-insensitive scan.
    let cert = await prisma.certificate.findFirst({
      where: {
        OR: [
          { certificateCode: formattedIncoming },
          { certificateCode: incoming.toUpperCase() },
          { certificateNumber: incoming.toUpperCase() },
          ...(formattedIncoming
            ? [{ certificateNumber: formattedIncoming }]
            : []),
        ],
        deletedAt: null,
        isValid: true,
        revokedAt: null,
      },
    });

    if (!cert && rawIncoming) {
      const candidates = await prisma.certificate.findMany({
        where: { deletedAt: null, isValid: true, revokedAt: null },
        take: 500,
      });
      cert =
        candidates.find(
          (c) =>
            codesMatch(c.certificateCode, incoming) ||
            codesMatch(c.certificateNumber, incoming)
        ) || null;
    }

    if (!cert) {
      return {
        valid: false,
        message: "The certificate code entered does not match any record in our system.",
      };
    }

    return {
      valid: true,
      certificate: {
        certificateCode: displayCertificateCode(cert.certificateCode),
        certificateNumber: cert.certificateNumber,
        studentName: cert.studentName,
        courseName: cert.courseName,
        issueDate: cert.issueDate,
        verificationUrl: cert.verificationUrl,
      },
    };
  },

  async revoke(id, reason, user, ip) {
    const existing = await prisma.certificate.findFirst({ where: { id, deletedAt: null } });
    if (!existing) throw new ApiError(404, "Certificate not found");

    return prisma.certificate.update({
      where: { id },
      data: {
        isValid: false,
        revokedAt: new Date(),
        revokedReason: reason,
      },
    });
  },
};
