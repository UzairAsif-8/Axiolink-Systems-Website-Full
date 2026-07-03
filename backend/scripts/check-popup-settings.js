import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const rows = await prisma.siteSetting.findMany({
  where: { key: "recruitment_popups" },
});

console.log(JSON.stringify(rows, null, 2));

await prisma.$disconnect();
