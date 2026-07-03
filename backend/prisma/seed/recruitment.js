import {
  ASSETS,
  slugify,
  daysAgo,
  monthsAgo,
  dateInMonth,
  pick,
  PAKISTANI_NAMES,
  UNIVERSITIES,
  DEGREES,
  SKILLS_POOL,
} from "./helpers.js";
import { DEPT_LABELS } from "./reference.js";

const INTERNSHIP_TITLES = [
  { title: "Frontend Development", dept: "frontend", tech: ["React", "TypeScript", "Tailwind CSS"], featured: true },
  { title: "Backend Development", dept: "backend", tech: ["Node.js", "PostgreSQL", "REST APIs"], featured: true },
  { title: "Full Stack Development", dept: "backend", tech: ["React", "Node.js", "Prisma"], featured: false },
  { title: "AI Engineering", dept: "ai", tech: ["Python", "TensorFlow", "LLMs"], featured: true },
  { title: "Machine Learning", dept: "ai", tech: ["Python", "Scikit-learn", "PyTorch"], featured: false },
  { title: "Cybersecurity", dept: "cybersecurity", tech: ["SIEM", "Pen Testing", "Network Security"], featured: true },
  { title: "UI/UX Design", dept: "ui-ux", tech: ["Figma", "Design Systems", "Prototyping"], featured: false },
  { title: "Graphic Design", dept: "ui-ux", tech: ["Adobe Illustrator", "Photoshop", "Branding"], featured: false },
  { title: "Digital Marketing", dept: "marketing", tech: ["SEO", "Google Ads", "Analytics"], featured: false },
  { title: "Content Writing", dept: "marketing", tech: ["Copywriting", "SEO", "Blogging"], featured: false },
  { title: "Business Development", dept: "sales", tech: ["CRM", "Sales", "Negotiation"], featured: false },
  { title: "Game Development", dept: "frontend", tech: ["Unity", "C#", "Game Design"], featured: false },
];

const APPLICATION_STATUS_WEIGHTS = [
  { status: "NEW", count: 14 },
  { status: "UNDER_REVIEW", count: 18 },
  { status: "SHORTLISTED", count: 15 },
  { status: "INTERVIEW_SCHEDULED", count: 12 },
  { status: "SELECTED", count: 20 },
  { status: "REJECTED", count: 21 },
];

const MONTHLY_APPLICATION_COUNTS = [8, 14, 18, 22, 20, 18];

function buildApplicantPool() {
  const pool = [];
  let idx = 0;
  for (const statusRow of APPLICATION_STATUS_WEIGHTS) {
    for (let j = 0; j < statusRow.count; j++) {
      const isFemale = idx % 3 === 0;
      const names = isFemale ? PAKISTANI_NAMES.female : PAKISTANI_NAMES.male;
      const fullName = pick(names, idx);
      const slug = fullName.toLowerCase().replace(/\s+/g, ".");
      pool.push({
        fullName,
        email: `${slug}${idx}@email.com`,
        status: statusRow.status,
        index: idx,
      });
      idx++;
    }
  }
  return pool;
}

function assignApplicationDates(applicants) {
  const year = new Date().getFullYear();
  let cursor = 0;
  const dated = [];

  MONTHLY_APPLICATION_COUNTS.forEach((count, monthOffset) => {
    const month = new Date().getMonth() - (5 - monthOffset);
    const adjustedMonth = month < 0 ? month + 12 : month;
    const adjustedYear = month < 0 ? year - 1 : year;

    for (let i = 0; i < count && cursor < applicants.length; i++, cursor++) {
      const day = 2 + Math.floor((i / count) * 26);
      dated.push({
        ...applicants[cursor],
        createdAt: dateInMonth(adjustedYear, adjustedMonth, Math.min(day, 28), 9 + (i % 6)),
      });
    }
  });

  while (cursor < applicants.length) {
    dated.push({ ...applicants[cursor], createdAt: daysAgo(cursor % 30) });
    cursor++;
  }

  return dated.sort((a, b) => a.createdAt - b.createdAt);
}

export async function seedRecruitment(prisma) {
  console.log("\n💼 Internships, applications & interns");

  const internships = [];

  for (let i = 0; i < INTERNSHIP_TITLES.length; i++) {
    const row = INTERNSHIP_TITLES[i];
    const slug = slugify(row.title);
    const department = DEPT_LABELS[row.dept] || row.dept;
    const isPublished = i !== 11;

    const internship = await prisma.internship.create({
      data: {
        title: `${row.title} Internship`,
        slug,
        department,
        description: `Join Axiolink Systems (Pvt) Ltd. as a ${row.title} intern and work on production-grade projects with mentorship from senior engineers. This program is designed for students and recent graduates who want hands-on industry experience.`,
        responsibilities: [
          "Collaborate with cross-functional teams on real client projects",
          "Participate in code/design reviews and daily standups",
          "Document work and present outcomes at the end of the internship",
          "Follow company engineering and security best practices",
        ],
        requirements: [
          "Currently enrolled in or recently graduated from a relevant degree program",
          "Strong fundamentals and eagerness to learn",
          "Good communication skills in English",
          "Ability to commit to the full internship duration",
        ],
        benefits: [
          "Monthly stipend",
          "Mentorship from industry professionals",
          "Certificate upon successful completion",
          "Potential full-time offer for top performers",
        ],
        duration: "3 months",
        type: "Internship",
        workMode: i % 3 === 0 ? "REMOTE" : i % 3 === 1 ? "HYBRID" : "ONSITE",
        paid: true,
        stipend: "PKR 25,000 – 40,000",
        deadline: daysAgo(-45),
        positions: 2 + (i % 3),
        technologies: row.tech,
        skillLevel: i < 4 ? "Intermediate" : "Beginner",
        whatYouLearn: [
          `Core ${row.title.toLowerCase()} workflows used in enterprise teams`,
          "Agile delivery and professional collaboration",
          "Production deployment and quality standards",
        ],
        whoCanApply: ["Undergraduate students", "Fresh graduates", "Career switchers with portfolio"],
        imageUrl: ASSETS.internshipImage(slug),
        status: isPublished ? "PUBLISHED" : "DRAFT",
        featured: row.featured,
        applicationsOpen: isPublished,
        seoTitle: `${row.title} Internship | Axiolink Systems (Pvt) Ltd. Careers`,
        seoDescription: `Apply for the ${row.title} internship at Axiolink Systems (Pvt) Ltd. Remote-friendly, paid, mentor-led program in Pakistan.`,
        createdAt: monthsAgo(4, 5 + i),
      },
    });

    internships.push(internship);
  }
  console.log(`  ✓ ${internships.length} internships`);

  const applicants = assignApplicationDates(buildApplicantPool());
  const applications = [];
  const selectedApplications = [];

  for (const applicant of applicants) {
    const internship = pick(internships, applicant.index);
    const skills = SKILLS_POOL.filter((_, si) => (applicant.index + si) % 3 === 0).slice(0, 5);

    const application = await prisma.application.create({
      data: {
        applicationType: "internship",
        status: applicant.status,
        fullName: applicant.fullName,
        email: applicant.email,
        phone: `+92 3${String(20 + (applicant.index % 70)).padStart(2, "0")} ${String(2000000 + applicant.index * 7919).slice(0, 7)}`,
        currentCity: pick(["Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad"], applicant.index),
        linkedin: `https://linkedin.com/in/${slugify(applicant.fullName)}`,
        githubPortfolio: `https://github.com/${slugify(applicant.fullName)}`,
        internshipId: internship.id,
        internshipTitle: internship.title,
        university: pick(UNIVERSITIES, applicant.index),
        degree: pick(DEGREES, applicant.index),
        semester: `${(applicant.index % 8) + 1}`,
        graduationYear: String(2025 + (applicant.index % 3)),
        skills,
        whyJoin: `I am passionate about ${internship.department} and want to contribute to meaningful products at Axiolink Systems (Pvt) Ltd. while learning from experienced mentors.`,
        proudProject: `Built a ${pick(skills, 0) || "web"} project that solved a real problem for my university/community.`,
        portfolioWebsite: `https://${slugify(applicant.fullName)}.dev`,
        availableStartDate: daysAgo(-30 - (applicant.index % 60)),
        resumeUrl: ASSETS.resume(applicant.fullName),
        createdAt: applicant.createdAt,
        updatedAt: applicant.createdAt,
      },
    });

    applications.push(application);
    if (applicant.status === "SELECTED") selectedApplications.push({ application, internship });
  }
  console.log(`  ✓ ${applications.length} applications (${APPLICATION_STATUS_WEIGHTS[0].count} NEW)`);

  const internStatusList = [
    ...Array(25).fill("ACTIVE"),
    ...Array(10).fill("COMPLETED"),
  ];
  const interns = [];

  for (let i = 0; i < 35; i++) {
    const source = selectedApplications[i % selectedApplications.length];
    const { application, internship } = source;
    const startOffset = 120 - (i * 3);
    const endOffset = startOffset - 90;

    const intern = await prisma.intern.create({
      data: {
        applicationId: i < selectedApplications.length ? application.id : null,
        internshipId: pick(internships, i).id,
        fullName: i < selectedApplications.length ? application.fullName : pick(PAKISTANI_NAMES.male.concat(PAKISTANI_NAMES.female), i),
        email: i < selectedApplications.length ? application.email : `intern${i + 1}@axiolinksystems.com`,
        phone: application?.phone || `+92 300 ${String(3000000 + i * 1111).slice(0, 7)}`,
        startDate: daysAgo(startOffset),
        endDate: internStatusList[i] === "COMPLETED" ? daysAgo(endOffset) : daysAgo(-30),
        status: internStatusList[i],
        notes: [
          `University: ${pick(UNIVERSITIES, i)}`,
          `Degree: ${pick(DEGREES, i)}`,
          `Mentor: ${pick(["Hamza Sheikh", "Hassan Raza", "Dr. Nida Qureshi", "Hira Ahmed"], i)}`,
          `Progress: ${60 + (i % 40)}%`,
          `Performance: ${pick(["Excellent", "Strong", "Good", "Meeting expectations"], i)}`,
          `Certificate: ${internStatusList[i] === "COMPLETED" ? "Issued" : "Pending"}`,
        ].join(" | "),
        createdAt: daysAgo(startOffset + 5),
      },
    });

    interns.push(intern);
  }
  console.log(`  ✓ ${interns.length} interns`);

  return { internships, applications, interns, selectedApplications };
}
