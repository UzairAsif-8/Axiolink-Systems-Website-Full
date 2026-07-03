import { ApiError } from "../utils/helpers.js";

export const errorHandler = (err, _req, res, _next) => {
  if (err.name === "ZodError") {
    const errors = err.errors?.map((e) => ({
      field: e.path?.join(".") || "",
      message: e.message,
    }));
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.errors && { errors: err.errors }),
    });
  }

  if (process.env.NODE_ENV !== "production") {
    console.error("[Error]", err);
  } else {
    console.error("[Error]", err.message);
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};

export const notFound = (_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
};
