import prisma from "../config/database.js";
import { asyncHandler, success } from "../utils/helpers.js";
import { notifyAdmins } from "../services/audit.service.js";

export const getStats = asyncHandler(async (req, res) => {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalInternships,
    openInternships,
    openJobs,
    totalApplications,
    newApplications,
    totalCourses,
    totalEnrollments,
    totalCertificates,
    unreadMessages,
    totalBlogs,
    totalEvents,
    teamMembers,
    recentApplications,
    recentEnrollments,
    recentMessages,
    applicationsThisMonth,
    totalEmployees,
    activeInterns,
    activeStudents,
    recentAuditLogs,
  ] = await prisma.$transaction([
    prisma.internship.count({ where: { deletedAt: null } }),
    prisma.internship.count({ where: { deletedAt: null, status: "PUBLISHED", applicationsOpen: true } }),
    prisma.job.count({ where: { deletedAt: null, status: "PUBLISHED", applicationsOpen: true } }),
    prisma.application.count({ where: { deletedAt: null } }),
    prisma.application.count({ where: { deletedAt: null, status: "NEW" } }),
    prisma.course.count({ where: { deletedAt: null } }),
    prisma.enrollment.count({ where: { deletedAt: null } }),
    prisma.certificate.count({ where: { deletedAt: null, isValid: true } }),
    prisma.contactMessage.count({ where: { deletedAt: null, status: "NEW" } }),
    prisma.blogPost.count({ where: { deletedAt: null, status: "PUBLISHED" } }),
    prisma.event.count({ where: { deletedAt: null, status: "PUBLISHED" } }),
    prisma.teamMember.count({ where: { deletedAt: null, status: "PUBLISHED" } }),
    prisma.application.findMany({
      where: { deletedAt: null },
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { id: true, fullName: true, email: true, status: true, internshipTitle: true, createdAt: true },
    }),
    prisma.enrollment.findMany({
      where: { deletedAt: null },
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { course: { select: { title: true } } },
    }),
    prisma.contactMessage.findMany({
      where: { deletedAt: null },
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, subject: true, status: true, createdAt: true },
    }),
    prisma.application.count({
      where: { deletedAt: null, createdAt: { gte: monthStart } },
    }),
    prisma.employee.count({ where: { deletedAt: null, status: "ACTIVE" } }),
    prisma.intern.count({ where: { deletedAt: null, status: "ACTIVE" } }),
    prisma.enrollment.count({ where: { deletedAt: null, status: "ACTIVE" } }),
    prisma.auditLog.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      select: { id: true, action: true, entity: true, userEmail: true, createdAt: true },
    }),
  ]);

  success(res, {
    stats: {
      totalInternships,
      openInternships,
      openJobs,
      totalApplications,
      newApplications,
      totalCourses,
      totalEnrollments,
      totalCertificates,
      unreadMessages,
      totalBlogs,
      totalEvents,
      teamMembers,
      totalEmployees,
      activeInterns,
      activeStudents,
      applicationsThisMonth,
    },
    recentApplications,
    recentEnrollments,
    recentMessages,
    recentAuditLogs,
  });
});

export const globalSearch = asyncHandler(async (req, res) => {
  const q = req.query.q?.trim();
  if (!q || q.length < 2) {
    return success(res, {
      internships: [], jobs: [], applications: [], courses: [], messages: [], blogs: [],
      employees: [], certificates: [], enrollments: [],
    });
  }

  const [internships, jobs, applications, courses, messages, blogs, employees, certificates, enrollments] =
    await prisma.$transaction([
    prisma.internship.findMany({
      where: { deletedAt: null, title: { contains: q, mode: "insensitive" } },
      take: 5,
      select: { id: true, title: true, slug: true },
    }),
    prisma.job.findMany({
      where: { deletedAt: null, title: { contains: q, mode: "insensitive" } },
      take: 5,
      select: { id: true, title: true, slug: true },
    }),
    prisma.application.findMany({
      where: { deletedAt: null, OR: [{ fullName: { contains: q, mode: "insensitive" } }, { email: { contains: q, mode: "insensitive" } }] },
      take: 5,
      select: { id: true, fullName: true, email: true, status: true },
    }),
    prisma.course.findMany({
      where: { deletedAt: null, title: { contains: q, mode: "insensitive" } },
      take: 5,
      select: { id: true, title: true, slug: true },
    }),
    prisma.contactMessage.findMany({
      where: { deletedAt: null, OR: [{ name: { contains: q, mode: "insensitive" } }, { email: { contains: q, mode: "insensitive" } }] },
      take: 5,
      select: { id: true, name: true, email: true, subject: true },
    }),
    prisma.blogPost.findMany({
      where: { deletedAt: null, title: { contains: q, mode: "insensitive" } },
      take: 5,
      select: { id: true, title: true, slug: true },
    }),
    prisma.employee.findMany({
      where: {
        deletedAt: null,
        OR: [
          { fullName: { contains: q, mode: "insensitive" } },
          { email: { contains: q, mode: "insensitive" } },
          { employeeCode: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 5,
      select: { id: true, fullName: true, email: true, employeeCode: true, status: true },
    }),
    prisma.certificate.findMany({
      where: {
        deletedAt: null,
        OR: [
          { certificateCode: { contains: q, mode: "insensitive" } },
          { certificateNumber: { contains: q, mode: "insensitive" } },
          { studentName: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 5,
      select: { id: true, certificateCode: true, studentName: true, courseName: true },
    }),
    prisma.enrollment.findMany({
      where: {
        deletedAt: null,
        OR: [
          { fullName: { contains: q, mode: "insensitive" } },
          { email: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 5,
      select: { id: true, fullName: true, email: true, status: true },
    }),
  ]);

  success(res, { internships, jobs, applications, courses, messages, blogs, employees, certificates, enrollments });
});

export const getNotifications = asyncHandler(async (req, res) => {
  const userId = req.user?.isEnvSuperAdmin ? null : req.user?.id;
  const notifications = await prisma.notification.findMany({
    where: userId ? { OR: [{ userId }, { userId: null }] } : { userId: null },
    orderBy: { createdAt: "desc" },
    take: 30,
  });
  const unreadCount = await prisma.notification.count({
    where: userId
      ? { OR: [{ userId, isRead: false }, { userId: null, isRead: false }] }
      : { userId: null, isRead: false },
  });
  success(res, { notifications, unreadCount });
});

export const markNotificationRead = asyncHandler(async (req, res) => {
  await prisma.notification.update({
    where: { id: req.params.id },
    data: { isRead: true },
  });
  success(res, { message: "Marked as read" });
});

export const markAllNotificationsRead = asyncHandler(async (req, res) => {
  const userId = req.user?.isEnvSuperAdmin ? null : req.user?.id;
  await prisma.notification.updateMany({
    where: userId ? { OR: [{ userId }, { userId: null }] } : { userId: null },
    data: { isRead: true },
  });
  success(res, { message: "All notifications marked as read" });
});

export const deleteNotification = asyncHandler(async (req, res) => {
  await prisma.notification.delete({ where: { id: req.params.id } });
  success(res, { message: "Notification deleted" });
});
