import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(6),
  rememberMe: z.boolean().optional(),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
});

export const internshipSchema = z.object({
  title: z.string().min(3),
  slug: z.string().optional(),
  department: z.string().min(1),
  description: z.string().min(10),
  responsibilities: z.array(z.string()).optional(),
  requirements: z.array(z.string()).optional(),
  benefits: z.array(z.string()).optional(),
  duration: z.string().optional(),
  location: z.string().optional().nullable(),
  workingHours: z.string().optional().nullable(),
  joiningDate: z.string().optional().nullable(),
  type: z.string().optional(),
  workMode: z.enum(["REMOTE", "HYBRID", "ONSITE"]).optional(),
  paid: z.boolean().optional(),
  stipend: z.string().optional().nullable(),
  deadline: z.string().datetime().optional().nullable(),
  positions: z.number().int().positive().optional(),
  technologies: z.array(z.string()).optional(),
  skillLevel: z.string().optional(),
  whatYouLearn: z.array(z.string()).optional(),
  whoCanApply: z.array(z.string()).optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  featured: z.boolean().optional(),
  applicationsOpen: z.boolean().optional(),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
});

const dateInput = z.union([
  z.string().datetime(),
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
]);

export const applicationStatusSchema = z.object({
  status: z.enum([
    "NEW",
    "UNDER_REVIEW",
    "SHORTLISTED",
    "INTERVIEW_SCHEDULED",
    "SELECTED",
    "INTERNSHIP_STARTED",
    "INTERNSHIP_COMPLETED",
    "CERTIFICATE_ISSUED",
    "WITHDRAWN",
    "REJECTED",
  ]),
  note: z.string().optional(),
  internshipStartDate: dateInput.optional().nullable(),
  internshipEndDate: dateInput.optional().nullable(),
});

export const certificateIssuedSchema = z.object({
  issued: z.boolean().optional(),
});

export const noteSchema = z.object({
  content: z.string().min(1),
});

export const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10),
});

export const enrollmentStatusSchema = z.object({
  status: z.enum(["NEW", "ACTIVE", "COMPLETED", "WITHDRAWN"]),
  note: z.string().optional(),
});

export const enrollmentUpdateSchema = z.object({
  progress: z.number().min(0).max(100).optional(),
  attendance: z.number().min(0).max(100).optional(),
  paymentStatus: z.enum(["PENDING", "PARTIAL", "PAID", "REFUNDED", "WAIVED"]).optional(),
});

export const enrollmentCertificateSchema = z.object({
  issued: z.boolean().optional(),
});

export const enrollmentSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  courseId: z.string().optional(),
  courseSlug: z.string().optional(),
  course_id: z.string().optional(),
  course_title: z.string().optional(),
});

const optionalNumeric = z.preprocess((val) => {
  if (val === "" || val === null || val === undefined) return null;
  if (typeof val === "number" && Number.isNaN(val)) return null;
  const n = Number(val);
  return Number.isFinite(n) ? n : null;
}, z.number().optional().nullable());

const courseModuleSchema = z.object({
  title: z.string().min(1),
  topics: z.array(z.string()).optional().default([]),
  weeks: z.number().optional(),
});

const curriculumSchema = z
  .union([
    z.null(),
    z.array(courseModuleSchema),
    z.object({
      format: z.string().optional(),
      schedule: z.string().optional(),
      modules: z.array(courseModuleSchema).optional().default([]),
    }),
  ])
  .optional()
  .nullable();

export const courseSchema = z.object({
  title: z.string().min(3),
  slug: z.string().optional(),
  description: z.string().min(10),
  category: z.string().optional(),
  instructorId: z.string().uuid().optional().nullable(),
  duration: z.string().optional(),
  level: z.string().optional(),
  price: optionalNumeric,
  discount: optionalNumeric,
  learningOutcomes: z.array(z.string()).optional(),
  requirements: z.array(z.string()).optional(),
  curriculum: curriculumSchema,
  certificateAvailable: z.boolean().optional(),
  enrollmentOpen: z.boolean().optional(),
  isCompleted: z.boolean().optional(),
  completedAt: z.string().datetime().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  thumbnailUrl: z.union([z.string().url(), z.literal(""), z.null()]).optional(),
  thumbnailPublicId: z.string().optional().nullable(),
  bannerUrl: z.union([z.string().url(), z.literal(""), z.null()]).optional(),
  bannerPublicId: z.string().optional().nullable(),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
});

export const certificateSchema = z.object({
  certificateCode: z.string().min(3),
  studentName: z.string().min(2),
  courseName: z.string().min(2),
  courseId: z.string().uuid().optional().nullable(),
  enrollmentId: z.string().uuid().optional().nullable(),
  studentId: z.string().uuid().optional().nullable(),
  issueDate: z.string().datetime().optional(),
  isValid: z.boolean().optional(),
});


export { validate } from "../utils/validate.js";
