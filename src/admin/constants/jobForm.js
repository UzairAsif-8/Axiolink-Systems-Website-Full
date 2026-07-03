export const JOB_DEPARTMENTS = [
  "Engineering",
  "AI & Data",
  "Design",
  "Cloud & DevOps",
  "Security",
  "Marketing",
  "Business Development",
  "Operations",
  "Product",
  "HR",
];

export const JOB_TYPE_OPTIONS = ["Full-time", "Part-time", "Contract", "Freelance"];

export const JOB_WORK_MODE_OPTIONS = ["REMOTE", "HYBRID", "ONSITE"];

export const JOB_STATUS_OPTIONS = ["DRAFT", "PUBLISHED", "ARCHIVED"];

export const JOB_SALARY_OPTIONS = [
  "Competitive",
  "PKR 50,000 – 80,000",
  "PKR 80,000 – 120,000",
  "PKR 120,000 – 200,000",
  "PKR 200,000+",
  "Negotiable",
];

export const JOB_DEADLINE_OPTIONS = ["", "7", "14", "30", "60", "90"];

export const slugifyTitle = (title) =>
  String(title || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const computeDeadline = (days) => {
  if (!days) return null;
  const n = Number(days);
  if (!Number.isFinite(n) || n <= 0) return null;
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString();
};

export const DEFAULT_LISTS = {
  responsibilities: [
    "Deliver high-quality work aligned with team goals",
    "Collaborate with cross-functional stakeholders",
    "Contribute to documentation and knowledge sharing",
  ],
  requirements: [
    "Relevant degree or equivalent practical experience",
    "Strong communication and problem-solving skills",
    "Ability to work independently and in a team",
  ],
  benefits: [
    "Competitive compensation",
    "Professional growth opportunities",
    "Collaborative and inclusive culture",
  ],
};
