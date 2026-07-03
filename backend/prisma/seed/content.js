import { ASSETS, slugify, daysAgo, monthsAgo, pick } from "./helpers.js";

const BLOG_POSTS = [
  {
    title: "How We Built Our Internship Program at Axiolink",
    category: "Company",
    status: "PUBLISHED",
    tags: ["internships", "careers", "culture"],
    days: 45,
  },
  {
    title: "5 Skills Every Frontend Developer Needs in 2026",
    category: "Engineering",
    status: "PUBLISHED",
    tags: ["frontend", "react", "careers"],
    days: 38,
  },
  {
    title: "Introducing Buland Parwaz: Our Training Initiative",
    category: "Education",
    status: "PUBLISHED",
    tags: ["buland-parwaz", "training", "students"],
    days: 30,
  },
  {
    title: "Cybersecurity Best Practices for Startups",
    category: "Security",
    status: "PUBLISHED",
    tags: ["security", "startups"],
    days: 22,
  },
  {
    title: "From Intern to Full-Time: Success Stories",
    category: "Careers",
    status: "PUBLISHED",
    tags: ["internships", "success"],
    days: 18,
  },
  {
    title: "Why We Choose PostgreSQL for Enterprise Apps",
    category: "Engineering",
    status: "PUBLISHED",
    tags: ["backend", "database"],
    days: 14,
  },
  {
    title: "Design Systems That Scale Across Teams",
    category: "Design",
    status: "PUBLISHED",
    tags: ["design", "ui-ux"],
    days: 10,
  },
  {
    title: "AI in Production: Lessons from Our ML Team",
    category: "AI",
    status: "PUBLISHED",
    tags: ["ai", "machine-learning"],
    days: 7,
  },
  {
    title: "Upcoming Events and Community Workshops",
    category: "Events",
    status: "DRAFT",
    tags: ["events", "community"],
    days: 3,
  },
  {
    title: "Remote-First Culture at Axiolink Systems (Pvt) Ltd.",
    category: "Company",
    status: "PUBLISHED",
    tags: ["remote", "culture"],
    days: 2,
  },
];

const MESSAGE_SUBJECTS = [
  "Internship inquiry",
  "Partnership opportunity",
  "Buland Parwaz enrollment question",
  "Project quote request",
  "Career guidance",
  "Website feedback",
  "Training program for university",
  "Certificate verification help",
];

export async function seedContent(prisma) {
  console.log("\n📝 Content — blogs, messages, newsletter & team");

  const blogs = [];
  for (let i = 0; i < BLOG_POSTS.length; i++) {
    const row = BLOG_POSTS[i];
    const slug = slugify(row.title);
    const published = row.status === "PUBLISHED";

    const blog = await prisma.blogPost.create({
      data: {
        title: row.title,
        slug,
        excerpt: `${row.title}. Insights from the Axiolink Systems (Pvt) Ltd. team on technology, careers, and education in Pakistan.`,
        content: `<p>${row.title}</p><p>Axiolink Systems (Pvt) Ltd. continues to invest in talent, technology, and community impact. This article shares practical insights for students, professionals, and partners engaging with our platform.</p><h2>Key takeaways</h2><ul><li>Industry-aligned learning paths</li><li>Mentorship-driven delivery</li><li>Real projects with measurable outcomes</li></ul>`,
        featuredImage: ASSETS.blogImage(slug),
        category: row.category,
        tags: row.tags,
        author: "Axiolink Content Team",
        status: row.status,
        publishedAt: published ? daysAgo(row.days) : null,
        seoTitle: `${row.title} | Axiolink Systems (Pvt) Ltd. Blog`,
        seoDescription: `Read about ${row.category.toLowerCase()} at Axiolink Systems (Pvt) Ltd.`,
        createdAt: daysAgo(row.days + 2),
      },
    });
    blogs.push(blog);
  }
  console.log(`  ✓ ${blogs.length} blog posts`);

  const messageStatuses = [
    ...Array(14).fill("NEW"),
    ...Array(12).fill("READ"),
    ...Array(8).fill("REPLIED"),
    ...Array(6).fill("ARCHIVED"),
  ];

  for (let i = 0; i < 40; i++) {
    const name = pick(["Ahmed Khan", "Fatima Ali", "Usman Ali", "Sana Malik", "Hassan Raza", "Ayesha Khan"], i);
    const slug = slugify(name);
    await prisma.contactMessage.create({
      data: {
        name,
        email: `${slug}${i}@inquiry.com`,
        phone: `+92 300 ${String(5000000 + i * 4321).slice(0, 7)}`,
        company: pick(["TechVentures", "EduPak", "StartupHub", "Digital Solutions", null], i),
        subject: pick(MESSAGE_SUBJECTS, i),
        message: `Hello Axiolink team,\n\nI would like to learn more about ${pick(MESSAGE_SUBJECTS, i).toLowerCase()}. Please share next steps and any requirements.\n\nRegards,\n${name}`,
        status: messageStatuses[i],
        reply: messageStatuses[i] === "REPLIED" ? "Thank you for reaching out. Our team will follow up shortly with detailed information." : null,
        createdAt: daysAgo(50 - i),
      },
    });
  }
  console.log("  ✓ 40 contact messages (14 unread/NEW)");

  for (let i = 0; i < 150; i++) {
    await prisma.newsletterSubscriber.create({
      data: {
        email: `subscriber${i + 1}@newsletter.demo`,
        isActive: i % 17 !== 0,
        subscribedAt: daysAgo(180 - i),
      },
    });
  }
  console.log("  ✓ 150 newsletter subscribers");

  const teamRoles = [
    { name: "Usman Tariq", role: "CEO", dept: "Management" },
    { name: "Dr. Nida Qureshi", role: "Head of AI", dept: "AI" },
    { name: "Hassan Raza", role: "Engineering Lead", dept: "Backend" },
    { name: "Hira Ahmed", role: "Design Lead", dept: "UI/UX" },
    { name: "Sara Ahmed", role: "HR Director", dept: "HR" },
    { name: "Waqas Butt", role: "Marketing Lead", dept: "Marketing" },
  ];

  for (let i = 0; i < teamRoles.length; i++) {
    const row = teamRoles[i];
    await prisma.teamMember.create({
      data: {
        name: row.name,
        role: row.role,
        department: row.dept,
        bio: `${row.name} leads the ${row.dept} function at Axiolink Systems (Pvt) Ltd.`,
        photoUrl: ASSETS.avatar(`team-${i}`),
        email: `${slugify(row.name)}@axiolinksystems.com`,
        displayOrder: i,
        featured: i < 3,
        status: "PUBLISHED",
      },
    });
  }
  console.log(`  ✓ ${teamRoles.length} team members`);

  const event = await prisma.event.create({
    data: {
      title: "Buland Parwaz Career Fair 2026",
      slug: "buland-parwaz-career-fair-2026",
      description: "Annual career fair connecting students with mentors, employers, and training opportunities.",
      bannerUrl: ASSETS.courseBanner("career-fair-2026"),
      location: "Lahore & Online",
      speakers: [{ name: "Usman Tariq", role: "CEO" }, { name: "Ayesha Malik", role: "COO" }],
      schedule: [{ time: "10:00", session: "Opening Keynote" }, { time: "14:00", session: "Internship Panel" }],
      startDate: daysAgo(-30),
      endDate: daysAgo(-28),
      status: "PUBLISHED",
    },
  });

  for (let i = 0; i < 12; i++) {
    await prisma.eventRegistration.create({
      data: {
        eventId: event.id,
        fullName: pick(["Ahmed Khan", "Fatima Ali", "Zain Malik", "Maryam Raza"], i),
        email: `event.reg.${i + 1}@email.com`,
        phone: `+92 300 ${String(6000000 + i * 2222).slice(0, 7)}`,
      },
    });
  }
  console.log("  ✓ 1 event + 12 registrations");

  for (let i = 0; i < 6; i++) {
    await prisma.testimonial.create({
      data: {
        clientName: pick(["Ali Raza", "Sana Tariq", "Bilal Ahmed", "Khadija Mir", "Omar Farooq", "Laiba Butt"], i),
        company: pick(["TechCorp", "EduStart", "FinPak", "HealthTech PK"], i),
        designation: pick(["CTO", "Product Manager", "Founder", "Engineering Manager"], i),
        rating: 5 - (i % 2),
        review: "Axiolink Systems (Pvt) Ltd. delivered exceptional quality and mentorship. Their internship and training programs produce job-ready talent.",
        status: "PUBLISHED",
      },
    });
  }
  console.log("  ✓ 6 testimonials");

  return { blogs, event };
}
