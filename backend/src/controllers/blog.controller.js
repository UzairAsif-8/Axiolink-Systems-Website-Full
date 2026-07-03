import prisma from "../config/database.js";
import { asyncHandler, success, paginated, parsePagination, slugify, ApiError } from "../utils/helpers.js";
import { z } from "zod";

const blogSchema = z.object({
  title: z.string().min(3),
  slug: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.string().min(10),
  featuredImage: z.string().optional().nullable(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  author: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
});

const SITE_URL = process.env.SITE_URL || "https://axiolinksystems.com";

const publicSelect = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  content: true,
  featuredImage: true,
  category: true,
  tags: true,
  author: true,
  publishedAt: true,
  createdAt: true,
  seoTitle: true,
  seoDescription: true,
};

export const listPublic = asyncHandler(async (req, res) => {
  const { category, tag } = req.query;
  const where = { deletedAt: null, status: "PUBLISHED" };
  if (category) where.category = { equals: String(category), mode: "insensitive" };
  if (tag) where.tags = { has: String(tag) };

  const data = await prisma.blogPost.findMany({
    where,
    orderBy: { publishedAt: "desc" },
    select: publicSelect,
  });
  success(res, data);
});

export const listCategories = asyncHandler(async (_req, res) => {
  const posts = await prisma.blogPost.findMany({
    where: { deletedAt: null, status: "PUBLISHED" },
    select: { category: true },
  });
  const counts = posts.reduce((acc, p) => {
    const key = (p.category || "technology").toLowerCase();
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  success(res, counts);
});

export const listTags = asyncHandler(async (_req, res) => {
  const posts = await prisma.blogPost.findMany({
    where: { deletedAt: null, status: "PUBLISHED" },
    select: { tags: true },
  });
  const counts = {};
  for (const p of posts) {
    for (const tag of p.tags || []) {
      counts[tag] = (counts[tag] || 0) + 1;
    }
  }
  success(res, counts);
});

export const rssFeed = asyncHandler(async (_req, res) => {
  const posts = await prisma.blogPost.findMany({
    where: { deletedAt: null, status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    take: 50,
    select: {
      title: true,
      slug: true,
      excerpt: true,
      author: true,
      publishedAt: true,
      category: true,
    },
  });

  const items = posts
    .map((p) => {
      const pubDate = (p.publishedAt || new Date()).toUTCString();
      const link = `${SITE_URL}/blog/${p.slug}`;
      return `<item>
  <title><![CDATA[${p.title}]]></title>
  <link>${link}</link>
  <guid isPermaLink="true">${link}</guid>
  <pubDate>${pubDate}</pubDate>
  <author>${p.author || "Axiolink Team"}</author>
  <category>${p.category || "technology"}</category>
  <description><![CDATA[${p.excerpt || ""}]]></description>
</item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>Axiolink Systems Blog</title>
  <link>${SITE_URL}/blog</link>
  <description>Enterprise technology insights on AI, cloud, security, and software engineering from Axiolink Systems (Pvt) Ltd.</description>
  <language>en-us</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  <atom:link href="${SITE_URL}/api/blogs/feed/rss.xml" rel="self" type="application/rss+xml"/>
${items}
</channel>
</rss>`;

  res.set("Content-Type", "application/rss+xml; charset=utf-8");
  res.send(xml);
});

export const sitemap = asyncHandler(async (_req, res) => {
  const posts = await prisma.blogPost.findMany({
    where: { deletedAt: null, status: "PUBLISHED" },
    select: { slug: true, updatedAt: true, publishedAt: true },
    orderBy: { publishedAt: "desc" },
  });

  const staticPages = [
    "",
    "/about",
    "/services",
    "/careers",
    "/blog",
    "/contact",
    "/buland-parwaz",
    "/legal/privacy",
    "/legal/terms",
  ];

  const urls = [
    ...staticPages.map((path) => ({
      loc: `${SITE_URL}${path}`,
      lastmod: new Date().toISOString().split("T")[0],
      changefreq: path === "" ? "weekly" : "monthly",
      priority: path === "" ? "1.0" : "0.8",
    })),
    ...posts.map((p) => ({
      loc: `${SITE_URL}/blog/${p.slug}`,
      lastmod: (p.updatedAt || p.publishedAt || new Date()).toISOString().split("T")[0],
      changefreq: "monthly",
      priority: "0.7",
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  res.set("Content-Type", "application/xml; charset=utf-8");
  res.send(xml);
});

export const getBySlugPublic = asyncHandler(async (req, res) => {
  const item = await prisma.blogPost.findFirst({
    where: { slug: req.params.slug, deletedAt: null, status: "PUBLISHED" },
  });
  if (!item) throw new ApiError(404, "Post not found");
  success(res, item);
});

export const listAdmin = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const where = { deletedAt: null };
  const [data, total] = await prisma.$transaction([
    prisma.blogPost.findMany({ where, skip, take: limit, orderBy: { updatedAt: "desc" } }),
    prisma.blogPost.count({ where }),
  ]);
  paginated(res, data, { page, limit, total, pages: Math.ceil(total / limit) });
});

export const create = asyncHandler(async (req, res) => {
  const body = blogSchema.parse(req.body);
  const slug = body.slug || slugify(body.title);
  const item = await prisma.blogPost.create({
    data: {
      ...body,
      slug,
      publishedAt: body.status === "PUBLISHED" ? new Date() : null,
    },
  });
  success(res, item, 201);
});

export const update = asyncHandler(async (req, res) => {
  const body = blogSchema.partial().parse(req.body);
  const item = await prisma.blogPost.update({
    where: { id: req.params.id },
    data: {
      ...body,
      ...(body.status === "PUBLISHED" && { publishedAt: new Date() }),
    },
  });
  success(res, item);
});

export const remove = asyncHandler(async (req, res) => {
  await prisma.blogPost.update({
    where: { id: req.params.id },
    data: { deletedAt: new Date(), status: "ARCHIVED" },
  });
  success(res, { message: "Post archived" });
});
