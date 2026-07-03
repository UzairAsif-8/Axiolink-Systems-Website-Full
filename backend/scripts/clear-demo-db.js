import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { clearAllData } from "../prisma/seed/clear.js";

const prisma = new PrismaClient();

async function main() {
  if (!process.env.DATABASE_URL?.trim()) {
    console.error("DATABASE_URL not set — cannot clear database.");
    process.exit(1);
  }
  console.log("\n⚠️  Clearing ALL data from Neon PostgreSQL...\n");
  await clearAllData(prisma);
  console.log("\n✅ Database is empty. Schema and migrations are unchanged.");
  console.log("   Super Admin login still works via ADMIN_EMAIL in .env\n");
}

main()
  .catch((e) => {
    console.error("Clear failed:", e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
