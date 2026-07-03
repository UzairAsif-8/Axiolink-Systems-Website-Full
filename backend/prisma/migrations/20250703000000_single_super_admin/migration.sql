-- Remove Department module; use text department fields only; clean auth/RBAC demo data

-- Copy department names onto employees before dropping FK
ALTER TABLE "Employee" ADD COLUMN IF NOT EXISTS "department" TEXT;
UPDATE "Employee" e
SET "department" = d."name"
FROM "Department" d
WHERE e."departmentId" = d."id" AND e."department" IS NULL;

-- Drop department foreign keys and columns
ALTER TABLE "Internship" DROP CONSTRAINT IF EXISTS "Internship_departmentId_fkey";
ALTER TABLE "Internship" DROP COLUMN IF EXISTS "departmentId";

ALTER TABLE "Employee" DROP CONSTRAINT IF EXISTS "Employee_departmentId_fkey";
ALTER TABLE "Employee" DROP COLUMN IF EXISTS "departmentId";

DROP TABLE IF EXISTS "Department";

-- Remove demo admin users and RBAC seed data
DELETE FROM "PasswordResetToken";
DELETE FROM "RefreshToken";
DELETE FROM "RolePermission";
DELETE FROM "Permission";
DELETE FROM "User";
