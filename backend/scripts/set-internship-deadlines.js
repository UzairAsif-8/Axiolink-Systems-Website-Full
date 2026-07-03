import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const deadline = new Date();
deadline.setDate(deadline.getDate() + 14);
deadline.setHours(23, 59, 59, 0);

const result = await prisma.internship.updateMany({
  where: { deletedAt: null },
  data: { deadline },
});

console.log(`Updated ${result.count} internships. Deadline: ${deadline.toISOString().slice(0, 10)}`);

await prisma.$disconnect();
