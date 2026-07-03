import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const rows = await prisma.$queryRaw`
  SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename
`;
console.log(rows.map((r) => r.tablename).join("\n"));
await prisma.$disconnect();
