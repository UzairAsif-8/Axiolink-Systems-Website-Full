/**
 * Seed the CEO leadership profile blog post.
 * Run: cd backend && node scripts/seed-ceo-blog.js
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SLUG = "muhammad-uzair-asif-founder-ceo-axiolink-systems";

const FEATURED_IMAGE =
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80";

const CONTENT = `
<p>When Muhammad Uzair Asif founded <strong>Axiolink Systems (Pvt) Ltd.</strong> in 2025, he set out to build more than a software company. He wanted to create an organization that turns ideas into working technology—and helps the next generation of developers learn how to do the same.</p>

<p>Based in Lahore, Pakistan, Axiolink Systems develops web applications, AI-integrated tools, and digital products for businesses, startups, and creators. As Founder and Chief Executive Officer, Asif leads company strategy alongside a growing leadership team, while continuing his Computer Science studies at the University of Management and Technology (UMT).</p>

<h2>From code to company</h2>

<p>Asif's path into technology began with hands-on development. Publicly, he describes himself as a MERN stack developer with experience in React.js, C++, and modern front-end engineering. His GitHub profile (@UzairAsif-8) reflects active project work, including bootcamp teaching materials and client-oriented repositories linked to Axiolink Systems.</p>

<p>Before launching Axiolink, he gained industry exposure through web development internships at EnLive Tech Innovations and AhDev101, and co-founded EnLive Tech Innovations in 2025. That experience shaped a practical view of software delivery: build clearly, ship consistently, and stay close to the people using what you create.</p>

<p>Among his publicly listed projects is <strong>Guidexa</strong>, a career guidance web application designed to help students and professionals navigate career decisions through structured resources and AI-supported tools. Built with React and Tailwind CSS, Guidexa reflects a product philosophy that runs through Axiolink's work—technology should address real problems with clarity and usability.</p>

<h2>Building Axiolink Systems</h2>

<p>Axiolink Systems was founded in 2025 and is headquartered in Lahore. According to the company's public profile, its mission is to transform ideas into impactful technology—from AI-powered applications to seamless web solutions—and to empower the next generation of innovators.</p>

<p>Under Asif's leadership, the company has developed a structured executive team, including Chief Operating Officer Daniyal Saqib and Chief Technology Officer Muhammad Zeeshan. Asif has publicly emphasized that building a company is not only about products, but about people—investing in interns and early-career talent, giving them real responsibility, and creating an environment where learning translates into execution.</p>

<p>In 2026, Axiolink expanded into interactive entertainment with the launch of <strong>Axiolink Game Studio</strong>, a dedicated game development division. Public announcements describe the studio as an active, team-based unit focused on structured game development and product-based entertainment—a step that broadens Axiolink's capabilities beyond conventional web services.</p>

<p>On Axiolink's official website, the company's work spans enterprise software solutions and professional training through <strong>Buland Parwaz</strong>, positioning the organization as both a services company and a platform for skills development.</p>

<h2>Teaching, mentorship, and community</h2>

<p>A defining part of Asif's public work is his commitment to tech education. His personal portfolio states that he has mentored more than 100 students through bootcamps and workshops; his LinkedIn profile cites mentoring more than 200 students in coding, problem-solving, and career growth.</p>

<p>Axiolink Systems has hosted a Web Development Bootcamp led by Asif, covering Tailwind CSS, React.js, essentials of prompt engineering, networking, communication skills, and professional developer habits. The company has framed this work as part of its mission to bridge education and industry by giving emerging developers practical exposure.</p>

<p>In 2026, Asif led the <strong>"From Prompt to Product: AI Build Workshop Series"</strong> at UMT's School of Systems and Technology—a three-part program on prompt engineering, AI tools, vibe coding workflows, and product building. These initiatives reflect a leadership approach that combines building with teaching: sharing knowledge while continuing to learn, particularly in AI and modern web development.</p>

<h2>Leadership beyond the office</h2>

<p>Asif's leadership extends into student organizations and civic initiatives. He serves as President of the Sitara-o-Hilal Foundation, a Lahore-based nonprofit, and holds leadership roles at UMT including Director of Event Management at the UMT Freelancer Club and Vice President of the UMT Psychology Club.</p>

<p>In March 2026, he won first place in the <strong>Chiragh Se Chiragh (C2C) Youth Leadership Competition</strong>, organized by the Shaoor Foundation for Education and Awareness, leading a team through the successful execution of a social action plan. In his public statement on the achievement, he described leadership as responsibility, decision-making, and community impact—not merely titles.</p>

<h2>Vision for the road ahead</h2>

<p>Across his public writing and company messaging, Asif returns to a consistent set of ideas: technology should solve real-world problems; teams grow when given trust and responsibility; education and industry must be connected through practical experience; and leadership is measured by execution and impact on people.</p>

<p>He has pursued structured learning in emerging fields, earning certifications in Prompt Engineering Fundamentals and Introduction to Generative AI Studio from Simplilearn in 2025—reflecting an interest in applying AI thoughtfully to both product development and developer education.</p>

<p>For Axiolink Systems, the direction is clear: continue building practical digital products, strengthen capabilities in software and AI, expand opportunities for young developers, and grow as a Pakistan-based technology company that delivers value for clients, teams, and communities.</p>

<h2>About the author</h2>

<p><strong>Muhammad Uzair Asif</strong> is the Founder and Chief Executive Officer of Axiolink Systems (Pvt) Ltd. He is a Computer Science student at the University of Management and Technology (UMT), Lahore, and a MERN stack developer focused on web applications, AI-integrated products, and tech education in Pakistan.</p>
`;

async function main() {
  const data = {
    title: "Meet Muhammad Uzair Asif: Founder & CEO of Axiolink Systems",
    slug: SLUG,
    excerpt:
      "How Axiolink Systems' Founder and CEO is building software, mentoring developers, and expanding Pakistan's next generation of technology leaders—from web applications and AI to game development and professional training.",
    content: CONTENT.trim(),
    featuredImage: FEATURED_IMAGE,
    category: "business",
    tags: [
      "Leadership",
      "Axiolink Systems",
      "Muhammad Uzair Asif",
      "Startup",
      "Pakistan",
      "Technology",
    ],
    author: "Muhammad Uzair Asif",
    status: "PUBLISHED",
    publishedAt: new Date(),
    seoTitle: "Muhammad Uzair Asif | Founder & CEO | Axiolink Systems (Pvt) Ltd.",
    seoDescription:
      "Learn about Muhammad Uzair Asif, Founder and CEO of Axiolink Systems (Pvt) Ltd.—building software, AI products, and developer education in Lahore, Pakistan.",
  };

  const existing = await prisma.blogPost.findFirst({
    where: { slug: SLUG, deletedAt: null },
  });

  if (existing) {
    await prisma.blogPost.update({ where: { id: existing.id }, data });
    console.log(`Updated blog post: /blog/${SLUG}`);
  } else {
    await prisma.blogPost.create({ data });
    console.log(`Created blog post: /blog/${SLUG}`);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
