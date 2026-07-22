import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";
import { env } from "./config/env.js";
import { corsOptions } from "./config/cors.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

import authRoutes from "./routes/auth.routes.js";
import { publicRouter as internshipPublic, adminRouter as internshipAdmin } from "./routes/internship.routes.js";
import { publicRouter as applicationPublic, adminRouter as applicationAdmin } from "./routes/application.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import {
  messagePublic,
  messageAdmin,
  coursePublic,
  courseAdmin,
  certificatePublic,
  certificateAdmin,
} from "./routes/public.routes.js";
import {
  blogPublic,
  blogAdmin,
  teamPublic,
  teamAdmin,
  jobPublic,
  jobAdmin,
  newsletterPublic,
  newsletterAdmin,
  settingsPublic,
  settingsAdmin,
} from "./routes/cms.routes.js";
import {
  employeeAdmin,
} from "./routes/organization.routes.js";
import demoAdmin, { demoPublicRoutes } from "./routes/demo.routes.js";
import internAdmin from "./routes/intern.routes.js";
import recordsRoutes from "./routes/records.routes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// Required behind Render/reverse proxies for rate limiting and secure cookies.
if (env.nodeEnv === "production") {
  app.set("trust proxy", 1);
}

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors(corsOptions));
app.use(morgan(env.nodeEnv === "development" ? "dev" : "combined"));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"), {
    fallthrough: true,
  })
);
app.use("/uploads", (req, res) => {
  res.status(404).json({
    success: false,
    message:
      "File not found. Local uploads on Render are deleted after redeploys. Re-upload or enable Cloudinary (UPLOAD_PROVIDER=cloudinary).",
  });
});

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300 });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30 });
app.use("/api", limiter);
app.use("/api/auth/login", authLimiter);

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uploadProvider: env.uploadProvider,
    cloudinaryConfigured: Boolean(
      env.cloudinary.cloudName && env.cloudinary.apiKey && env.cloudinary.apiSecret
    ),
  });
});

// Public API
app.use("/api/auth", authRoutes);

if (env.useDemoData) {
  app.use("/api/internships", demoPublicRoutes.internships);
  app.use("/api/courses", demoPublicRoutes.courses);
  app.use("/api/blogs", demoPublicRoutes.blogs);
  app.use("/api/certificate", demoPublicRoutes.certificate);
  app.use("/api/settings", demoPublicRoutes.settings);
  app.use("/api/admin", demoAdmin);
} else {
  app.use("/api/internships", internshipPublic);
  app.use("/api", applicationPublic);
  app.use("/api", messagePublic);
  app.use("/api/courses", coursePublic);
  app.use("/api/certificate", certificatePublic);
  app.use("/api/blogs", blogPublic);
  app.use("/api/team", teamPublic);
  app.use("/api/jobs", jobPublic);
  app.use("/api/newsletter", newsletterPublic);
  app.use("/api/settings", settingsPublic);

  // Admin API
  app.use("/api/admin/dashboard", dashboardRoutes);
  app.use("/api/admin/internships", internshipAdmin);
  app.use("/api/admin/applications", applicationAdmin);
  app.use("/api/admin/messages", messageAdmin);
  app.use("/api/admin/courses", courseAdmin);
  app.use("/api/admin/certificates", certificateAdmin);
  app.use("/api/admin/blogs", blogAdmin);
  app.use("/api/admin/team", teamAdmin);
  app.use("/api/admin/jobs", jobAdmin);
  app.use("/api/admin/newsletter", newsletterAdmin);
  app.use("/api/admin/employees", employeeAdmin);
  app.use("/api/admin/interns", internAdmin);
  app.use("/api/admin/records", recordsRoutes);
  app.use("/api/admin/settings", settingsAdmin);
}

app.use(notFound);
app.use(errorHandler);

export default app;
