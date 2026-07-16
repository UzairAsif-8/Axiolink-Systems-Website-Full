-- Course completion (Previous Courses on Buland Parwaz)
ALTER TABLE "Course" ADD COLUMN IF NOT EXISTS "isCompleted" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Course" ADD COLUMN IF NOT EXISTS "completedAt" TIMESTAMP(3);

-- Enrollment payment slip upload
ALTER TABLE "Enrollment" ADD COLUMN IF NOT EXISTS "paymentSlipUrl" TEXT;
ALTER TABLE "Enrollment" ADD COLUMN IF NOT EXISTS "paymentSlipPublicId" TEXT;
