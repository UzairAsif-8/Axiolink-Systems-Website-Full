import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import { env } from "../config/env.js";

const ALLOWED_MIME = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const DOCUMENT_MIME = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

let cloudinaryConfigured = false;

function configureCloudinary() {
  if (cloudinaryConfigured) return;
  if (env.uploadProvider === "cloudinary" && env.cloudinary.cloudName) {
    cloudinary.config({
      cloud_name: env.cloudinary.cloudName,
      api_key: env.cloudinary.apiKey,
      api_secret: env.cloudinary.apiSecret,
      secure: true,
    });
    cloudinaryConfigured = true;
  }
}

export function isCloudinaryEnabled() {
  configureCloudinary();
  return cloudinaryConfigured;
}

/** PDFs and Word docs use `raw` on Cloudinary so browsers can open/download them reliably. */
function cloudinaryResourceType(mimetype) {
  if (DOCUMENT_MIME.has(mimetype)) return "raw";
  if (mimetype?.startsWith("image/")) return "image";
  return "auto";
}

export function validateMimeType(mimetype) {
  if (!mimetype || !ALLOWED_MIME.has(mimetype)) {
    const err = new Error(`File type not allowed: ${mimetype || "unknown"}`);
    err.statusCode = 400;
    throw err;
  }
}

export async function uploadFile(file, { folder = "axiolink", req } = {}) {
  validateMimeType(file.mimetype);

  if (env.uploadProvider === "cloudinary") {
    configureCloudinary();
    if (!cloudinaryConfigured) {
      throw new Error(
        "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET."
      );
    }

    const resourceType = cloudinaryResourceType(file.mimetype);
    const ext = path.extname(file.originalname || "") || "";

    const result = await cloudinary.uploader.upload(file.path, {
      folder,
      resource_type: resourceType,
      type: "upload",
      use_filename: true,
      unique_filename: true,
      ...(resourceType === "raw" && ext ? { format: ext.replace(/^\./, "") } : {}),
    });

    try {
      fs.unlinkSync(file.path);
    } catch {
      /* ignore cleanup errors */
    }

    return {
      url: result.secure_url,
      publicId: result.public_id,
      fileSize: result.bytes,
      mimeType: file.mimetype,
      fileName: file.originalname,
    };
  }

  const base =
    env.publicBaseUrl ||
    (req ? `${req.protocol}://${req.get("host")}` : "");
  const url = `${String(base).replace(/\/$/, "")}/uploads/${file.filename}`;
  return {
    url,
    publicId: null,
    fileSize: file.size,
    mimeType: file.mimetype,
    fileName: file.originalname,
  };
}

export async function deleteUploadedFile(publicId, { mimeType } = {}) {
  if (!publicId || env.uploadProvider !== "cloudinary") return;
  configureCloudinary();
  if (!cloudinaryConfigured) return;
  try {
    const resourceType = mimeType ? cloudinaryResourceType(mimeType) : "image";
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (err) {
    console.warn("Cloudinary delete failed:", err.message);
  }
}

/** Virus scan hook — integrate ClamAV or cloud scanner in production */
export async function virusScanHook(_filePath) {
  return { clean: true };
}
