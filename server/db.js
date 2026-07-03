import Database from "better-sqlite3";
import { randomUUID } from "crypto";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, "certificates.db");

const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS certificates (
    id TEXT PRIMARY KEY,
    student_name TEXT NOT NULL,
    course_name TEXT NOT NULL,
    certificate_code TEXT NOT NULL UNIQUE,
    issue_date TEXT NOT NULL,
    is_valid INTEGER NOT NULL DEFAULT 1
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS enrollments (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    course_id TEXT NOT NULL,
    course_title TEXT NOT NULL,
    created_at TEXT NOT NULL
  )
`);

const count = db.prepare("SELECT COUNT(*) as count FROM certificates").get();

if (count.count === 0) {
  const insert = db.prepare(`
    INSERT INTO certificates (id, student_name, course_name, certificate_code, issue_date, is_valid)
    VALUES (@id, @student_name, @course_name, @certificate_code, @issue_date, @is_valid)
  `);

  const seedCertificates = [
    {
      id: randomUUID(),
      student_name: "Ahmed Hassan",
      course_name: "Full-Stack Web Development Bootcamp",
      certificate_code: "BP-2026-0001",
      issue_date: "2026-03-15",
      is_valid: 1,
    },
    {
      id: randomUUID(),
      student_name: "Fatima Khan",
      course_name: "Cloud Architecture & DevOps",
      certificate_code: "BP-2026-0002",
      issue_date: "2026-04-01",
      is_valid: 1,
    },
    {
      id: randomUUID(),
      student_name: "Sample Revoked",
      course_name: "UI/UX Design Workshop",
      certificate_code: "BP-2026-9999",
      issue_date: "2025-12-01",
      is_valid: 0,
    },
  ];

  const insertMany = db.transaction((rows) => {
    for (const row of rows) {
      insert.run(row);
    }
  });

  insertMany(seedCertificates);
}

export default db;
