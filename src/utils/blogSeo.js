const SITE_URL = "https://axiolinksystems.com";
const ORG_NAME = "Axiolink Systems (Pvt) Ltd.";

export const estimateReadTime = (html = "") => {
  const text = html.replace(/<[^>]+>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(3, Math.ceil(words / 200))} min read`;
};

export const blogCanonical = (slug) => `${SITE_URL}/blog/${slug}`;

export const buildArticleSchema = (post) => {
  if (!post) return null;
  const url = blogCanonical(post.slug);
  const datePublished = post.publishedAt || post.createdAt;
  const dateModified = post.updatedAt || datePublished;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    image: post.featuredImage ? [post.featuredImage] : undefined,
    datePublished,
    dateModified,
    author: {
      "@type": "Person",
      name: post.author || "Axiolink Team",
    },
    publisher: {
      "@type": "Organization",
      name: ORG_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logoTransparent.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    articleSection: post.category,
    keywords: (post.tags || []).join(", "),
  };
};

export const extractFaqsFromHtml = (html = "") => {
  const faqs = [];
  const section = html.match(/<h2[^>]*id="faqs"[^>]*>[\s\S]*$/i);
  if (!section) return faqs;

  const re = /<h3[^>]*>([\s\S]*?)<\/h3>\s*<p[^>]*>([\s\S]*?)<\/p>/gi;
  let m;
  while ((m = re.exec(section[0])) && faqs.length < 10) {
    const q = m[1].replace(/<[^>]+>/g, "").trim();
    const a = m[2].replace(/<[^>]+>/g, "").trim();
    if (q && a) faqs.push({ q, a });
  }
  return faqs;
};

export const buildFaqSchema = (faqs) => {
  if (!faqs?.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: {
        "@type": "Answer",
        text: a,
      },
    })),
  };
};

export const scoreRelatedPost = (post, current) => {
  let score = 0;
  if (post.category === current.category) score += 3;
  const tags = current.tags || [];
  for (const t of post.tags || []) {
    if (tags.includes(t)) score += 2;
  }
  return score;
};

export const BLOG_CATEGORIES = [
  { id: "all", name: "All Posts" },
  { id: "technology", name: "Technology" },
  { id: "business", name: "Business" },
  { id: "security", name: "Security" },
  { id: "cloud", name: "Cloud Computing" },
  { id: "leadership", name: "Leadership" },
];

export const POSTS_PER_PAGE = 9;

export const processInternalLinks = (html = "") =>
  html.replace(
    /<!-- internal: (\/blog\/[\w-]+) -->/g,
    ' <a href="$1" class="text-primary-600 font-medium hover:underline">Related reading →</a>'
  );
