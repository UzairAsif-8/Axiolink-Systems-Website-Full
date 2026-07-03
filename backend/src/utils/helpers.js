export class ApiError extends Error {
  constructor(statusCode, message, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;
  }
}

export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export const success = (res, data, statusCode = 200, message = null) => {
  const body = { success: true, data };
  if (message) body.message = message;
  return res.status(statusCode).json(body);
};

export const paginated = (res, data, meta, message = null) => {
  const body = { success: true, data, meta };
  if (message) body.message = message;
  return res.json(body);
};

export const parsePagination = (query) => {
  const page = Math.max(1, parseInt(query.page || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(query.limit || "20", 10)));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

export const slugify = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const sanitizeString = (str) =>
  typeof str === "string" ? str.trim().replace(/<[^>]*>/g, "") : str;

export const isEnvSuperAdmin = (user) => user?.isEnvSuperAdmin === true;

export const SUPER_ADMIN_ROLE = "SUPER_ADMIN";
