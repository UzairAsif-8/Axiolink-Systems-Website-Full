import { Router } from "express";
import * as internship from "../controllers/internship.controller.js";
import { authenticate } from "../middleware/auth.js";
import { canAccessAdmin } from "../middleware/roles.js";

const router = Router();

router.get("/", internship.listPublic);
router.get("/:slug", internship.getBySlugPublic);

const admin = Router();
admin.use(authenticate, canAccessAdmin);
admin.get("/", internship.listAdmin);
admin.get("/:id", internship.getById);
admin.post("/", internship.create);
admin.put("/:id", internship.update);
admin.delete("/:id", internship.remove);
admin.post("/:id/duplicate", internship.duplicate);

export { router as publicRouter, admin as adminRouter };
