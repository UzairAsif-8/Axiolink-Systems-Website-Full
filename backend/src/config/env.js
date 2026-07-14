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
  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction) {
    const missing = requiredInProduction.filter((key) => !process.env[key]?.trim());

    if (missing.length) {
      console.error("\n❌ Missing required environment variables:\n");

      missing.forEach((key) => {
        console.error(`   • ${key}`);
      });

      console.error(
        "\nPlease configure these variables in your hosting platform (e.g. Render Environment Variables).\n"
      );

      process.exit(1);
    }
  }

  if (
    isProduction &&
    process.env.USE_DEMO_DATA === "true" &&
    process.env.ALLOW_DEMO_IN_PRODUCTION !== "true"
  ) {
    console.error("\n❌ USE_DEMO_DATA=true is not allowed in production.");
    console.error(
      "Set USE_DEMO_DATA=false or explicitly set ALLOW_DEMO_IN_PRODUCTION=true.\n"
    );
    process.exit(1);
  }

  if (!process.env.DATABASE_URL?.trim() && process.env.USE_DEMO_DATA !== "true") {
    console.warn(
      "\n⚠️ DATABASE_URL is missing. Database operations will fail while USE_DEMO_DATA=false.\n"
    );
  }

  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD_HASH) {
    console.warn(
      "\n⚠️ ADMIN_EMAIL or ADMIN_PASSWORD_HASH is missing. Super Admin login will not work."
    );
    console.warn("Generate a password hash using:");
    console.warn("node scripts/hash-password.js YourPassword\n");
  }

  if (process.env.UPLOAD_PROVIDER === "cloudinary") {
    const requiredCloudinary = [
      "CLOUDINARY_CLOUD_NAME",
      "CLOUDINARY_API_KEY",
      "CLOUDINARY_API_SECRET",
    ];

    const missing = requiredCloudinary.filter((key) => !process.env[key]);

    if (missing.length) {
      console.warn(
        `\n⚠️ Cloudinary selected but missing variables:\n   ${missing.join("\n   ")}\n`
      );
    }
  }
}

validateEnv();

const clientUrls = (
  process.env.CLIENT_URL || "http://localhost:3005,http://localhost:5173"
)
  .split(",")
  .map((url) => url.trim())
  .filter(Boolean);

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",

  port: Number(process.env.PORT) || 4000,

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

  // Supports multiple frontend URLs
  clientUrls,

  // First URL for backward compatibility
  clientUrl: clientUrls[0],

  /**
   * Auth cookie SameSite. Use "lax" when the frontend same-origin-proxies `/api`
   * (Vercel rewrite) so mobile browsers keep the session. Use "none" only for
   * true cross-origin frontend → API (often blocked on mobile).
   */
  authCookieSameSite: (() => {
    const value = process.env.AUTH_COOKIE_SAMESITE?.trim().toLowerCase();
    if (value === "lax" || value === "strict" || value === "none") return value;
    return undefined;
  })(),

  authCookieSecure: (() => {
    const value = process.env.AUTH_COOKIE_SECURE?.trim().toLowerCase();
    if (value === "true" || value === "1") return true;
    if (value === "false" || value === "0") return false;
    return undefined;
  })(),

  uploadProvider: process.env.UPLOAD_PROVIDER || "local",

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
};

export const SUPER_ADMIN_ID = "00000000-0000-0000-0000-000000000001";