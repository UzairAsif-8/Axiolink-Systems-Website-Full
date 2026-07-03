import dotenv from "dotenv";

dotenv.config();

const requiredInProduction = [
  "DATABASE_URL",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
  "ADMIN_EMAIL",
  "ADMIN_PASSWORD_HASH",
];

function validateEnv() {
  const missing = requiredInProduction.filter((key) => !process.env[key]);
  if (process.env.NODE_ENV === "production" && missing.length) {
    console.error("\n❌ Missing required environment variables:");
    missing.forEach((k) => console.error(`   - ${k}`));
    console.error("\nCopy backend/.env.example to backend/.env and fill in all values.\n");
    process.exit(1);
  }

  if (
    process.env.NODE_ENV === "production" &&
    process.env.USE_DEMO_DATA === "true" &&
    process.env.ALLOW_DEMO_IN_PRODUCTION !== "true"
  ) {
    console.error("\n❌ USE_DEMO_DATA=true is blocked in production.");
    console.error("   Set USE_DEMO_DATA=false for Neon PostgreSQL, or ALLOW_DEMO_IN_PRODUCTION=true to override.\n");
    process.exit(1);
  }

  if (!process.env.DATABASE_URL?.trim() && process.env.USE_DEMO_DATA !== "true") {
    console.warn("\n⚠️  DATABASE_URL is not set. Database operations will fail when USE_DEMO_DATA=false.\n");
  }

  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD_HASH) {
    console.warn("\n⚠️  ADMIN_EMAIL / ADMIN_PASSWORD_HASH not set. Super Admin login will not work.");
    console.warn("   Generate hash: node scripts/hash-password.js YourPassword\n");
  }

  if (process.env.UPLOAD_PROVIDER === "cloudinary") {
    const cloudMissing = ["CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"].filter(
      (k) => !process.env[k]
    );
    if (cloudMissing.length) {
      console.warn(`\n⚠️  Cloudinary selected but missing: ${cloudMissing.join(", ")}\n`);
    }
  }
}
validateEnv();

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "4000", 10),
  databaseUrl: process.env.DATABASE_URL?.trim() || "",
  isDatabaseConfigured: Boolean(process.env.DATABASE_URL?.trim()),
  useDemoData: process.env.USE_DEMO_DATA === "true",
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpires: process.env.JWT_ACCESS_EXPIRES || "15m",
    refreshExpires: process.env.JWT_REFRESH_EXPIRES || "7d",
  },
  admin: {
    email: process.env.ADMIN_EMAIL?.toLowerCase(),
    passwordHash: process.env.ADMIN_PASSWORD_HASH,
    name: process.env.ADMIN_NAME || "Uzair Asif",
  },
  clientUrl: process.env.CLIENT_URL || "http://localhost:3005",
  uploadProvider: process.env.UPLOAD_PROVIDER || "local",
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
};

export const SUPER_ADMIN_ID = "00000000-0000-0000-0000-000000000001";
