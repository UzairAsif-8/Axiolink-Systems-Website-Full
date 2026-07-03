export const INTERNSHIP_DEPARTMENTS = [
  "Engineering",
  "AI & Data",
  "Design",
  "Cloud & DevOps",
  "Security",
  "Marketing",
  "Business",
  "Operations",
  "Product",
  "Creative",
];

export const INTERNSHIP_TITLE_OPTIONS = [
  { title: "Frontend Development Internship", department: "Engineering", skillLevel: "Beginner to Intermediate", techKey: "frontend" },
  { title: "Backend Development Internship", department: "Engineering", skillLevel: "Intermediate", techKey: "backend" },
  { title: "Full Stack Development Internship", department: "Engineering", skillLevel: "Intermediate", techKey: "fullstack" },
  { title: "AI & Machine Learning Internship", department: "AI & Data", skillLevel: "Intermediate", techKey: "ai" },
  { title: "Data Science Internship", department: "AI & Data", skillLevel: "Intermediate", techKey: "data" },
  { title: "Cybersecurity Internship", department: "Security", skillLevel: "Intermediate", techKey: "security" },
  { title: "UI/UX Design Internship", department: "Design", skillLevel: "Beginner to Intermediate", techKey: "design" },
  { title: "Graphic Design Internship", department: "Creative", skillLevel: "Beginner", techKey: "graphic" },
  { title: "Mobile App Development Internship", department: "Engineering", skillLevel: "Intermediate", techKey: "mobile" },
  { title: "Flutter & React Native App Development Internship", department: "Engineering", skillLevel: "Intermediate", techKey: "flutter_rn" },
  { title: "Game Development (Unity) Internship", department: "Engineering", skillLevel: "Beginner to Intermediate", techKey: "gaming" },
  { title: "Cloud Computing Internship", department: "Cloud & DevOps", skillLevel: "Intermediate", techKey: "cloud" },
  { title: "DevOps Internship", department: "Cloud & DevOps", skillLevel: "Intermediate", techKey: "devops" },
  { title: "Digital Marketing Internship", department: "Marketing", skillLevel: "Beginner", techKey: "marketing" },
  { title: "Content Writing Internship", department: "Marketing", skillLevel: "Beginner", techKey: "content" },
  { title: "Business Development Internship", department: "Business", skillLevel: "Beginner to Intermediate", techKey: "business" },
  { title: "Product Management Internship", department: "Product", skillLevel: "Intermediate", techKey: "product" },
  { title: "HR Internship", department: "Operations", skillLevel: "Beginner", techKey: "hr" },
];

export const INTERNSHIP_LOCATION_OPTIONS = [
  "Remote / Pakistan",
  "Remote / Hybrid",
  "Hybrid — Karachi & Remote",
  "Onsite — Karachi, Pakistan",
  "Onsite — Lahore, Pakistan",
  "Onsite — Islamabad, Pakistan",
  "Fully Remote (Global)",
];

export const INTERNSHIP_WORKING_HOURS_OPTIONS = [
  "Flexible (20–40 hrs/week)",
  "Part-time (20 hrs/week)",
  "Full-time (40 hrs/week)",
  "25 hrs/week",
  "30 hrs/week",
  "Evenings & weekends",
];

export const INTERNSHIP_COMPENSATION_OPTIONS = [
  { value: "unpaid", label: "Unpaid" },
  { value: "paid", label: "Paid" },
];

export const INTERNSHIP_JOINING_DATE_OPTIONS = [
  "Rolling basis",
  "Immediately",
  "Within 2 weeks",
  "Within 1 month",
  "Next month",
  "Summer intake",
  "Fall intake",
];

export const INTERNSHIP_APPLICATION_DEADLINE_OPTIONS = [
  { value: "", label: "Rolling basis (no fixed deadline)" },
  { value: "14", label: "2 weeks from today" },
  { value: "30", label: "1 month from today" },
  { value: "60", label: "2 months from today" },
  { value: "90", label: "3 months from today" },
  { value: "180", label: "6 months from today" },
];

export const LOCATION_BY_WORK_MODE = {
  REMOTE: "Remote / Pakistan",
  HYBRID: "Hybrid — Karachi & Remote",
  ONSITE: "Onsite — Karachi, Pakistan",
};

export const INTERNSHIP_DURATION_OPTIONS = [
  "4 weeks",
  "6 weeks",
  "8 weeks",
  "8–12 weeks",
  "3 months",
  "6 months",
];

export const INTERNSHIP_STIPEND_OPTIONS = [
  "Unpaid",
  "PKR 15,000 / month",
  "PKR 20,000 / month",
  "PKR 25,000 – 40,000 / month",
  "PKR 40,000 – 60,000 / month",
  "Performance-based stipend",
  "To be discussed",
];

export const INTERNSHIP_POSITION_OPTIONS = ["1", "2", "3", "4", "5", "6", "8", "10", "15", "20"];

export const CUSTOM_SELECT_VALUE = "__custom__";

export const INTERNSHIP_TYPE_OPTIONS = ["Internship", "Professional Internship", "Summer Internship"];

export const INTERNSHIP_SKILL_LEVEL_OPTIONS = [
  "Beginner",
  "Beginner to Intermediate",
  "Intermediate",
  "Advanced",
];

export const INTERNSHIP_STATUS_OPTIONS = [
  { value: "DRAFT", label: "Draft" },
  { value: "PUBLISHED", label: "Published" },
  { value: "ARCHIVED", label: "Archived" },
];

export const INTERNSHIP_WORK_MODE_OPTIONS = [
  { value: "REMOTE", label: "Remote" },
  { value: "HYBRID", label: "Hybrid" },
  { value: "ONSITE", label: "Onsite" },
];

export const YES_NO_OPTIONS = [
  { value: "true", label: "Yes" },
  { value: "false", label: "No" },
];

export const TECH_STACK_OPTIONS = {
  frontend: {
    label: "Frontend Development",
    defaults: ["React", "TypeScript", "Tailwind CSS"],
    options: [
      "React", "Vue.js", "Angular", "Next.js", "TypeScript", "JavaScript",
      "Tailwind CSS", "HTML", "CSS", "Vite", "Redux", "REST APIs", "Git",
    ],
  },
  backend: {
    label: "Backend Development",
    defaults: ["Node.js", "PostgreSQL", "REST APIs"],
    options: [
      "Node.js", "Express.js", "Python", "Django", "FastAPI", "PostgreSQL",
      "MongoDB", "REST APIs", "GraphQL", "Prisma", "Redis", "Docker", "Git",
    ],
  },
  fullstack: {
    label: "Full Stack Development",
    defaults: ["React", "Node.js", "Prisma"],
    options: [
      "React", "Node.js", "Express.js", "TypeScript", "PostgreSQL", "Prisma",
      "REST APIs", "Tailwind CSS", "Next.js", "MongoDB", "Git", "Docker",
    ],
  },
  ai: {
    label: "AI & Machine Learning",
    defaults: ["Python", "TensorFlow", "LLMs"],
    options: [
      "Python", "TensorFlow", "PyTorch", "Scikit-learn", "LLMs", "OpenAI API",
      "Pandas", "NumPy", "Jupyter", "Computer Vision", "NLP", "MLOps",
    ],
  },
  data: {
    label: "Data Science",
    defaults: ["Python", "Pandas", "SQL"],
    options: [
      "Python", "Pandas", "NumPy", "SQL", "PostgreSQL", "Power BI", "Tableau",
      "Excel", "Statistics", "Data Visualization", "Jupyter", "ETL",
    ],
  },
  security: {
    label: "Cybersecurity",
    defaults: ["SIEM", "Pen Testing", "Network Security"],
    options: [
      "SIEM", "Pen Testing", "Network Security", "Linux", "Wireshark",
      "OWASP", "Firewalls", "Incident Response", "Vulnerability Assessment", "Python",
    ],
  },
  design: {
    label: "UI/UX Design",
    defaults: ["Figma", "Design Systems", "Prototyping"],
    options: [
      "Figma", "Design Systems", "Prototyping", "User Research", "Wireframing",
      "Adobe XD", "Accessibility (WCAG)", "Usability Testing", "UI Design", "UX Writing",
    ],
  },
  graphic: {
    label: "Graphic Design",
    defaults: ["Adobe Illustrator", "Photoshop", "Branding"],
    options: [
      "Adobe Illustrator", "Photoshop", "Branding", "InDesign", "Canva",
      "Logo Design", "Typography", "Social Media Graphics", "Print Design",
    ],
  },
  mobile: {
    label: "Mobile App Development",
    defaults: ["React Native", "Flutter", "Swift"],
    options: [
      "React Native", "Flutter", "Swift", "Kotlin", "Android", "iOS",
      "Firebase", "REST APIs", "Mobile UI", "App Store Deployment",
    ],
  },
  flutter_rn: {
    label: "Flutter & React Native",
    defaults: ["Flutter", "React Native", "Dart"],
    options: [
      "Flutter", "Dart", "React Native", "TypeScript", "Firebase",
      "REST APIs", "State Management", "Android", "iOS", "Mobile UI",
      "App Store Deployment", "Google Play", "Git",
    ],
  },
  gaming: {
    label: "Game Development (Unity)",
    defaults: ["Unity", "C#", "Game Design"],
    options: [
      "Unity", "C#", "Game Design", "2D Games", "3D Games", "Physics",
      "Animation", "UI/UX for Games", "Mobile Games", "Version Control",
      "Shader Graph", "Multiplayer Basics",
    ],
  },
  cloud: {
    label: "Cloud Computing",
    defaults: ["AWS", "Azure", "Docker"],
    options: [
      "AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "Terraform",
      "Cloud Networking", "Serverless", "Linux", "CI/CD",
    ],
  },
  devops: {
    label: "DevOps",
    defaults: ["CI/CD", "Kubernetes", "Terraform"],
    options: [
      "CI/CD", "Kubernetes", "Terraform", "Docker", "Jenkins", "GitHub Actions",
      "AWS", "Linux", "Monitoring", "Infrastructure as Code",
    ],
  },
  marketing: {
    label: "Digital Marketing",
    defaults: ["SEO", "Google Ads", "Analytics"],
    options: [
      "SEO", "Google Ads", "Analytics", "Meta Ads", "Content Strategy",
      "Email Marketing", "Social Media", "Google Analytics", "Copywriting",
    ],
  },
  content: {
    label: "Content Writing",
    defaults: ["Copywriting", "SEO", "Blogging"],
    options: [
      "Copywriting", "SEO", "Blogging", "Technical Writing", "Editing",
      "Content Strategy", "Social Media", "Research", "WordPress",
    ],
  },
  business: {
    label: "Business Development",
    defaults: ["CRM", "Sales", "Negotiation"],
    options: [
      "CRM", "Sales", "Negotiation", "Lead Generation", "Market Research",
      "Client Outreach", "Presentations", "HubSpot", "LinkedIn Sales",
    ],
  },
  product: {
    label: "Product Management",
    defaults: ["Roadmapping", "User Research", "Agile"],
    options: [
      "Roadmapping", "User Research", "Agile", "Scrum", "Jira", "Product Analytics",
      "Stakeholder Management", "PRDs", "Wireframing", "A/B Testing",
    ],
  },
  hr: {
    label: "Human Resources",
    defaults: ["Recruitment", "HRIS", "Onboarding"],
    options: [
      "Recruitment", "HRIS", "Onboarding", "Interviewing", "Employee Relations",
      "HR Policies", "Payroll Basics", "Training & Development",
    ],
  },
};

/** All unique tech labels across stacks — used when title is custom */
export const ALL_TECHNOLOGY_OPTIONS = [
  ...new Set(
    Object.values(TECH_STACK_OPTIONS).flatMap((stack) => stack.options || [])
  ),
];

/** @deprecated use defaults/options on each stack entry */
export const getTechStackDefaults = (techKey) =>
  TECH_STACK_OPTIONS[techKey]?.defaults ?? TECH_STACK_OPTIONS[techKey]?.technologies ?? [];

export const getTechStackForTitle = (title) => {
  const preset = INTERNSHIP_TITLE_OPTIONS.find((option) => option.title === title);
  const techKey = preset?.techKey;
  if (!techKey || !TECH_STACK_OPTIONS[techKey]) {
    return {
      techKey: null,
      label: "Select an internship title first",
      options: [],
      defaults: [],
    };
  }
  const stack = TECH_STACK_OPTIONS[techKey];
  return {
    techKey,
    label: stack.label,
    options: stack.options,
    defaults: stack.defaults ?? stack.technologies ?? [],
  };
};

export const getTechKeyForTitle = (title) =>
  INTERNSHIP_TITLE_OPTIONS.find((option) => option.title === title)?.techKey ?? null;

export const DESCRIPTION_TEMPLATES = {
  standard: {
    label: "Standard mentorship program",
    text: "Join Axiolink Systems (Pvt) Ltd. as an intern and work on production-grade projects with mentorship from senior professionals. This program is designed for students and recent graduates who want hands-on industry experience in a collaborative, remote-friendly environment.",
  },
  engineering: {
    label: "Engineering track",
    text: "Build real software with modern tools alongside experienced engineers. You will contribute to live codebases, participate in reviews, and learn professional delivery practices used in enterprise teams.",
  },
  design: {
    label: "Design track",
    text: "Work on user-centered design challenges from research through high-fidelity prototypes. Collaborate with product and engineering teams to ship polished experiences for real users.",
  },
  business: {
    label: "Business & growth track",
    text: "Support go-to-market, client outreach, and operational initiatives while learning how a technology company scales. Ideal for candidates interested in business development, marketing, or operations.",
  },
};

export const LIST_TEMPLATES = {
  responsibilities: {
    standard: {
      label: "Standard responsibilities",
      items: [
        "Collaborate with cross-functional teams on real client projects",
        "Participate in reviews, standups, and sprint planning",
        "Document work and present outcomes at the end of the internship",
        "Follow company engineering, design, and security best practices",
      ],
    },
    engineering: {
      label: "Engineering responsibilities",
      items: [
        "Implement features and fixes under mentor guidance",
        "Write clean, tested code and participate in peer reviews",
        "Debug issues and contribute to technical documentation",
        "Present demo outcomes at the end of the program",
      ],
    },
  },
  requirements: {
    standard: {
      label: "Standard requirements",
      items: [
        "Currently enrolled in or recently graduated from a relevant degree program",
        "Strong fundamentals and eagerness to learn",
        "Good communication skills in English",
        "Ability to commit to the full internship duration",
      ],
    },
    portfolio: {
      label: "Portfolio-based requirements",
      items: [
        "Demonstrable portfolio or GitHub projects in the role area",
        "Solid understanding of core concepts for the selected track",
        "Reliable internet and availability for remote collaboration",
        "Professional attitude and willingness to receive feedback",
      ],
    },
  },
  benefits: {
    standard: {
      label: "Standard benefits",
      items: [
        "Monthly stipend (where applicable)",
        "Mentorship from industry professionals",
        "Certificate upon successful completion",
        "Potential full-time offer for top performers",
      ],
    },
    remote: {
      label: "Remote-friendly benefits",
      items: [
        "Flexible remote schedule",
        "Mentorship and weekly check-ins",
        "Certificate of completion",
        "Portfolio-ready project work",
      ],
    },
  },
  whatYouLearn: {
    standard: {
      label: "General learning outcomes",
      items: [
        "Professional workflows used in enterprise teams",
        "Agile delivery and cross-functional collaboration",
        "Production quality and documentation standards",
      ],
    },
    technical: {
      label: "Technical learning outcomes",
      items: [
        "Industry tools and frameworks for the selected track",
        "Code quality, testing, and deployment practices",
        "How to scope, build, and ship features end to end",
      ],
    },
  },
  whoCanApply: {
    standard: {
      label: "Students & graduates",
      items: ["Undergraduate students", "Fresh graduates", "Career switchers with portfolio work"],
    },
    open: {
      label: "Open to all motivated learners",
      items: [
        "Students enrolled in a relevant degree program",
        "Recent graduates within 12 months of completion",
        "Self-taught learners with demonstrable portfolio work",
      ],
    },
  },
};

export const DEADLINE_OPTIONS = [
  { value: "", label: "No deadline" },
  { value: "14", label: "2 weeks from today" },
  { value: "30", label: "1 month from today" },
  { value: "60", label: "2 months from today" },
  { value: "90", label: "3 months from today" },
];

export const slugifyTitle = (title) =>
  (title || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export const computeDeadline = (daysFromNow) => {
  if (!daysFromNow) return null;
  const days = Number(daysFromNow);
  if (!Number.isFinite(days) || days <= 0) return null;
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

export const findListTemplateKey = (group, items) => {
  if (!items?.length) return Object.keys(LIST_TEMPLATES[group])[0];
  for (const [key, template] of Object.entries(LIST_TEMPLATES[group])) {
    if (JSON.stringify(template.items) === JSON.stringify(items)) return key;
  }
  return "existing";
};

export const getListItems = (group, templateKey, existingItems) => {
  if (templateKey === "existing") return existingItems || [];
  return LIST_TEMPLATES[group][templateKey]?.items || existingItems || [];
};
