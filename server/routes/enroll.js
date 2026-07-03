import { Router } from "express";
import { randomUUID } from "crypto";
import db from "../db.js";

const router = Router();

router.post("/", (req, res) => {
  const { name, email, phone, course_id, course_title } = req.body;

  if (!name?.trim() || !email?.trim() || !course_id?.trim()) {
    return res.status(400).json({
      success: false,
      message: "Name, email, and course are required",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email address",
    });
  }

  const id = randomUUID();
  const created_at = new Date().toISOString();

  db.prepare(
    `INSERT INTO enrollments (id, name, email, phone, course_id, course_title, created_at)
     VALUES (@id, @name, @email, @phone, @course_id, @course_title, @created_at)`
  ).run({
    id,
    name: name.trim(),
    email: email.trim(),
    phone: phone?.trim() || null,
    course_id: course_id.trim(),
    course_title: course_title?.trim() || course_id.trim(),
    created_at,
  });

  return res.status(201).json({
    success: true,
    message: "Enrollment submitted successfully",
    enrollment: { id, name: name.trim(), email: email.trim(), course_id },
  });
});

export default router;
