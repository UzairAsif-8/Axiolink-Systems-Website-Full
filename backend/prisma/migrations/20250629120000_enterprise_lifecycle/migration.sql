-- Enterprise lifecycle schema alignment

-- ApplicationStatus enum extensions
ALTER TYPE "ApplicationStatus" ADD VALUE IF NOT EXISTS 'INTERNSHIP_STARTED';
ALTER TYPE "ApplicationStatus" ADD VALUE IF NOT EXISTS 'INTERNSHIP_COMPLETED';
ALTER TYPE "ApplicationStatus" ADD VALUE IF NOT EXISTS 'CERTIFICATE_ISSUED';
ALTER TYPE "ApplicationStatus" ADD VALUE IF NOT EXISTS 'WITHDRAWN';

-- EnrollmentStatus enum
CREATE TYPE "EnrollmentStatus" AS ENUM ('NEW', 'ACTIVE', 'COMPLETED', 'WITHDRAWN');

-- DocumentType extensions
ALTER TYPE "DocumentType" ADD VALUE IF NOT EXISTS 'OFFER_LETTER';
ALTER TYPE "DocumentType" ADD VALUE IF NOT EXISTS 'NDA';
ALTER TYPE "DocumentType" ADD VALUE IF NOT EXISTS 'INTERNSHIP_LETTER';
ALTER TYPE "DocumentType" ADD VALUE IF NOT EXISTS 'EXPERIENCE_LETTER';

-- Application lifecycle fields
ALTER TABLE "Application" ADD COLUMN IF NOT EXISTS "activeInternAt" TIMESTAMP(3);
ALTER TABLE "Application" ADD COLUMN IF NOT EXISTS "internshipStartedAt" TIMESTAMP(3);
ALTER TABLE "Application" ADD COLUMN IF NOT EXISTS "internshipCompletedAt" TIMESTAMP(3);
ALTER TABLE "Application" ADD COLUMN IF NOT EXISTS "withdrawnAt" TIMESTAMP(3);
ALTER TABLE "Application" ADD COLUMN IF NOT EXISTS "certificateIssued" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Application" ADD COLUMN IF NOT EXISTS "certificateIssuedAt" TIMESTAMP(3);
ALTER TABLE "Application" ADD COLUMN IF NOT EXISTS "certificateId" UUID;
ALTER TABLE "Application" ADD COLUMN IF NOT EXISTS "currentStage" TEXT;
ALTER TABLE "Application" ADD COLUMN IF NOT EXISTS "remarks" TEXT;
ALTER TABLE "Application" ADD COLUMN IF NOT EXISTS "updatedById" UUID;

CREATE UNIQUE INDEX IF NOT EXISTS "Application_certificateId_key" ON "Application"("certificateId");
CREATE INDEX IF NOT EXISTS "Application_certificateIssued_idx" ON "Application"("certificateIssued");
CREATE INDEX IF NOT EXISTS "Application_updatedById_idx" ON "Application"("updatedById");

-- ApplicationStatusHistory
CREATE TABLE IF NOT EXISTS "ApplicationStatusHistory" (
    "id" UUID NOT NULL,
    "applicationId" UUID NOT NULL,
    "fromStatus" "ApplicationStatus",
    "toStatus" "ApplicationStatus" NOT NULL,
    "changedById" UUID,
    "changedByName" TEXT,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ApplicationStatusHistory_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "ApplicationStatusHistory_applicationId_idx" ON "ApplicationStatusHistory"("applicationId");
CREATE INDEX IF NOT EXISTS "ApplicationStatusHistory_createdAt_idx" ON "ApplicationStatusHistory"("createdAt");

ALTER TABLE "ApplicationStatusHistory" DROP CONSTRAINT IF EXISTS "ApplicationStatusHistory_applicationId_fkey";
ALTER TABLE "ApplicationStatusHistory" ADD CONSTRAINT "ApplicationStatusHistory_applicationId_fkey"
    FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ApplicationStatusHistory" DROP CONSTRAINT IF EXISTS "ApplicationStatusHistory_changedById_fkey";
ALTER TABLE "ApplicationStatusHistory" ADD CONSTRAINT "ApplicationStatusHistory_changedById_fkey"
    FOREIGN KEY ("changedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Application" DROP CONSTRAINT IF EXISTS "Application_updatedById_fkey";
ALTER TABLE "Application" ADD CONSTRAINT "Application_updatedById_fkey"
    FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Employee extended fields
ALTER TABLE "Employee" ADD COLUMN IF NOT EXISTS "cnic" TEXT;
ALTER TABLE "Employee" ADD COLUMN IF NOT EXISTS "address" TEXT;
ALTER TABLE "Employee" ADD COLUMN IF NOT EXISTS "emergencyContact" TEXT;
ALTER TABLE "Employee" ADD COLUMN IF NOT EXISTS "emergencyPhone" TEXT;
ALTER TABLE "Employee" ADD COLUMN IF NOT EXISTS "designation" TEXT;
ALTER TABLE "Employee" ADD COLUMN IF NOT EXISTS "trainingDate" TIMESTAMP(3);
ALTER TABLE "Employee" ADD COLUMN IF NOT EXISTS "probationEndDate" TIMESTAMP(3);
ALTER TABLE "Employee" ADD COLUMN IF NOT EXISTS "leavingDate" TIMESTAMP(3);
ALTER TABLE "Employee" ADD COLUMN IF NOT EXISTS "salary" DECIMAL(12,2);
ALTER TABLE "Employee" ADD COLUMN IF NOT EXISTS "notes" TEXT;

CREATE INDEX IF NOT EXISTS "Employee_cnic_idx" ON "Employee"("cnic");

-- EmployeeDocument extended fields
ALTER TABLE "EmployeeDocument" ADD COLUMN IF NOT EXISTS "fileName" TEXT;
ALTER TABLE "EmployeeDocument" ADD COLUMN IF NOT EXISTS "uploadedById" UUID;

CREATE INDEX IF NOT EXISTS "EmployeeDocument_uploadedById_idx" ON "EmployeeDocument"("uploadedById");

ALTER TABLE "EmployeeDocument" DROP CONSTRAINT IF EXISTS "EmployeeDocument_uploadedById_fkey";
ALTER TABLE "EmployeeDocument" ADD CONSTRAINT "EmployeeDocument_uploadedById_fkey"
    FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Enrollment lifecycle fields
ALTER TABLE "Enrollment" ADD COLUMN IF NOT EXISTS "status" "EnrollmentStatus" NOT NULL DEFAULT 'NEW';
ALTER TABLE "Enrollment" ADD COLUMN IF NOT EXISTS "startedAt" TIMESTAMP(3);
ALTER TABLE "Enrollment" ADD COLUMN IF NOT EXISTS "completedAt" TIMESTAMP(3);
ALTER TABLE "Enrollment" ADD COLUMN IF NOT EXISTS "withdrawnAt" TIMESTAMP(3);
ALTER TABLE "Enrollment" ADD COLUMN IF NOT EXISTS "certificateIssued" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Enrollment" ADD COLUMN IF NOT EXISTS "certificateIssuedAt" TIMESTAMP(3);
ALTER TABLE "Enrollment" ADD COLUMN IF NOT EXISTS "progressPercentage" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Enrollment" ADD COLUMN IF NOT EXISTS "attendancePercentage" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Enrollment" ADD COLUMN IF NOT EXISTS "remarks" TEXT;
ALTER TABLE "Enrollment" ADD COLUMN IF NOT EXISTS "updatedById" UUID;

CREATE INDEX IF NOT EXISTS "Enrollment_status_idx" ON "Enrollment"("status");
CREATE INDEX IF NOT EXISTS "Enrollment_updatedById_idx" ON "Enrollment"("updatedById");

ALTER TABLE "Enrollment" DROP CONSTRAINT IF EXISTS "Enrollment_updatedById_fkey";
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_updatedById_fkey"
    FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- EnrollmentStatusHistory
CREATE TABLE IF NOT EXISTS "EnrollmentStatusHistory" (
    "id" UUID NOT NULL,
    "enrollmentId" UUID NOT NULL,
    "fromStatus" "EnrollmentStatus",
    "toStatus" "EnrollmentStatus" NOT NULL,
    "changedById" UUID,
    "changedByName" TEXT,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EnrollmentStatusHistory_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "EnrollmentStatusHistory_enrollmentId_idx" ON "EnrollmentStatusHistory"("enrollmentId");
CREATE INDEX IF NOT EXISTS "EnrollmentStatusHistory_createdAt_idx" ON "EnrollmentStatusHistory"("createdAt");

ALTER TABLE "EnrollmentStatusHistory" DROP CONSTRAINT IF EXISTS "EnrollmentStatusHistory_enrollmentId_fkey";
ALTER TABLE "EnrollmentStatusHistory" ADD CONSTRAINT "EnrollmentStatusHistory_enrollmentId_fkey"
    FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "EnrollmentStatusHistory" DROP CONSTRAINT IF EXISTS "EnrollmentStatusHistory_changedById_fkey";
ALTER TABLE "EnrollmentStatusHistory" ADD CONSTRAINT "EnrollmentStatusHistory_changedById_fkey"
    FOREIGN KEY ("changedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Certificate extended fields
ALTER TABLE "Certificate" ADD COLUMN IF NOT EXISTS "certificateNumber" TEXT;
ALTER TABLE "Certificate" ADD COLUMN IF NOT EXISTS "expiryDate" TIMESTAMP(3);
ALTER TABLE "Certificate" ADD COLUMN IF NOT EXISTS "issuedById" UUID;
ALTER TABLE "Certificate" ADD COLUMN IF NOT EXISTS "templateVersion" TEXT DEFAULT 'v1';
ALTER TABLE "Certificate" ADD COLUMN IF NOT EXISTS "pdfUrl" TEXT;
ALTER TABLE "Certificate" ADD COLUMN IF NOT EXISTS "pdfPublicId" TEXT;
ALTER TABLE "Certificate" ADD COLUMN IF NOT EXISTS "qrCode" TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS "Certificate_certificateNumber_key" ON "Certificate"("certificateNumber");
CREATE INDEX IF NOT EXISTS "Certificate_certificateNumber_idx" ON "Certificate"("certificateNumber");
CREATE INDEX IF NOT EXISTS "Certificate_issuedById_idx" ON "Certificate"("issuedById");

ALTER TABLE "Certificate" DROP CONSTRAINT IF EXISTS "Certificate_issuedById_fkey";
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_issuedById_fkey"
    FOREIGN KEY ("issuedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Application" DROP CONSTRAINT IF EXISTS "Application_certificateId_fkey";
ALTER TABLE "Application" ADD CONSTRAINT "Application_certificateId_fkey"
    FOREIGN KEY ("certificateId") REFERENCES "Certificate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AuditLog extended fields
ALTER TABLE "AuditLog" ADD COLUMN IF NOT EXISTS "module" TEXT;
ALTER TABLE "AuditLog" ADD COLUMN IF NOT EXISTS "userAgent" TEXT;

CREATE INDEX IF NOT EXISTS "AuditLog_module_idx" ON "AuditLog"("module");
