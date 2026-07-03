import {
  Briefcase,
  FileText,
  GraduationCap,
  Award,
  Users,
  BookOpen,
  Mail,
  Settings,
} from "lucide-react";

export const quickAddSections = [
  {
    id: "recruitment",
    title: "Recruitment",
    items: [
      { label: "New Job", to: "/admin/jobs/new", icon: Briefcase },
      { label: "New Internship", to: "/admin/internships/new", icon: Briefcase },
      { label: "View Applications", to: "/admin/applications", icon: FileText },
    ],
  },
  {
    id: "education",
    title: "Education",
    items: [
      { label: "New Course", to: "/admin/courses/new", icon: GraduationCap },
      { label: "Issue Certificate", to: "/admin/certificates", icon: Award },
      { label: "View Students", to: "/admin/students", icon: Users },
    ],
  },
  {
    id: "organization",
    title: "Organization",
    items: [
      { label: "New Employee", to: "/admin/employees/new", icon: Users },
      { label: "View Employees", to: "/admin/employees", icon: Users },
    ],
  },
  {
    id: "content",
    title: "Content",
    items: [
      { label: "New Blog Post", to: "/admin/blogs/new", icon: BookOpen },
      { label: "View Messages", to: "/admin/messages", icon: Mail },
    ],
  },
  {
    id: "system",
    title: "System",
    items: [{ label: "Site Settings", to: "/admin/settings", icon: Settings }],
  },
];

export const getQuickAddSections = (sectionIds) => {
  if (!sectionIds?.length) return quickAddSections;
  return quickAddSections.filter((section) => sectionIds.includes(section.id));
};
