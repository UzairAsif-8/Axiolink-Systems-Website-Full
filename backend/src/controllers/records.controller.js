import prisma from "../config/database.js";
import { asyncHandler, success } from "../utils/helpers.js";

export const getOverview = asyncHandler(async (_req, res) => {
  const [
    internships,
    publishedInternships,
    applications,
    completedApplications,
    interns,
    completedInterns,
    activeInterns,
    enrollments,
    completedEnrollments,
    activeEnrollments,
    courses,
    employees,
    activeEmployees,
    certificates,
    messages,
    blogs,
  ] = await prisma.$transaction([
    prisma.internship.count({ where: { deletedAt: null } }),
    prisma.internship.count({ where: { deletedAt: null, status: "PUBLISHED" } }),
    prisma.application.count({ where: { deletedAt: null } }),
    prisma.application.count({
      where: {
        deletedAt: null,
        status: { in: ["INTERNSHIP_COMPLETED", "CERTIFICATE_ISSUED"] },
      },
    }),
    prisma.intern.count({ where: { deletedAt: null } }),
    prisma.intern.count({ where: { deletedAt: null, status: "COMPLETED" } }),
    prisma.intern.count({ where: { deletedAt: null, status: "ACTIVE" } }),
    prisma.enrollment.count({ where: { deletedAt: null } }),
    prisma.enrollment.count({ where: { deletedAt: null, status: "COMPLETED" } }),
    prisma.enrollment.count({ where: { deletedAt: null, status: "ACTIVE" } }),
    prisma.course.count({ where: { deletedAt: null } }),
    prisma.employee.count({ where: { deletedAt: null } }),
    prisma.employee.count({ where: { deletedAt: null, status: "ACTIVE" } }),
    prisma.certificate.count({ where: { deletedAt: null } }),
    prisma.contactMessage.count({ where: { deletedAt: null } }),
    prisma.blogPost.count({ where: { deletedAt: null } }),
  ]);

  success(res, {
    totals: {
      internships,
      publishedInternships,
      applications,
      completedApplications,
      interns,
      completedInterns,
      activeInterns,
      enrollments,
      completedEnrollments,
      activeEnrollments,
      courses,
      employees,
      activeEmployees,
      certificates,
      messages,
      blogs,
    },
  });
});
