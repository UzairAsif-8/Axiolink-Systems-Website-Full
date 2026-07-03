import { Router } from "express";
import * as dashboard from "../controllers/dashboard.controller.js";
import { authenticate } from "../middleware/auth.js";
import { canViewDashboard } from "../middleware/roles.js";

const router = Router();
router.use(authenticate, canViewDashboard);

router.get("/stats", dashboard.getStats);
router.get("/search", dashboard.globalSearch);
router.get("/notifications", dashboard.getNotifications);
router.patch("/notifications/:id/read", dashboard.markNotificationRead);
router.patch("/notifications/read-all", dashboard.markAllNotificationsRead);
router.delete("/notifications/:id", dashboard.deleteNotification);

export default router;
