/** Buland Parwaz certificate records — edit names and add entries here */
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
];

export const findCertificateByCode = (code) => {
  const normalized = code?.trim().toUpperCase();
  if (!normalized) return null;

  return (
    certificates.find(
      (record) =>
        record.certificateCode.toUpperCase() === normalized && record.isValid
    ) ?? null
  );
};
