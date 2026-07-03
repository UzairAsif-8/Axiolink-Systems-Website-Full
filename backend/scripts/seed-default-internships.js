/**
 * Seeds the six core internship listings (published, applications open).
 * Safe to re-run — upserts by slug without duplicating.
 *
 * Usage: npm run seed:internships
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const slugify = (text) =>
  (text || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const deadlineInDays = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(23, 59, 59, 0);
  return d;
};

const INTERNSHIPS = [
  {
    title: "Frontend Development Internship",
    department: "Engineering",
    description:
      "Build modern web interfaces with React, TypeScript, and Tailwind CSS alongside experienced frontend engineers. You will ship UI features, fix bugs, and learn professional frontend practices used in production teams at Axiolink Systems (Pvt) Ltd.",
    technologies: ["React", "TypeScript", "Tailwind CSS", "JavaScript", "Vite", "REST APIs", "Git"],
    skillLevel: "Beginner to Intermediate",
    responsibilities: [
      "Implement responsive UI components from design specs",
      "Integrate REST APIs and handle client-side state",
      "Participate in code reviews and sprint ceremonies",
      "Write clean, accessible, and maintainable frontend code",
    ],
    requirements: [
      "Solid HTML, CSS, and JavaScript fundamentals",
      "Familiarity with React or willingness to learn quickly",
      "Portfolio or GitHub projects demonstrating frontend work",
      "Good English communication for remote collaboration",
    ],
    whatYouLearn: [
      "Component architecture and modern React patterns",
      "Responsive design with Tailwind CSS",
      "Professional Git workflow and code review culture",
    ],
    featured: true,
    workMode: "REMOTE",
  },
  {
    title: "Backend Development Internship",
    department: "Engineering",
    description:
      "Work on server-side systems with Node.js, Express, and PostgreSQL. Learn how APIs, databases, authentication, and business logic come together in real enterprise applications.",
    technologies: ["Node.js", "Express.js", "PostgreSQL", "Prisma", "REST APIs", "JWT", "Git"],
    skillLevel: "Intermediate",
    responsibilities: [
      "Build and maintain REST API endpoints",
      "Design database queries and data models with Prisma",
      "Implement validation, error handling, and security best practices",
      "Collaborate with frontend engineers on integration",
    ],
    requirements: [
      "Understanding of JavaScript/Node.js and HTTP APIs",
      "Basic SQL and relational database concepts",
      "Git experience and problem-solving mindset",
      "Currently enrolled or recently graduated in CS/SE or equivalent",
    ],
    whatYouLearn: [
      "Production-grade API design and documentation",
      "Database modeling and migrations with PostgreSQL",
      "Authentication, authorization, and secure coding practices",
    ],
    featured: true,
    workMode: "REMOTE",
  },
  {
    title: "Game Development (Unity) Internship",
    department: "Engineering",
    description:
      "Create engaging games with Unity and C# under mentor guidance. From prototyping mechanics to polishing gameplay, you will learn the full pipeline of indie and mobile game development.",
    technologies: ["Unity", "C#", "Game Design", "2D Games", "3D Games", "Mobile Games", "Animation"],
    skillLevel: "Beginner to Intermediate",
    responsibilities: [
      "Prototype and implement game mechanics in Unity",
      "Build UI, levels, and player interactions",
      "Debug gameplay issues and optimize performance",
      "Document design decisions and present playable builds",
    ],
    requirements: [
      "Interest in game design and interactive experiences",
      "Basic programming knowledge (C# preferred)",
      "Unity personal projects or coursework are a plus",
      "Creative mindset and ability to iterate on feedback",
    ],
    whatYouLearn: [
      "Unity editor workflows and C# scripting",
      "Game loops, physics, and player feedback design",
      "Publishing considerations for mobile and PC builds",
    ],
    featured: true,
    workMode: "HYBRID",
  },
  {
    title: "Flutter & React Native App Development Internship",
    department: "Engineering",
    description:
      "Develop cross-platform mobile apps using Flutter and React Native. Work on real product features, API integration, and app store readiness with mentors who ship mobile software professionally.",
    technologies: ["Flutter", "Dart", "React Native", "TypeScript", "Firebase", "REST APIs", "Mobile UI"],
    skillLevel: "Intermediate",
    responsibilities: [
      "Build screens and navigation flows for iOS and Android",
      "Integrate backend APIs and manage app state",
      "Test on devices/emulators and fix platform-specific issues",
      "Follow mobile UX patterns and performance best practices",
    ],
    requirements: [
      "Experience with Flutter OR React Native (both is a plus)",
      "Understanding of mobile UI patterns and async programming",
      "Published app, demo project, or strong portfolio work",
      "Reliable internet and device/emulator for testing",
    ],
    whatYouLearn: [
      "Cross-platform mobile architecture with Flutter and React Native",
      "API integration, auth flows, and offline considerations",
      "App store submission and mobile release basics",
    ],
    featured: true,
    workMode: "REMOTE",
  },
  {
    title: "Business Development Internship",
    department: "Business",
    description:
      "Support client outreach, lead generation, and partnership initiatives while learning how a technology company grows. Ideal for candidates interested in sales, growth, and client relationships.",
    technologies: ["CRM", "Sales", "Lead Generation", "Market Research", "Client Outreach", "Presentations"],
    skillLevel: "Beginner to Intermediate",
    responsibilities: [
      "Research prospects and support outbound outreach campaigns",
      "Assist with proposals, presentations, and follow-ups",
      "Maintain CRM records and pipeline updates",
      "Collaborate with leadership on market and competitor research",
    ],
    requirements: [
      "Strong communication and interpersonal skills",
      "Interest in B2B technology sales or business growth",
      "Organized, proactive, and comfortable with targets",
      "Business, marketing, or related field student/graduate",
    ],
    whatYouLearn: [
      "B2B sales process for software services",
      "CRM tools and pipeline management",
      "Client communication and proposal writing",
    ],
    featured: false,
    workMode: "HYBRID",
  },
  {
    title: "HR Internship",
    department: "Operations",
    description:
      "Gain hands-on experience in recruitment, onboarding, and people operations at a growing tech company. Support hiring for engineering and business roles while learning modern HR practices.",
    technologies: ["Recruitment", "HRIS", "Onboarding", "Interviewing", "Employee Relations"],
    skillLevel: "Beginner",
    responsibilities: [
      "Screen applications and coordinate interview schedules",
      "Support onboarding documentation and intern programs",
      "Assist with HR records, policies, and internal communications",
      "Help organize team events and culture initiatives",
    ],
    requirements: [
      "Studying HR, business, psychology, or related field",
      "Professional written and verbal communication",
      "Discretion when handling sensitive information",
      "Organized and detail-oriented work style",
    ],
    whatYouLearn: [
      "Tech recruitment and internship program operations",
      "Interview coordination and candidate experience",
      "HR documentation and compliance basics",
    ],
    featured: false,
    workMode: "REMOTE",
  },
];

const SHARED = {
  duration: "3 months",
  location: "Remote / Pakistan",
  workingHours: "Flexible (20–40 hrs/week)",
  joiningDate: "Rolling basis",
  type: "Internship",
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

async function main() {
  if (!process.env.DATABASE_URL?.trim()) {
    console.error("DATABASE_URL not set — cannot seed internships.");
    process.exit(1);
  }

  console.log("\n📋 Seeding core internship listings...\n");

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
      skillLevel: row.skillLevel,
      whatYouLearn: row.whatYouLearn,
      whoCanApply: SHARED.whoCanApply,
      workMode: row.workMode,
      featured: row.featured,
      location:
        row.workMode === "REMOTE"
          ? "Remote / Pakistan"
          : row.workMode === "HYBRID"
            ? "Hybrid — Karachi & Remote"
            : "Onsite — Karachi, Pakistan",
      seoTitle: `${row.title} | Axiolink Systems (Pvt) Ltd. Careers`,
      seoDescription: `Apply for the ${row.title} at Axiolink Systems (Pvt) Ltd. Mentor-led, remote-friendly program in Pakistan.`,
      deletedAt: null,
    };

    const existing = await prisma.internship.findUnique({ where: { slug } });

    if (existing) {
      await prisma.internship.update({ where: { slug }, data });
      console.log(`  ↻ Updated: ${row.title}`);
    } else {
      await prisma.internship.create({ data });
      console.log(`  ✓ Created: ${row.title}`);
    }
  }

  console.log("\n✅ Done — 6 internships are PUBLISHED and open for applications.");
  console.log("   View them at /careers or Admin → Internships\n");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
