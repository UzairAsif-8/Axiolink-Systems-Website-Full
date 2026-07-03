/** Sidebar navigation for the unified admin portal */

export const navItems = [
  { section: "Overview", items: [{ to: "/admin", label: "Dashboard", end: true }] },
  {
    section: "Records",
    items: [{ to: "/admin/records", label: "Records", end: true }],
  },
  {
    section: "Recruitment",
    items: [
      { to: "/admin/jobs", label: "Jobs" },
      { to: "/admin/internships", label: "Internships" },
      { to: "/admin/applications", label: "Applications" },
    ],
  },
  {
    section: "Education",
    items: [
      { to: "/admin/courses", label: "Courses" },
      { to: "/admin/students", label: "Students" },
      { to: "/admin/certificates", label: "Certificates" },
    ],
  },
  {
    section: "Organization",
    items: [{ to: "/admin/employees", label: "Employees" }],
  },
  {
    section: "Content",
    items: [
      { to: "/admin/messages", label: "Messages" },
      { to: "/admin/blogs", label: "Blogs" },
    ],
  },
  {
    section: "System",
    items: [{ to: "/admin/settings", label: "Settings" }],
  },
];
