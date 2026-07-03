import { apiUrl } from "./config.js";

function unwrap(json) {
  if (json?.success && json.data !== undefined) return json.data;
  return json;
}

/** GET /api/internships */
export async function fetchInternships() {
  const response = await fetch(apiUrl("internships"));
  if (!response.ok) throw new Error("Failed to fetch internships");
  const json = await response.json();
  return { data: unwrap(json) };
}

/** Published internships open for applications (from public API). */
export function getOpenInternships(apiResult) {
  const list = apiResult?.data ?? apiResult ?? [];
  return Array.isArray(list) ? list : [];
}

/** GET /api/internships/:slug */
export async function fetchInternshipBySlug(slug) {
  const response = await fetch(apiUrl(`internships/${encodeURIComponent(slug)}`));
  if (!response.ok) throw new Error("Internship not found");
  const json = await response.json();
  return { data: unwrap(json) };
}

export function buildApplicationPayload(data, resumeFile) {
  const payload = {
    fullName: data.fullName,
    email: data.email,
    phone: data.phone,
    currentCity: data.currentCity,
    linkedin: data.linkedin || null,
    githubPortfolio: data.githubPortfolio || null,
    internshipPosition: data.internshipPosition,
    internshipTitle: data.internshipTitle || data.internshipPosition,
    university: data.university,
    degree: data.degree,
    semester: data.semester || null,
    graduationYear: data.graduationYear,
    skills: data.skills || [],
    whyJoin: data.whyJoin,
    proudProject: data.proudProject || null,
    portfolioWebsite: data.portfolioWebsite || null,
    availableStartDate: data.availableStartDate || null,
    submittedAt: new Date().toISOString(),
  };

  const formData = new FormData();
  formData.append("application", JSON.stringify(payload));
  if (resumeFile) formData.append("resume", resumeFile);

  return { payload, formData };
}

/** POST /api/internship/apply */
export async function submitInternshipApplication({ formData }) {
  const response = await fetch(apiUrl("internship/apply"), {
    method: "POST",
    body: formData,
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || "Application submission failed");
  }
  return result;
}
