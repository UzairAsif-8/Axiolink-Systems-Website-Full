import { Router } from "express";
import * as employee from "../controllers/employee.controller.js";
import { authenticate } from "../middleware/auth.js";
import { canAccessAdmin } from "../middleware/roles.js";

export const employeeAdmin = Router();
employeeAdmin.use(authenticate, canAccessAdmin);
employeeAdmin.get("/", employee.listAdmin);
employeeAdmin.get("/:id", employee.getById);
employeeAdmin.post("/", employee.create);
employeeAdmin.put("/:id", employee.update);
employeeAdmin.delete("/:id", employee.remove);
employeeAdmin.post("/:id/documents", employee.addDocument);
