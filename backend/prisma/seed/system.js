import { daysAgo } from "./helpers.js";

const ACTIVITY_ENTRIES = [
  { action: "APPLICATION_SUBMITTED", entity: "Application", message: "Ahmed Khan applied for Frontend Development Internship", days: 1 },
  { action: "ENROLLMENT_CREATED", entity: "Enrollment", message: "Fatima Ali enrolled in AI Foundations", days: 2 },
  { action: "CERTIFICATE_ISSUED", entity: "Certificate", message: "Certificate BP-2026-1042 issued", days: 3 },
  { action: "EMPLOYEE_CREATED", entity: "Employee", message: "New employee joined Backend Team", days: 4 },
  { action: "INTERNSHIP_PUBLISHED", entity: "Internship", message: "Cybersecurity Internship published", days: 5 },
  { action: "MESSAGE_RECEIVED", entity: "ContactMessage", message: "Contact form submitted — Partnership opportunity", days: 1 },
  { action: "APPLICATION_SHORTLISTED", entity: "Application", message: "Usman Ali shortlisted for Backend Development Internship", days: 6 },
  { action: "ENROLLMENT_CREATED", entity: "Enrollment", message: "Hassan Raza enrolled in Web Development Bootcamp", days: 7 },
  { action: "CERTIFICATE_ISSUED", entity: "Certificate", message: "Certificate BP-2026-1018 issued", days: 8 },
  { action: "BLOG_PUBLISHED", entity: "BlogPost", message: "Blog published: Introducing Buland Parwaz", days: 9 },
  { action: "INTERN_STARTED", entity: "Intern", message: "Sana Malik started UI/UX Design Internship", days: 10 },
  { action: "APPLICATION_INTERVIEW", entity: "Application", message: "Interview scheduled for AI Engineering applicant", days: 2 },
  { action: "NEWSLETTER_SUBSCRIBE", entity: "Newsletter", message: "New newsletter subscriber joined", days: 3 },
  { action: "EMPLOYEE_UPDATED", entity: "Employee", message: "Employee profile updated", days: 11 },
  { action: "MESSAGE_REPLIED", entity: "ContactMessage", message: "Reply sent to Buland Parwaz enrollment inquiry", days: 4 },
];

const NOTIFICATION_TEMPLATES = [
  { type: "application", title: "New Internship Application", message: "Ahmed Khan applied for Frontend Development Internship", link: "/admin/applications", unread: true },
  { type: "enrollment", title: "New Student Enrollment", message: "Fatima Ali enrolled in AI Foundations", link: "/admin/students", unread: true },
  { type: "employee", title: "Employee Added", message: "New employee joined Backend Team", link: "/admin/employees", unread: true },
  { type: "certificate", title: "Certificate Issued", message: "Certificate BP-2026-1042 issued to Hassan Raza", link: "/admin/certificates", unread: false },
  { type: "message", title: "Contact Message Received", message: "New inquiry: Partnership opportunity", link: "/admin/messages", unread: true },
  { type: "application", title: "Application Shortlisted", message: "Usman Ali shortlisted for Backend Internship", link: "/admin/applications", unread: false },
  { type: "internship", title: "Internship Published", message: "Cybersecurity Internship is now live", link: "/admin/internships", unread: false },
  { type: "enrollment", title: "Course Enrollment", message: "12 new enrollments this week across Buland Parwaz courses", link: "/admin/students", unread: true },
  { type: "application", title: "Interview Scheduled", message: "Interview scheduled for AI Engineering applicant", link: "/admin/applications", unread: true },
  { type: "certificate", title: "Certificate Issued", message: "Certificate BP-2026-1018 issued", link: "/admin/certificates", unread: false },
  { type: "message", title: "Unread Messages", message: "You have new unread contact messages", link: "/admin/messages", unread: true },
  { type: "blog", title: "Blog Post Published", message: "New blog: Remote-First Culture at Axiolink Systems (Pvt) Ltd.", link: "/admin/blogs", unread: false },
];

export async function seedSystem(prisma, recruitment, education) {
  console.log("\n🔔 Notifications & activity timeline");

  for (let i = 0; i < NOTIFICATION_TEMPLATES.length; i++) {
    const row = NOTIFICATION_TEMPLATES[i];
    await prisma.notification.create({
      data: {
        userId: null,
        type: row.type,
        title: row.title,
        message: row.message,
        link: row.link,
        isRead: !row.unread,
        createdAt: daysAgo(i + 1),
      },
    });
  }

  for (let i = 0; i < 8; i++) {
    await prisma.notification.create({
      data: {
        userId: null,
        type: "application",
        title: "New Internship Application",
        message: `${recruitment.applications[i]?.fullName || "Applicant"} applied for ${recruitment.applications[i]?.internshipTitle || "an internship"}`,
        link: `/admin/applications/${recruitment.applications[i]?.id || ""}`,
        isRead: i > 4,
        createdAt: daysAgo(i),
      },
    });
  }
  console.log("  ✓ 20 notifications");

  for (let i = 0; i < ACTIVITY_ENTRIES.length; i++) {
    const row = ACTIVITY_ENTRIES[i];
    await prisma.auditLog.create({
      data: {
        userId: null,
        userEmail: "admin@axiolinksystems.com",
        action: row.action,
        entity: row.entity,
        metadata: { message: row.message },
        ip: "127.0.0.1",
        createdAt: daysAgo(row.days),
      },
    });
  }
  console.log(`  ✓ ${ACTIVITY_ENTRIES.length} audit log entries (activity timeline)`);

  await prisma.siteSetting.upsert({
    where: { key: "demo_seed" },
    update: {
      value: {
        version: 2,
        seededAt: new Date().toISOString(),
        counts: {
          employees: 20,
          internships: recruitment.internships.length,
          applications: recruitment.applications.length,
          interns: recruitment.interns.length,
          courses: education.courses.length,
          students: education.students.length,
          enrollments: education.enrollmentRecords.length,
          certificates: education.certificates.length,
          blogs: 10,
          messages: 40,
          newsletter: 150,
        },
      },
    },
    create: {
      key: "demo_seed",
      value: {
        version: 2,
        seededAt: new Date().toISOString(),
      },
    },
  });
}
