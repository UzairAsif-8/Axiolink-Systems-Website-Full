import { z } from "zod";

export const employeeSchema = z.object({
  employeeCode: z.string().min(2),
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  cnic: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  emergencyContact: z.string().optional().nullable(),
  emergencyPhone: z.string().optional().nullable(),
  jobTitle: z.string().optional().nullable(),
  designation: z.string().optional().nullable(),
  department: z.string().optional().nullable(),
  photoUrl: z.string().optional().nullable(),
  photoPublicId: z.string().optional().nullable(),
  status: z.enum(["ACTIVE", "INACTIVE", "ON_LEAVE", "TERMINATED"]).optional(),
  hireDate: z.union([z.string().datetime(), z.string().regex(/^\d{4}-\d{2}-\d{2}$/)]).optional().nullable(),
  trainingDate: z.union([z.string().datetime(), z.string().regex(/^\d{4}-\d{2}-\d{2}$/)]).optional().nullable(),
  probationEndDate: z.union([z.string().datetime(), z.string().regex(/^\d{4}-\d{2}-\d{2}$/)]).optional().nullable(),
  leavingDate: z.union([z.string().datetime(), z.string().regex(/^\d{4}-\d{2}-\d{2}$/)]).optional().nullable(),
  salary: z.number().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const employeeDocumentSchema = z.object({
  title: z.string().min(1),
  fileName: z.string().optional().nullable(),
  documentType: z.enum([
    "CONTRACT", "ID_PROOF", "RESUME", "CERTIFICATE", "OTHER",
    "OFFER_LETTER", "NDA", "INTERNSHIP_LETTER", "EXPERIENCE_LETTER",
  ]).optional(),
  fileUrl: z.string().url(),
  publicId: z.string().optional().nullable(),
  fileSize: z.number().int().optional(),
  mimeType: z.string().optional(),
});

export const studentSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  photoUrl: z.string().optional().nullable(),
});

export const instructorSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  bio: z.string().optional().nullable(),
  photoUrl: z.string().optional().nullable(),
  linkedin: z.string().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
});

export const internSchema = z.object({
  applicationId: z.string().uuid().optional().nullable(),
  internshipId: z.string().uuid(),
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  startDate: z.string().datetime().optional().nullable(),
  endDate: z.string().datetime().optional().nullable(),
  status: z.enum(["ACTIVE", "COMPLETED", "TERMINATED", "WITHDRAWN"]).optional(),
  notes: z.string().optional().nullable(),
});
