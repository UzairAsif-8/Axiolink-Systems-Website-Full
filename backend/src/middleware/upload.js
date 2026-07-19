import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { validateMimeType } from "../services/upload.service.js";
import { env } from "../config/env.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, "../../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (_req, file, cb) => {
  try {
    validateMimeType(file.mimetype);
    cb(null, true);
  } catch (err) {
    cb(err, false);
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter,
});

export const uploadResume = upload.single("resume");
export const uploadDocument = upload.single("file");
export const uploadImage = upload.single("image");

export const getLocalFileUrl = (filename, req) => {
  const base =
    env.publicBaseUrl ||
    (req ? `${req.protocol}://${req.get("host")}` : "");
  return `${String(base).replace(/\/$/, "")}/uploads/${filename}`;
};

export { uploadDir };
