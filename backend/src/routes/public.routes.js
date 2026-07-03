import { Router } from "express";
import * as message from "../controllers/message.controller.js";
import * as course from "../controllers/course.controller.js";
import * as certificate from "../controllers/certificate.controller.js";
import { authenticate } from "../middleware/auth.js";
import { canAccessAdmin } from "../middleware/roles.js";
import { uploadImage } from "../middleware/upload.js";

export const messagePublic = Router();
messagePublic.post("/contact", message.submitPublic);

export const messageAdmin = Router();
messageAdmin.use(authenticate, canAccessAdmin);
messageAdmin.get("/", message.listAdmin);
messageAdmin.get("/:id", message.getById);
messageAdmin.patch("/:id", message.updateStatus);
messageAdmin.delete("/:id", message.remove);

export const coursePublic = Router();
coursePublic.get("/", course.listPublic);
coursePublic.get("/:slug", course.getBySlugPublic);
coursePublic.post("/enroll", course.enrollPublic);

export const courseAdmin = Router();
courseAdmin.use(authenticate, canAccessAdmin);
courseAdmin.get("/", course.listAdmin);
courseAdmin.post("/upload-image", uploadImage, course.uploadThumbnail);
courseAdmin.post("/", course.create);
courseAdmin.put("/:id", course.update);
courseAdmin.delete("/:id", course.remove);
courseAdmin.get("/enrollments/list", course.listEnrollments);
courseAdmin.get("/enrollments/export/csv", course.exportEnrollmentsCsv);
courseAdmin.get("/enrollments/:id", course.getEnrollment);
courseAdmin.patch("/enrollments/:id", course.updateEnrollment);
courseAdmin.patch("/enrollments/:id/status", course.updateEnrollmentStatus);
courseAdmin.patch("/enrollments/:id/certificate", course.markEnrollmentCertificate);
courseAdmin.delete("/enrollments/:id", course.deleteEnrollment);
courseAdmin.get("/:id", course.getById);

export const certificatePublic = Router();
certificatePublic.get("/verify/:code", certificate.verifyPublic);

export const certificateAdmin = Router();
certificateAdmin.use(authenticate, canAccessAdmin);
certificateAdmin.get("/export/csv", certificate.exportCsv);
certificateAdmin.get("/", certificate.listAdmin);
certificateAdmin.post("/", certificate.create);
certificateAdmin.post("/:id/revoke", certificate.revoke);
certificateAdmin.delete("/:id", certificate.remove);
