import { Router } from "express";
import * as application from "../controllers/application.controller.js";
import { uploadResume } from "../middleware/upload.js";
import { authenticate } from "../middleware/auth.js";
import { canAccessAdmin } from "../middleware/roles.js";

const router = Router();

router.post("/internship/apply", uploadResume, application.submitInternship);
router.post("/job/apply", uploadResume, application.submitJob);

const admin = Router();
admin.use(authenticate, canAccessAdmin);
admin.get("/", application.listAdmin);
admin.get("/export/csv", application.exportCsv);
admin.get("/:id", application.getById);
admin.patch("/:id/status", application.updateStatus);
admin.patch("/:id/certificate", application.markCertificate);
admin.post("/:id/notes", application.addNote);
admin.delete("/:id", application.remove);

export { router as publicRouter, admin as adminRouter };
