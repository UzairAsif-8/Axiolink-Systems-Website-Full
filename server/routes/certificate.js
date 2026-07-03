import { Router } from "express";
import db from "../db.js";

const router = Router();

router.get("/verify/:code", (req, res) => {
  const code = req.params.code?.trim();

  if (!code) {
    return res.status(400).json({
      valid: false,
      message: "Certificate code is required",
    });
  }

  const certificate = db
    .prepare(
      "SELECT student_name, course_name, certificate_code, issue_date, is_valid FROM certificates WHERE certificate_code = ?"
    )
    .get(code);

  if (!certificate || !certificate.is_valid) {
    return res.status(404).json({
      valid: false,
      message: "Certificate not found or invalid",
    });
  }

  return res.json({
    valid: true,
    certificate: {
      student_name: certificate.student_name,
      course_name: certificate.course_name,
      certificate_code: certificate.certificate_code,
      issue_date: certificate.issue_date,
    },
  });
});

export default router;
