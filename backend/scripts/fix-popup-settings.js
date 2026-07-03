import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const row = await prisma.siteSetting.findUnique({
  where: { key: "recruitment_popups" },
});

const value = {
  internships: true,
  jobs: true,
  internshipsEnabledAt: Date.now(),
  jobsEnabledAt: Date.now(),
  ...(row?.value && typeof row.value === "object" ? row.value : {}),
  internships: row?.value?.internships ?? true,
  jobs: row?.value?.jobs ?? true,
};

if (!value.internshipsEnabledAt) value.internshipsEnabledAt = Date.now();
if (!value.jobsEnabledAt) value.jobsEnabledAt = Date.now();

await prisma.siteSetting.upsert({
  where: { key: "recruitment_popups" },
  create: { key: "recruitment_popups", value },
  update: { value },
});

console.log("Updated recruitment_popups:", JSON.stringify(value, null, 2));

await prisma.$disconnect();
