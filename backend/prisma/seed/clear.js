/** Remove all application data from PostgreSQL in FK-safe order. Schema/migrations are preserved. */

export async function clearAllData(prisma) {
  console.log("  Clearing all database records...");

  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();

  await prisma.applicationStatusHistory.deleteMany();
  await prisma.applicationNote.deleteMany();
  await prisma.intern.deleteMany();

  // Break Application ↔ Certificate circular FK before deletes
  await prisma.application.updateMany({ data: { certificateId: null } });

  await prisma.certificate.deleteMany();
  await prisma.enrollmentStatusHistory.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.student.deleteMany();

  await prisma.eventRegistration.deleteMany();
  await prisma.event.deleteMany();
  await prisma.galleryImage.deleteMany();
  await prisma.galleryAlbum.deleteMany();

  await prisma.employeeDocument.deleteMany();
  await prisma.employee.deleteMany();

  await prisma.application.deleteMany();
  await prisma.job.deleteMany();
  await prisma.internship.deleteMany();

  await prisma.course.deleteMany();
  await prisma.instructor.deleteMany();

  await prisma.contactMessage.deleteMany();
  await prisma.newsletterSubscriber.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.testimonial.deleteMany();

  await prisma.passwordResetToken.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();

  await prisma.rolePermission.deleteMany();
  await prisma.permission.deleteMany();
  await prisma.siteSetting.deleteMany();

  console.log("  ✓ All tables cleared");
}

/** @deprecated use clearAllData */
export async function clearDemoData(prisma) {
  return clearAllData(prisma);
}
