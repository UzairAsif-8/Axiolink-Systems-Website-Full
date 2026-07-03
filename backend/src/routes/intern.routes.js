import { Router } from "express";
import * as intern from "../controllers/intern.controller.js";
import { authenticate } from "../middleware/auth.js";
import { requirePermission } from "../middleware/permissions.js";

const admin = Router();
admin.use(authenticate);
admin.get("/", requirePermission("applications.read"), intern.listAdmin);
admin.get("/:id", requirePermission("applications.read"), intern.getById);
admin.patch("/:id/status", requirePermission("applications.write"), intern.updateStatus);

export default admin;
