import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { seedReference } from "./seed/reference.js";
import { seedRecruitment } from "./seed/recruitment.js";
import { seedEducation } from "./seed/education.js";
import { seedEmployees } from "./seed/employees.js";
import { seedContent } from "./seed/content.js";
import { seedSystem } from "./seed/system.js";

const prisma = new PrismaClient();

async function main() {
  if (!process.env.DATABASE_URL?.trim()) {
    console.log("\nSkipping database seed — DATABASE_URL not set.");
    console.log("Demo data is served from backend/data/demo-data.json when USE_DEMO_DATA=true.\n");
    return;
  }

  console.log("Seeding Axiolink production database...\n");

  await seedReference(prisma);
  const recruitment = await seedRecruitment(prisma);
  const education = await seedEducation(prisma);
  await seedEmployees(prisma);
  await seedContent(prisma);
  await seedSystem(prisma, recruitment, education);

  console.log("\n✅ Full seed complete — database is ready for production demo.\n");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
