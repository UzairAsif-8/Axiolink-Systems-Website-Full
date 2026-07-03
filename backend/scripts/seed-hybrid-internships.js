/**
 * Seeds 10 hybrid unpaid internship listings with demo applicants.
 * Safe to re-run — upserts internships by slug and refreshes seeded applications.
 *
 * Usage: npm run seed:hybrid-internships
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import {
  ASSETS,
  slugify,
  daysAgo,
  pick,
  PAKISTANI_NAMES,
  UNIVERSITIES,
  DEGREES,
  SKILLS_POOL,
} from "../prisma/seed/helpers.js";

const prisma = new PrismaClient();

const deadlineInDays = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(23, 59, 59, 0);
  return d;
};

const SHARED = {
  duration: "3 months",
  location: "Hybrid — Karachi & Remote",
  workingHours: "Flexible (20–40 hrs/week)",
  joiningDate: "Rolling basis",
  type: "Internship",
  workMode: "HYBRID",
  paid: false,
  stipend: null,
  deadline: deadlineInDays(14),
  positions: 10,
  benefits: [
    "Mentorship from industry professionals",
    "Certificate upon successful completion",
    "Portfolio-ready project work",
    "Potential full-time offer for top performers",
  ],
  whoCanApply: [
    "Undergraduate students",
    "Fresh graduates",
    "Self-taught learners with demonstrable portfolio work",
  ],
  status: "PUBLISHED",
  applicationsOpen: true,
};

const INTERNSHIPS = [
  {
    title: "Frontend Development Internship",
    department: "Engineering",
    applicantCount: 10,
    technologies: ["React", "TypeScript", "Tailwind CSS", "JavaScript", "Vite", "Git"],
    description:
      "Build modern web interfaces with React and TypeScript alongside experienced frontend engineers at Axiolink Systems (Pvt) Ltd.",
    responsibilities: [
      "Implement responsive UI components from design specs",
      "Integrate REST APIs and manage client-side state",
      "Participate in code reviews and sprint ceremonies",
    ],
    requirements: [
      "Solid HTML, CSS, and JavaScript fundamentals",
      "Familiarity with React or willingness to learn quickly",
      "Portfolio or GitHub projects demonstrating frontend work",
    ],
    whatYouLearn: ["Component architecture", "Responsive design", "Professional Git workflow"],
    featured: true,
  },
  {
    title: "Backend Development Internship",
    department: "Engineering",
    applicantCount: 10,
    technologies: ["Node.js", "Express.js", "PostgreSQL", "Prisma", "REST APIs", "JWT"],
    description:
      "Work on server-side systems with Node.js, Express, and PostgreSQL in a hybrid engineering team.",
    responsibilities: [
      "Build and maintain REST API endpoints",
      "Design database queries and data models",
      "Implement validation and security best practices",
    ],
    requirements: [
      "Understanding of JavaScript/Node.js and HTTP APIs",
      "Basic SQL and relational database concepts",
      "Git experience and problem-solving mindset",
    ],
    whatYouLearn: ["API design", "Database modeling", "Authentication and secure coding"],
    featured: true,
  },
  {
    title: "Business Development Internship",
    department: "Business",
    applicantCount: 10,
    technologies: ["CRM", "Sales", "Lead Generation", "Market Research", "Presentations"],
    description:
      "Support client outreach, lead generation, and partnership initiatives in a hybrid business development role.",
    responsibilities: [
      "Research prospects and support outreach campaigns",
      "Assist with proposals and client follow-ups",
      "Maintain CRM records and pipeline updates",
    ],
    requirements: [
      "Strong communication and interpersonal skills",
      "Interest in B2B technology sales or business growth",
      "Organized and proactive work style",
    ],
    whatYouLearn: ["B2B sales process", "CRM tools", "Client communication"],
    featured: false,
  },
  {
    title: "Full Stack Development Internship",
    department: "Engineering",
    applicantCount: 10,
    technologies: ["React", "Node.js", "PostgreSQL", "Prisma", "TypeScript", "REST APIs"],
    description:
      "Ship features end-to-end across React frontends and Node.js backends with mentor support in a hybrid setup.",
    responsibilities: [
      "Develop full-stack features from database to UI",
      "Collaborate on architecture and code reviews",
      "Write tests and documentation for delivered work",
    ],
    requirements: [
      "Comfort with both frontend and backend fundamentals",
      "Experience with React and Node.js (or strong willingness to learn)",
      "Git workflow and debugging skills",
    ],
    whatYouLearn: ["Full-stack delivery", "System design basics", "Production deployment practices"],
    featured: true,
  },
  {
    title: "AI & Machine Learning Internship",
    department: "Engineering",
    applicantCount: 10,
    technologies: ["Python", "TensorFlow", "PyTorch", "Scikit-learn", "LLMs", "Data Science"],
    description:
      "Explore practical AI and machine learning projects — from data pipelines to model deployment — with senior mentors.",
    responsibilities: [
      "Prepare datasets and train baseline models",
      "Experiment with LLM integrations and evaluation",
      "Document findings and present results to the team",
    ],
    requirements: [
      "Python programming and basic statistics",
      "Coursework or projects in ML/AI",
      "Curiosity about real-world AI applications",
    ],
    whatYouLearn: ["ML workflows", "Model evaluation", "AI product integration"],
    featured: true,
  },
  {
    title: "Mobile App Development Internship",
    department: "Engineering",
    applicantCount: 10,
    technologies: ["React Native", "iOS", "Android", "TypeScript", "REST APIs", "Mobile UI"],
    description:
      "Develop cross-platform mobile applications and learn professional mobile delivery in a hybrid team.",
    responsibilities: [
      "Build mobile screens and navigation flows",
      "Integrate APIs and manage app state",
      "Test on devices and fix platform-specific issues",
    ],
    requirements: [
      "Mobile development interest with demo projects",
      "Understanding of async programming",
      "Device or emulator available for testing",
    ],
    whatYouLearn: ["Mobile architecture", "API integration", "Release basics"],
    featured: false,
  },
  {
    title: "Flutter Development Internship",
    department: "Engineering",
    applicantCount: 10,
    technologies: ["Flutter", "Dart", "Firebase", "REST APIs", "Mobile UI", "State Management"],
    description:
      "Create polished Flutter apps for iOS and Android while learning cross-platform mobile best practices.",
    responsibilities: [
      "Implement Flutter widgets and navigation",
      "Connect apps to backend services",
      "Optimize performance and UI polish",
    ],
    requirements: [
      "Dart/Flutter basics or strong mobile programming background",
      "Portfolio or coursework in mobile development",
      "Attention to UI detail",
    ],
    whatYouLearn: ["Flutter patterns", "State management", "Mobile UX"],
    featured: false,
  },
  {
    title: "Game Development Internship",
    department: "Engineering",
    applicantCount: 10,
    technologies: ["Unity", "C#", "Game Design", "2D Games", "3D Games", "Animation"],
    description:
      "Prototype and build games with Unity and C# under mentor guidance in a hybrid game development track.",
    responsibilities: [
      "Implement gameplay mechanics and levels",
      "Debug and optimize game performance",
      "Present playable builds for feedback",
    ],
    requirements: [
      "Interest in game design and interactive experiences",
      "Basic programming knowledge (C# preferred)",
      "Creative mindset and iteration skills",
    ],
    whatYouLearn: ["Unity workflows", "Gameplay design", "Build and polish pipeline"],
    featured: false,
  },
  {
    title: "HR Internship",
    department: "Operations",
    applicantCount: 5,
    technologies: ["Recruitment", "HRIS", "Onboarding", "Interviewing", "Employee Relations"],
    description:
      "Support recruitment, onboarding, and people operations at a growing technology company.",
    responsibilities: [
      "Screen applications and coordinate interviews",
      "Support onboarding and intern program operations",
      "Assist with HR records and internal communications",
    ],
    requirements: [
      "Studying HR, business, or related field",
      "Professional communication skills",
      "Discretion with sensitive information",
    ],
    whatYouLearn: ["Tech recruitment", "Interview coordination", "HR operations"],
    featured: false,
  },
  {
    title: "Operations Manager Internship",
    department: "Operations",
    applicantCount: 2,
    technologies: ["Operations", "Process Improvement", "Project Management", "Reporting", "Coordination"],
    description:
      "Learn operational excellence by supporting cross-team coordination, reporting, and process improvements.",
    responsibilities: [
      "Track operational KPIs and team deliverables",
      "Support process documentation and improvements",
      "Coordinate resources across hybrid teams",
    ],
    requirements: [
      "Strong organizational and analytical skills",
      "Interest in operations or project management",
      "Excellent written and verbal communication",
    ],
    whatYouLearn: ["Operations management", "Cross-functional coordination", "Process optimization"],
    featured: false,
  },
];

const APPLICATION_STATUSES = ["NEW", "UNDER_REVIEW", "SHORTLISTED", "INTERVIEW_SCHEDULED", "REJECTED"];

function buildApplicantName(index) {
  const pool = index % 2 === 0 ? PAKISTANI_NAMES.male : PAKISTANI_NAMES.female;
  return pick(pool, index);
}

async function seedApplications(internship, slug, count) {
  await prisma.application.deleteMany({
    where: {
      internshipId: internship.id,
      email: { startsWith: `seed-hybrid-${slug}-` },
    },
  });

  for (let i = 0; i < count; i++) {
    const fullName = buildApplicantName(i);
    const nameSlug = slugify(fullName);
    const skills = SKILLS_POOL.filter((_, si) => (i + si) % 4 === 0).slice(0, 5);

    await prisma.application.create({
      data: {
        applicationType: "internship",
        status: pick(APPLICATION_STATUSES, i),
        fullName,
        email: `seed-hybrid-${slug}-${i + 1}@axiolink-applicant.test`,
        phone: `+92 3${String(20 + (i % 70)).padStart(2, "0")} ${String(2000000 + i * 4321).slice(0, 7)}`,
        currentCity: pick(["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Hyderabad"], i),
        linkedin: `https://linkedin.com/in/${nameSlug}`,
        githubPortfolio: `https://github.com/${nameSlug}`,
        internshipId: internship.id,
        internshipTitle: internship.title,
        university: pick(UNIVERSITIES, i),
        degree: pick(DEGREES, i),
        semester: `${(i % 8) + 1}`,
        graduationYear: String(2025 + (i % 3)),
        skills: skills.length ? skills : internship.technologies.slice(0, 3),
        whyJoin: `I want to grow in ${internship.department.toLowerCase()} through hands-on work at Axiolink Systems (Pvt) Ltd.`,
        proudProject: `Built a project using ${pick(internship.technologies, i)} that demonstrates my skills.`,
        portfolioWebsite: `https://${nameSlug}.dev`,
        availableStartDate: daysAgo(-14 - i),
        resumeUrl: ASSETS.resume(fullName),
        createdAt: daysAgo(3 + i * 2),
        updatedAt: daysAgo(3 + i * 2),
      },
    });
  }
}

async function main() {
  if (!process.env.DATABASE_URL?.trim()) {
    console.error("DATABASE_URL not set — cannot seed internships.");
    process.exit(1);
  }

  console.log("\n📋 Seeding hybrid unpaid internships + applicants...\n");

  let totalApplications = 0;

  for (const row of INTERNSHIPS) {
    const slug = slugify(row.title);
    const data = {
      ...SHARED,
      title: row.title,
      slug,
      department: row.department,
      description: row.description,
      responsibilities: row.responsibilities,
      requirements: row.requirements,
      benefits: SHARED.benefits,
      technologies: row.technologies,
      skillLevel: "Beginner to Intermediate",
      whatYouLearn: row.whatYouLearn,
      whoCanApply: SHARED.whoCanApply,
      featured: row.featured,
      seoTitle: `${row.title} | Axiolink Systems (Pvt) Ltd. Careers`,
      seoDescription: `Apply for the ${row.title} at Axiolink Systems (Pvt) Ltd. Hybrid, unpaid, mentor-led program.`,
      deletedAt: null,
    };

    const internship = await prisma.internship.upsert({
      where: { slug },
      create: data,
      update: data,
    });

    await seedApplications(internship, slug, row.applicantCount);
    totalApplications += row.applicantCount;

    console.log(`  ✓ ${row.title} — ${row.applicantCount} applicant(s)`);
  }

  console.log(`\n✅ Done — ${INTERNSHIPS.length} internships, ${totalApplications} applications seeded.`);
  console.log("   View at /careers or Admin → Internships\n");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
