import { siteUrl, DEFAULT_OG_IMAGE } from "./siteConfig.js";

/** Default Open Graph image when a page has no featured image. */
export const defaultOgImage = DEFAULT_OG_IMAGE;

export const PAGE_META = {
  home: {
    title:
      "Axiolink Systems | AI, Software Development, Mobile Apps & Digital Solutions",
    description:
      "Axiolink Systems builds AI solutions, SaaS platforms, websites, mobile apps, cloud applications, game development, cybersecurity solutions, and enterprise software for startups and businesses.",
    canonical: siteUrl("/"),
  },
  about: {
    title: "About Axiolink Systems | Software Company Pakistan & Lahore",
    description:
      "Learn about Axiolink Systems — a Pakistan-based software house delivering custom software, AI development, web and mobile apps, cloud solutions, and digital transformation for enterprises and startups.",
    canonical: siteUrl("/about"),
  },
  services: {
    title:
      "Software Development Services | Web, Mobile, AI, Cloud & Cybersecurity",
    description:
      "Explore enterprise technology services: custom software development, React and Node.js full-stack development, AI and machine learning, mobile apps, game development, UI/UX design, cloud DevOps, and cybersecurity.",
    canonical: siteUrl("/services"),
  },
  careers: {
    title: "Careers at Axiolink Systems | Software Jobs in Pakistan",
    description:
      "Join Axiolink Systems in Lahore, Pakistan. Explore software engineering, AI, design, and business roles with mentorship, growth opportunities, and meaningful enterprise technology work.",
    canonical: siteUrl("/careers"),
    ogTitle: "Careers at Axiolink Systems",
    ogDescription:
      "Build your career at a leading software company in Pakistan. Open roles in engineering, AI, design, and more.",
  },
  blog: {
    title:
      "Technology Blog | AI, Cloud, Cybersecurity & Software Development Insights",
    description:
      "Expert articles on AI development, generative AI, SaaS, cloud infrastructure, cybersecurity, React development, DevOps, and digital transformation from Axiolink Systems.",
    canonical: siteUrl("/blog"),
  },
  contact: {
    title: "Contact Axiolink Systems | IT Consulting & Software Development",
    description:
      "Contact Axiolink Systems for custom software development, AI solutions, mobile apps, cloud consulting, and enterprise technology partnerships. Based in Lahore, Pakistan.",
    canonical: siteUrl("/contact"),
  },
  bulandParwaz: {
    title: "Buland Parwaz Program | Professional Tech Training Pakistan",
    description:
      "Industry-aligned bootcamps and courses in frontend development, React, JavaScript, and professional skills through the Buland Parwaz training program by Axiolink Systems.",
    canonical: siteUrl("/buland-parwaz"),
  },
  verifyCertificate: {
    title: "Verify Certificate | Buland Parwaz Program",
    description:
      "Verify the authenticity of Buland Parwaz Program certificates issued by Axiolink Systems (Pvt) Ltd.",
    canonical: siteUrl("/verify-certificate"),
  },
  privacy: {
    title: "Privacy Policy | Axiolink Systems (Pvt) Ltd.",
    description:
      "Learn how Axiolink Systems collects, uses, and protects your personal information across our website, services, and training programs.",
    canonical: siteUrl("/legal/privacy"),
  },
  terms: {
    title: "Terms of Service | Axiolink Systems (Pvt) Ltd.",
    description:
      "Read the Terms of Service governing your use of Axiolink Systems website, enterprise solutions, internships, and Buland Parwaz training programs.",
    canonical: siteUrl("/legal/terms"),
  },
};

export const serviceMeta = (service) => ({
  title: `${service.title} Services | Axiolink Systems Pakistan`,
  description:
    service.description ||
    `Professional ${service.title.toLowerCase()} services from Axiolink Systems — custom software, enterprise solutions, and digital transformation for businesses in Pakistan and worldwide.`,
  canonical: siteUrl(`/services/${service.slug}`),
});

export const blogCategoryMeta = (categoryName, categoryId) => ({
  title: `${categoryName} Articles | Axiolink Systems Blog`,
  description: `Browse ${categoryName.toLowerCase()} articles on AI, software engineering, cloud, and digital transformation from Axiolink Systems.`,
  canonical: siteUrl(`/blog/category/${categoryId}`),
});

export const blogTagMeta = (tag) => ({
  title: `${tag} | Axiolink Systems Blog`,
  description: `Articles tagged "${tag}" covering software development, AI, and enterprise technology from Axiolink Systems.`,
  canonical: siteUrl(`/blog/tag/${encodeURIComponent(tag)}`),
});

export const blogPostMeta = (post) => ({
  title: `${post.seoTitle || post.title} | Axiolink Systems Blog`,
  description: post.seoDescription || post.excerpt,
  ogTitle: post.seoTitle || post.title,
  ogDescription: post.seoDescription || post.excerpt,
  ogImage: post.featuredImage || DEFAULT_OG_IMAGE,
  ogType: "article",
  canonical: siteUrl(`/blog/${post.slug}`),
});

export const jobMeta = (job) => ({
  title: `${job.title} | Careers | Axiolink Systems`,
  description: job.description?.slice(0, 160) || `Apply for ${job.title} at Axiolink Systems in Pakistan.`,
  canonical: siteUrl(`/careers/jobs/${job.slug}`),
});

export const internshipMeta = (internship) => ({
  title: `${internship.title} | Careers | Axiolink Systems`,
  description:
    internship.description?.slice(0, 160) ||
    `Apply for ${internship.title} internship at Axiolink Systems.`,
  canonical: siteUrl(`/careers/${internship.slug}`),
});

export const courseMeta = (course, courseId) => ({
  title: `${course.title} | Buland Parwaz Program`,
  description:
    course.shortDescription ||
    (typeof course.fullDescription === "string"
      ? course.fullDescription.slice(0, 160)
      : "Professional technology training course by Axiolink Systems."),
  canonical: siteUrl(`/buland-parwaz/course/${courseId}`),
});

/** SEO keyword themes woven naturally into service copy (reference only). */
export const KEYWORD_THEMES = [
  "software development",
  "web development",
  "mobile app development",
  "AI development",
  "machine learning",
  "generative AI",
  "business automation",
  "custom software",
  "React development",
  "Node.js",
  "full stack development",
  "game development",
  "cloud solutions",
  "SaaS development",
  "UI UX design",
  "cybersecurity",
  "IT consulting",
  "digital transformation",
  "enterprise software",
  "startup MVP development",
];
