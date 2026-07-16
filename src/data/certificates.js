/** Buland Parwaz certificate records — edit names and add entries here */
import {
  displayCertificateCode,
  formatCertificateCode,
  stripCertificateCode,
} from "../utils/certificateCode.js";

export const certificates = [
  {
    id: 1,
    certificateCode: "ASPL-BP-FEDB-2026-001",
    studentName: "Rabia Afzal",
    courseName: "Frontend Development Bootcamp",
    issueDate: "2026-06-22",
    isValid: true,
  },
  {
    id: 2,
    certificateCode: "ASPL-BP-FEDB-2026-002",
    studentName: "Faraz Ahmad",
    courseName: "Frontend Development Bootcamp",
    issueDate: "2026-06-22",
    isValid: true,
  },
  {
    id: 3,
    certificateCode: "ASPL-BP-FEDB-2026-003",
    studentName: "Ahmed Raza Sikandar",
    courseName: "Frontend Development Bootcamp",
    issueDate: "2026-06-22",
    isValid: true,
  },
].map((record) => ({
  ...record,
  certificateCode: displayCertificateCode(record.certificateCode),
}));

export const findCertificateByCode = (code) => {
  const raw = stripCertificateCode(code, { maxLength: null });
  const formatted = formatCertificateCode(code);
  if (!raw) return null;

  return (
    certificates.find((record) => {
      if (!record.isValid) return false;
      const storedRaw = stripCertificateCode(record.certificateCode, {
        maxLength: null,
      });
      return (
        storedRaw === raw ||
        record.certificateCode === formatted ||
        record.certificateCode === String(code || "").trim().toUpperCase()
      );
    }) ?? null
  );
};
