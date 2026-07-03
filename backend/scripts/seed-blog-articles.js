/**
 * Seed 10 premium SEO blog articles.
 * Run: cd backend && node scripts/seed-blog-articles.js
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { blogArticles } from "./blog-articles/index.js";

const prisma = new PrismaClient();

function publishedDate(offsetDays) {
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);
  d.setHours(10, 0, 0, 0);
  return d;
}

async function main() {
  let created = 0;
  let updated = 0;

  for (const article of blogArticles) {
    const data = {
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content.trim(),
      featuredImage: article.featuredImage,
      category: article.category,
      tags: article.tags,
      author: article.author || "Axiolink Team",
      status: "PUBLISHED",
      publishedAt: publishedDate(article.publishedAtOffsetDays ?? 0),
      seoTitle: article.seoTitle,
      seoDescription: article.seoDescription,
    };

    const existing = await prisma.blogPost.findFirst({
      where: { slug: article.slug, deletedAt: null },
    });

    if (existing) {
      await prisma.blogPost.update({ where: { id: existing.id }, data });
      updated++;
      console.log(`Updated: /blog/${article.slug}`);
    } else {
      await prisma.blogPost.create({ data });
      created++;
      console.log(`Created: /blog/${article.slug}`);
    }
  }

  console.log(`\nDone. Created ${created}, updated ${updated}. Total: ${blogArticles.length} articles.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
