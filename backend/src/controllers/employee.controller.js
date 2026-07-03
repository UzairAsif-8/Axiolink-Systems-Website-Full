import { asyncHandler, success, paginated } from "../utils/helpers.js";
import { validate } from "../utils/validate.js";
import { employeeSchema, employeeDocumentSchema } from "../validators/employee.schemas.js";
import { employeeService } from "../services/employee.service.js";

export const listAdmin = asyncHandler(async (req, res) => {
  const { data, meta } = await employeeService.listAdmin(req.query);
  paginated(res, data, meta);
});

export const getById = asyncHandler(async (req, res) => {
  const item = await employeeService.getById(req.params.id);
  success(res, item);
});

export const create = asyncHandler(async (req, res) => {
  const body = validate(employeeSchema, req.body);
  const item = await employeeService.create(body, req.user, req.ip);
  success(res, item, 201, "Employee created successfully");
});

export const update = asyncHandler(async (req, res) => {
  const body = validate(employeeSchema.partial(), req.body);
  const item = await employeeService.update(req.params.id, body, req.user, req.ip);
  success(res, item, 200, "Employee updated successfully");
});

export const remove = asyncHandler(async (req, res) => {
  const result = await employeeService.remove(req.params.id, req.user, req.ip);
  success(res, result, 200, "Employee archived successfully");
});

export const addDocument = asyncHandler(async (req, res) => {
  const body = validate(employeeDocumentSchema, req.body);
  const doc = await employeeService.addDocument(req.params.id, body, req.user, req.ip);
  success(res, doc, 201, "Document added successfully");
});
