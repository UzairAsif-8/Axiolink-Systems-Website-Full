import { writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const env = loadEnv("production", root, "");
const SITE_URL = (env.VITE_SITE_URL || "https://www.axiolinksystems.com").replace(
  /\/$/,
  ""
);
const API_BASE = (env.VITE_API_URL || "").replace(/\/$/, "");

const STATIC_ROUTES = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/about", priority: "0.8", changefreq: "monthly" },
  { path: "/services", priority: "0.9", changefreq: "weekly" },
  { path: "/careers", priority: "0.8", changefreq: "weekly" },
  { path: "/blog", priority: "0.9", changefreq: "daily" },
  { path: "/contact", priority: "0.8", changefreq: "monthly" },
  { path: "/buland-parwaz", priority: "0.8", changefreq: "weekly" },
  { path: "/verify-certificate", priority: "0.6", changefreq: "monthly" },
  { path: "/legal/privacy", priority: "0.3", changefreq: "yearly" },
  { path: "/legal/terms", priority: "0.3", changefreq: "yearly" },
];

const BLOG_CATEGORY_IDS = [
  "technology",
  "business",
  "security",
  "cloud",
  "leadership",
];

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toIsoDate(value) {
  if (!value) return new Date().toISOString().slice(0, 10);
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? new Date().toISOString().slice(0, 10)
    : date.toISOString().slice(0, 10);
}

function absoluteUrl(path) {
  if (!path.startsWith("/")) return `${SITE_URL}/${path}`;
  return `${SITE_URL}${path}`;
}

async function fetchApi(path) {
  if (!API_BASE) return null;

  try {
    const response = await fetch(`${API_BASE}/api/${path}`);
    if (!response.ok) return null;
    const json = await response.json();
    return json.data ?? json;
  } catch {
    return null;
  }
}

function buildEntry({ loc, lastmod, changefreq = "monthly", priority = "0.5" }) {
  return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

async function collectUrls() {
  const today = new Date().toISOString().slice(0, 10);
  const urls = [];

  for (const route of STATIC_ROUTES) {
    urls.push({
      loc: absoluteUrl(route.path),
      lastmod: today,
      changefreq: route.changefreq,
      priority: route.priority,
    });
  }

  const { services } = await import("../src/data/services.js");
  for (const service of services) {
    urls.push({
      loc: absoluteUrl(`/services/${service.slug}`),
      lastmod: today,
      changefreq: "monthly",
      priority: "0.8",
    });
  }

  const { courses } = await import("../src/data/bulandParwazCourses.js");
  for (const course of courses) {
    urls.push({
      loc: absoluteUrl(`/buland-parwaz/course/${course.id}`),
      lastmod: today,
      changefreq: "monthly",
      priority: "0.7",
    });
  }

  for (const categoryId of BLOG_CATEGORY_IDS) {
    urls.push({
      loc: absoluteUrl(`/blog/category/${categoryId}`),
      lastmod: today,
      changefreq: "weekly",
      priority: "0.6",
    });
  }

  let blogs = await fetchApi("blogs");
  if (!Array.isArray(blogs) || blogs.length === 0) {
    try {
      const { blogArticles } = await import(
        "../backend/scripts/blog-articles/index.js"
      );
      blogs = blogArticles;
    } catch {
      blogs = [];
    }
  }

  for (const post of blogs) {
    if (!post?.slug) continue;
    urls.push({
      loc: absoluteUrl(`/blog/${post.slug}`),
      lastmod: toIsoDate(post.updatedAt || post.publishedAt),
      changefreq: "monthly",
      priority: "0.7",
    });

    for (const tag of post.tags || []) {
      if (!tag) continue;
      urls.push({
        loc: absoluteUrl(`/blog/tag/${encodeURIComponent(tag)}`),
        lastmod: toIsoDate(post.updatedAt || post.publishedAt),
        changefreq: "weekly",
        priority: "0.5",
      });
    }
  }

  const apiCourses = await fetchApi("courses");
  if (Array.isArray(apiCourses)) {
    for (const course of apiCourses) {
      const slug = course.slug || course.id;
      if (!slug) continue;
      urls.push({
        loc: absoluteUrl(`/buland-parwaz/course/${slug}`),
        lastmod: toIsoDate(course.updatedAt),
        changefreq: "monthly",
        priority: "0.7",
      });
    }
  }

  const jobs = await fetchApi("jobs");
  if (Array.isArray(jobs)) {
    for (const job of jobs) {
      if (!job?.slug) continue;
      urls.push({
        loc: absoluteUrl(`/careers/jobs/${job.slug}`),
        lastmod: toIsoDate(job.updatedAt),
        changefreq: "weekly",
        priority: "0.7",
      });
    }
  }

  const internships = await fetchApi("internships");
  if (Array.isArray(internships)) {
    for (const internship of internships) {
      if (!internship?.slug) continue;
      urls.push({
        loc: absoluteUrl(`/careers/${internship.slug}`),
        lastmod: toIsoDate(internship.updatedAt),
        changefreq: "weekly",
        priority: "0.7",
      });
    }
  }

  const seen = new Set();
  return urls.filter((entry) => {
    if (seen.has(entry.loc)) return false;
    seen.add(entry.loc);
    return true;
  });
}

function buildXml(urls) {
  const body = urls.map(buildEntry).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}

export async function generateSitemap({ outDir = "dist" } = {}) {
  const outputDir = resolve(root, outDir);

  if (!existsSync(outputDir)) {
    throw new Error(`Build output directory not found: ${outputDir}`);
  }

  const urls = await collectUrls();
  const xml = buildXml(urls);
  const outputPath = resolve(outputDir, "sitemap.xml");

  writeFileSync(outputPath, xml, "utf8");
  console.log(`[sitemap] Wrote ${urls.length} URLs to ${outputPath}`);

  return { outputPath, urlCount: urls.length };
}

const isDirectRun = process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  generateSitemap().catch((error) => {
    console.error("[sitemap] Generation failed:", error);
    process.exit(1);
  });
}
