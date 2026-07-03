import { Router } from "express";
import * as blog from "../controllers/blog.controller.js";
import * as team from "../controllers/team.controller.js";
import * as job from "../controllers/job.controller.js";
import * as newsletter from "../controllers/newsletter.controller.js";
import * as settings from "../controllers/settings.controller.js";
import { authenticate } from "../middleware/auth.js";
import { canAccessAdmin } from "../middleware/roles.js";

export const blogPublic = Router();
blogPublic.get("/feed/rss.xml", blog.rssFeed);
blogPublic.get("/meta/sitemap.xml", blog.sitemap);
blogPublic.get("/meta/categories", blog.listCategories);
blogPublic.get("/meta/tags", blog.listTags);
blogPublic.get("/", blog.listPublic);
blogPublic.get("/:slug", blog.getBySlugPublic);

export const blogAdmin = Router();
blogAdmin.use(authenticate, canAccessAdmin);
blogAdmin.get("/", blog.listAdmin);
blogAdmin.post("/", blog.create);
blogAdmin.put("/:id", blog.update);
blogAdmin.delete("/:id", blog.remove);

export const teamPublic = Router();
teamPublic.get("/", team.listPublic);

export const teamAdmin = Router();
teamAdmin.use(authenticate, canAccessAdmin);
teamAdmin.get("/", team.listAdmin);
teamAdmin.post("/", team.create);
teamAdmin.put("/:id", team.update);
teamAdmin.delete("/:id", team.remove);

export const jobPublic = Router();
jobPublic.get("/", job.listPublic);
jobPublic.get("/:slug", job.getBySlugPublic);

export const jobAdmin = Router();
jobAdmin.use(authenticate, canAccessAdmin);
jobAdmin.get("/", job.listAdmin);
jobAdmin.get("/:id", job.getById);
jobAdmin.post("/", job.create);
jobAdmin.put("/:id", job.update);
jobAdmin.delete("/:id", job.remove);

export const newsletterPublic = Router();
newsletterPublic.post("/subscribe", newsletter.subscribePublic);

export const newsletterAdmin = Router();
newsletterAdmin.use(authenticate, canAccessAdmin);
newsletterAdmin.get("/", newsletter.listAdmin);
newsletterAdmin.get("/export/csv", newsletter.exportCsv);
newsletterAdmin.delete("/:id", newsletter.remove);

export const settingsPublic = Router();
settingsPublic.get("/", settings.getPublic);

export const settingsAdmin = Router();
settingsAdmin.use(authenticate, canAccessAdmin);
settingsAdmin.get("/", settings.getAdmin);
settingsAdmin.post("/", settings.upsert);
settingsAdmin.put("/bulk", settings.bulkUpdate);
settingsAdmin.delete("/:key", settings.remove);
