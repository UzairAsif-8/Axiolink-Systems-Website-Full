/**
 * Removes all data except Internships and Blog posts (plus site settings & RBAC refs).
 *
 * Usage: npm run db:purge-keep-internships-blogs
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function purgeKeepInternshipsAndBlogs() {
  console.log("\n🧹 Purging database (keeping internships + blogs only)...\n");

  const counts = {};

  const del = async (label, fn) => {
    const result = await fn();
    counts[label] = result.count;
    if (result.count > 0) console.log(`  ✓ ${label}: ${result.count}`);
  };

  await del("auditLog", () => prisma.auditLog.deleteMany());
  await del("notification", () => prisma.notification.deleteMany());

  await del("applicationStatusHistory", () => prisma.applicationStatusHistory.deleteMany());
  await del("applicationNote", () => prisma.applicationNote.deleteMany());
  await del("intern", () => prisma.intern.deleteMany());

  await prisma.application.updateMany({ data: { certificateId: null } });

  await del("certificate", () => prisma.certificate.deleteMany());
  await del("enrollmentStatusHistory", () => prisma.enrollmentStatusHistory.deleteMany());
  await del("enrollment", () => prisma.enrollment.deleteMany());
  await del("student", () => prisma.student.deleteMany());

  await del("eventRegistration", () => prisma.eventRegistration.deleteMany());
  await del("event", () => prisma.event.deleteMany());
  await del("galleryImage", () => prisma.galleryImage.deleteMany());
  await del("galleryAlbum", () => prisma.galleryAlbum.deleteMany());

  await del("employeeDocument", () => prisma.employeeDocument.deleteMany());
  await del("employee", () => prisma.employee.deleteMany());

  await del("application", () => prisma.application.deleteMany());
  await del("job", () => prisma.job.deleteMany());

  await del("course", () => prisma.course.deleteMany());
  await del("instructor", () => prisma.instructor.deleteMany());

  await del("contactMessage", () => prisma.contactMessage.deleteMany());
  await del("newsletterSubscriber", () => prisma.newsletterSubscriber.deleteMany());
  await del("teamMember", () => prisma.teamMember.deleteMany());
  await del("testimonial", () => prisma.testimonial.deleteMany());

  await del("passwordResetToken", () => prisma.passwordResetToken.deleteMany());
  await del("refreshToken", () => prisma.refreshToken.deleteMany());
  await del("user", () => prisma.user.deleteMany());

  const kept = {
    internships: await prisma.internship.count({ where: { deletedAt: null } }),
    blogs: await prisma.blogPost.count({ where: { deletedAt: null } }),
    settings: await prisma.siteSetting.count(),
  };

  console.log("\n✅ Purge complete.");
  console.log(`   Kept — internships: ${kept.internships}, blogs: ${kept.blogs}, settings: ${kept.settings}\n`);

  return { counts, kept };
}

purgeKeepInternshipsAndBlogs()
  .catch((e) => {
    console.error("Purge failed:", e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
