import app from "./app.js";
import { env } from "./config/env.js";

const start = async () => {
  if (env.useDemoData) {
    console.log("✓ Demo data mode — serving from backend/data/demo-data.json");
  } else if (!env.isDatabaseConfigured) {
    if (env.nodeEnv === "production") {
      console.error("\n❌ DATABASE_URL is required in production.\n");
      process.exit(1);
    }
    console.warn("\n⚠️  DATABASE_URL not set — API will run in auth-only mode (Super Admin login works).");
    console.warn("   Add your Neon connection string to backend/.env when ready.\n");
  } else {
    console.log("✓ Database URL configured");
  }

  if (env.uploadProvider === "cloudinary") {
    const { isCloudinaryEnabled } = await import("./services/upload.service.js");
    if (isCloudinaryEnabled()) {
      console.log(`✓ File uploads → Cloudinary (${env.cloudinary.cloudName})`);
    } else {
      console.warn("⚠️ UPLOAD_PROVIDER=cloudinary but Cloudinary is not configured");
    }
  } else {
    console.warn("⚠️ File uploads → local disk (not persistent on Render)");
  }

  if (!env.admin.email || !env.admin.passwordHash) {
    console.warn("⚠️  Set ADMIN_EMAIL and ADMIN_PASSWORD_HASH in backend/.env");
    console.warn("   Generate hash: node scripts/hash-password.js YourPassword\n");
  }

  const host = env.nodeEnv === "production" ? "0.0.0.0" : undefined;

  app.listen(env.port, host, () => {
    const base =
      env.nodeEnv === "production"
        ? `port ${env.port}`
        : `http://localhost:${env.port}`;

    console.log(`✓ Axiolink API → ${base}`);
    console.log(`✓ Health check → /api/health`);
    console.log(`✓ Allowed CORS origins → ${env.clientUrls.join(", ")}`);
    if (env.admin.email) console.log(`✓ Super Admin email → ${env.admin.email}`);
  });
};

start();
