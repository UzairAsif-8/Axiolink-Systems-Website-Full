import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { canAccessAdmin } from "../middleware/roles.js";
import { getOverview } from "../controllers/records.controller.js";

const router = Router();
router.use(authenticate, canAccessAdmin);
router.get("/overview", getOverview);

export default router;
