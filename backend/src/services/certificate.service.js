import prisma from "../config/database.js";
import { env } from "../config/env.js";
import { ApiError } from "../utils/helpers.js";

function generateCertificateCode() {
  const year = new Date().getFullYear();
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `AXL-${year}-${rand}`;
}

function generateCertificateNumber() {
  const ts = Date.now().toString(36).toUpperCase();
  return `CERT-${ts}`;
}

function buildVerificationUrl(code) {
  const base = env.clientUrl.replace(/\/$/, "");
  return `${base}/verify-certificate/${code}`;
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
    const certificateCode = (body.certificateCode || generateCertificateCode()).toUpperCase();
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
    const cert = await prisma.certificate.findFirst({
      where: {
        OR: [
          { certificateCode: code.toUpperCase() },
          { certificateNumber: code.toUpperCase() },
        ],
        deletedAt: null,
        isValid: true,
        revokedAt: null,
      },
    });

    if (!cert) {
      return {
        valid: false,
        message: "The certificate code entered does not match any record in our system.",
      };
    }

    return {
      valid: true,
      certificate: {
        certificateCode: cert.certificateCode,
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
