import { asyncHandler, success, paginated } from "../utils/helpers.js";
import { internService } from "../services/intern.service.js";

export const listAdmin = asyncHandler(async (req, res) => {
  const { data, meta } = await internService.listAdmin(req.query);
  paginated(res, data, meta);
});

export const getById = asyncHandler(async (req, res) => {
  const item = await internService.getById(req.params.id);
  success(res, item);
});

export const updateStatus = asyncHandler(async (req, res) => {
  const item = await internService.updateStatus(req.params.id, req.body.status, req.user, req.ip);
  success(res, item);
});
