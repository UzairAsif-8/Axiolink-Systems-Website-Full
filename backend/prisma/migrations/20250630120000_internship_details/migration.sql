-- AlterTable
ALTER TABLE "Internship" ADD COLUMN IF NOT EXISTS "location" TEXT;
ALTER TABLE "Internship" ADD COLUMN IF NOT EXISTS "workingHours" TEXT;
ALTER TABLE "Internship" ADD COLUMN IF NOT EXISTS "joiningDate" TEXT;
