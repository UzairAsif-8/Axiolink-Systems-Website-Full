import { Router } from "express";
import * as auth from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.js";
import { canAccessAdmin } from "../middleware/roles.js";

const router = Router();

router.post("/login", auth.login);
router.post("/refresh", auth.refresh);
router.post("/logout", auth.logout);
router.get("/me", authenticate, auth.me);
router.post("/change-password", authenticate, canAccessAdmin, auth.changePassword);

export default router;
