import {
  Briefcase,
  FileText,
  UserCheck,
  GraduationCap,
  BookOpen,
  Users,
  Award,
  Mail,
  Newspaper,
  LayoutGrid,
} from "lucide-react";

const fmtDate = (v) => {
  if (!v) return "—";
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString(undefined, { dateStyle: "medium" });
};

/** Sidebar + routing ids for each registry */
export const RECORD_NAV = [
  { id: "overview", label: "Overview", icon: LayoutGrid, end: true },
  { id: "internships", label: "Internships", icon: Briefcase },
  { id: "applications", label: "Applications", icon: FileText },
  { id: "interns", label: "Interns", icon: UserCheck },
  { id: "enrollments", label: "Students", icon: GraduationCap },
  { id: "courses", label: "Courses", icon: BookOpen },
  { id: "employees", label: "Employees", icon: Users },
  { id: "certificates", label: "Certificates", icon: Award },
  { id: "messages", label: "Messages", icon: Mail },
  { id: "blogs", label: "Blogs", icon: Newspaper },
];

/** Full config per record type — drives fetch, filters, columns, and manage links */
export const RECORD_TYPES = {
  internships: {
    label: "Internships",
    description: "Every internship listing in the system.",
    endpoint: "/admin/internships",
    limit: 500,
    searchPlaceholder: "Search by title or department…",
    managePath: "/admin/internships",
    countKey: "internships",
    statusOptions: [
      { value: "", label: "All statuses" },
      { value: "PUBLISHED", label: "Published" },
      { value: "DRAFT", label: "Draft" },
      { value: "ARCHIVED", label: "Archived" },
    ],
    statusParam: "status",
    columns: [
      { key: "title", label: "Title", render: (r) => r.title },
      { key: "department", label: "Department", render: (r) => r.department || "—" },
      { key: "status", label: "Status", badge: true, render: (r) => r.status },
      { key: "positions", label: "Open", render: (r) => r.openPositions ?? "—" },
      { key: "workMode", label: "Work mode", render: (r) => r.workMode || "—" },
      { key: "createdAt", label: "Created", render: (r) => fmtDate(r.createdAt) },
    ],
    detailPath: (r) => `/admin/internships/${r.id}/edit`,
  },

  applications: {
    label: "Applications",
    description: "All internship applicants and their pipeline status.",
    endpoint: "/admin/applications",
    limit: 500,
    searchPlaceholder: "Search by name or email…",
    managePath: "/admin/applications",
    countKey: "applications",
    statusOptions: [
      { value: "", label: "All statuses" },
      { value: "NEW", label: "New" },
      { value: "UNDER_REVIEW", label: "In review" },
      { value: "SHORTLISTED", label: "Shortlisted" },
      { value: "SELECTED", label: "Selected" },
      { value: "INTERNSHIP_COMPLETED", label: "Internship completed" },
      { value: "CERTIFICATE_ISSUED", label: "Certificate issued" },
      { value: "REJECTED", label: "Rejected" },
    ],
    statusParam: "status",
    columns: [
      { key: "name", label: "Applicant", render: (r) => r.fullName || r.name },
      { key: "email", label: "Email", render: (r) => r.email },
      { key: "internship", label: "Internship", render: (r) => r.internship?.title || r.internshipTitle || "—" },
      { key: "status", label: "Status", badge: true, render: (r) => r.status },
      { key: "start", label: "Start", render: (r) => fmtDate(r.internshipStartedAt || r.intern?.startDate) },
      { key: "end", label: "End", render: (r) => fmtDate(r.intern?.endDate) },
      { key: "applied", label: "Applied", render: (r) => fmtDate(r.createdAt) },
    ],
    detailPath: (r) => `/admin/applications/${r.id}`,
  },

  interns: {
    label: "Interns",
    description: "People on active or completed internships — synced from approved applications.",
    endpoint: "/admin/interns",
    limit: 500,
    searchPlaceholder: "Search by name or email…",
    managePath: "/admin/applications",
    countKey: "interns",
    highlightCompleted: true,
    statusOptions: [
      { value: "", label: "All statuses" },
      { value: "ACTIVE", label: "Active" },
      { value: "COMPLETED", label: "Completed" },
      { value: "TERMINATED", label: "Terminated" },
      { value: "WITHDRAWN", label: "Withdrawn" },
    ],
    statusParam: "status",
    columns: [
      { key: "name", label: "Intern", render: (r) => r.fullName },
      { key: "email", label: "Email", render: (r) => r.email },
      { key: "internship", label: "Internship", render: (r) => r.internship?.title || "—" },
      { key: "status", label: "Status", badge: true, render: (r) => r.status },
      { key: "start", label: "Start", render: (r) => fmtDate(r.startDate) },
      { key: "end", label: "End", render: (r) => fmtDate(r.endDate) },
      { key: "completed", label: "Completed at", render: (r) => fmtDate(r.application?.internshipCompletedAt) },
    ],
    detailPath: (r) => (r.application?.id ? `/admin/applications/${r.application.id}` : null),
  },

  enrollments: {
    label: "Students",
    description: "Course enrollments — active learners and graduates.",
    endpoint: "/admin/courses/enrollments/list",
    limit: 500,
    searchPlaceholder: "Search by student name or email…",
    managePath: "/admin/students",
    countKey: "enrollments",
    statusOptions: [
      { value: "", label: "All statuses" },
      { value: "NEW", label: "New" },
      { value: "ACTIVE", label: "Active" },
      { value: "COMPLETED", label: "Completed" },
      { value: "WITHDRAWN", label: "Withdrawn" },
    ],
    statusParam: "status",
    columns: [
      { key: "student", label: "Student", render: (r) => r.fullName },
      { key: "email", label: "Email", render: (r) => r.email },
      { key: "course", label: "Course", render: (r) => r.course?.title || "—" },
      { key: "status", label: "Status", badge: true, render: (r) => r.status },
      { key: "enrolled", label: "Enrolled", render: (r) => fmtDate(r.enrollmentDate || r.createdAt) },
      { key: "completed", label: "Completed", render: (r) => fmtDate(r.completedAt) },
    ],
    detailPath: (r) =>
      r.courseId && r.id ? `/admin/courses/${r.courseId}/students/${r.id}` : `/admin/students/${r.id}`,
  },

  courses: {
    label: "Courses",
    description: "All Buland Parwaz and training courses.",
    endpoint: "/admin/courses",
    limit: 500,
    searchPlaceholder: "Search by title…",
    managePath: "/admin/courses",
    countKey: "courses",
    columns: [
      { key: "title", label: "Title", render: (r) => r.title },
      { key: "status", label: "Status", badge: true, render: (r) => r.status },
      { key: "duration", label: "Duration", render: (r) => r.duration || "—" },
      { key: "fee", label: "Fee", render: (r) => (r.fee != null ? `PKR ${Number(r.fee).toLocaleString()}` : "—") },
      { key: "created", label: "Created", render: (r) => fmtDate(r.createdAt) },
    ],
    detailPath: (r) => `/admin/courses/${r.id}`,
  },

  employees: {
    label: "Employees",
    description: "Staff directory — active and former team members.",
    endpoint: "/admin/employees",
    limit: 500,
    searchPlaceholder: "Search by name, email, or code…",
    managePath: "/admin/employees",
    countKey: "employees",
    statusOptions: [
      { value: "", label: "All statuses" },
      { value: "ACTIVE", label: "Active" },
      { value: "INACTIVE", label: "Inactive" },
      { value: "ON_LEAVE", label: "On leave" },
      { value: "TERMINATED", label: "Terminated" },
    ],
    statusParam: "status",
    columns: [
      { key: "name", label: "Name", render: (r) => r.fullName },
      { key: "code", label: "Code", render: (r) => r.employeeCode || "—" },
      { key: "email", label: "Email", render: (r) => r.email },
      { key: "department", label: "Department", render: (r) => r.department || "—" },
      { key: "role", label: "Role", render: (r) => r.role || r.designation || "—" },
      { key: "status", label: "Status", badge: true, render: (r) => r.status },
      { key: "joined", label: "Started", render: (r) => fmtDate(r.hireDate) },
    ],
    detailPath: (r) => `/admin/employees/${r.id}`,
  },

  certificates: {
    label: "Certificates",
    description: "Issued course and internship certificates.",
    endpoint: "/admin/certificates",
    limit: 500,
    searchPlaceholder: "Search by code or student…",
    managePath: "/admin/certificates",
    countKey: "certificates",
    columns: [
      { key: "code", label: "Code", render: (r) => r.certificateCode },
      { key: "student", label: "Recipient", render: (r) => r.studentName },
      { key: "course", label: "Course / program", render: (r) => r.courseName || "—" },
      { key: "status", label: "Status", badge: true, render: (r) => (r.revokedAt ? "REVOKED" : "ACTIVE") },
      { key: "issued", label: "Issued", render: (r) => fmtDate(r.issuedAt || r.createdAt) },
    ],
    detailPath: () => "/admin/certificates",
  },

  messages: {
    label: "Messages",
    description: "Contact form submissions from the website.",
    endpoint: "/admin/messages",
    limit: 500,
    searchPlaceholder: "Search by name or subject…",
    managePath: "/admin/messages",
    countKey: "messages",
    statusOptions: [
      { value: "", label: "All statuses" },
      { value: "NEW", label: "New" },
      { value: "READ", label: "Read" },
      { value: "REPLIED", label: "Replied" },
      { value: "ARCHIVED", label: "Archived" },
    ],
    statusParam: "status",
    columns: [
      { key: "name", label: "From", render: (r) => r.name },
      { key: "email", label: "Email", render: (r) => r.email },
      { key: "subject", label: "Subject", render: (r) => r.subject || "—" },
      { key: "status", label: "Status", badge: true, render: (r) => r.status },
      { key: "received", label: "Received", render: (r) => fmtDate(r.createdAt) },
    ],
    detailPath: (r) => `/admin/messages/${r.id}`,
  },

  blogs: {
    label: "Blogs",
    description: "Published and draft blog posts.",
    endpoint: "/admin/blogs",
    limit: 500,
    searchPlaceholder: "Search by title…",
    managePath: "/admin/blogs",
    countKey: "blogs",
    statusOptions: [
      { value: "", label: "All statuses" },
      { value: "PUBLISHED", label: "Published" },
      { value: "DRAFT", label: "Draft" },
      { value: "ARCHIVED", label: "Archived" },
    ],
    statusParam: "status",
    columns: [
      { key: "title", label: "Title", render: (r) => r.title },
      { key: "status", label: "Status", badge: true, render: (r) => r.status },
      { key: "author", label: "Author", render: (r) => r.author || "—" },
      { key: "published", label: "Published", render: (r) => fmtDate(r.publishedAt) },
      { key: "updated", label: "Updated", render: (r) => fmtDate(r.updatedAt) },
    ],
    detailPath: (r) => `/admin/blogs/${r.id}`,
  },
};

/** Overview cards grouped for the hub page */
export const RECORD_OVERVIEW_GROUPS = [
  {
    title: "Recruitment",
    items: [
      { type: "internships", label: "Internships", sub: "publishedInternships", subLabel: "published" },
      { type: "applications", label: "Applications", sub: "completedApplications", subLabel: "completed" },
      { type: "interns", label: "Interns", sub: "completedInterns", subLabel: "completed", defaultStatus: "COMPLETED" },
    ],
  },
  {
    title: "Education",
    items: [
      { type: "enrollments", label: "Students", sub: "completedEnrollments", subLabel: "graduated" },
      { type: "courses", label: "Courses" },
      { type: "certificates", label: "Certificates" },
    ],
  },
  {
    title: "Organization",
    items: [
      { type: "employees", label: "Employees", sub: "activeEmployees", subLabel: "active" },
    ],
  },
  {
    title: "Content",
    items: [
      { type: "messages", label: "Messages" },
      { type: "blogs", label: "Blogs" },
    ],
  },
];

export const getRecordConfig = (type) => RECORD_TYPES[type] || null;
