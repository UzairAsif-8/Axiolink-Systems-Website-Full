const API_BASE = import.meta.env.VITE_API_URL || "";

function unwrap(json) {
  if (json?.success && json.data !== undefined) return json.data;
  return json;
}

/** GET /api/jobs */
export async function fetchJobs() {
  const response = await fetch(`${API_BASE}/api/jobs`);
  if (!response.ok) throw new Error("Failed to fetch jobs");
  const json = await response.json();
  return { data: unwrap(json) };
}

/** Published jobs open for applications. */
export function getOpenJobs(apiResult) {
  const list = apiResult?.data ?? apiResult ?? [];
  return Array.isArray(list) ? list : [];
}

/** GET /api/jobs/:slug */
export async function fetchJobBySlug(slug) {
  const response = await fetch(`${API_BASE}/api/jobs/${encodeURIComponent(slug)}`);
  if (!response.ok) throw new Error("Job not found");
  const json = await response.json();
  return { data: unwrap(json) };
}

export function buildJobApplicationPayload(data, resumeFile) {
  const payload = {
    fullName: data.fullName,
    email: data.email,
    phone: data.phone,
    currentCity: data.currentCity,
    linkedin: data.linkedin || null,
    githubPortfolio: data.githubPortfolio || null,
    jobPosition: data.jobPosition,
    jobTitle: data.jobTitle || data.jobPosition,
    university: data.university || null,
    degree: data.degree || null,
    graduationYear: data.graduationYear || null,
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

/** POST /api/job/apply */
export async function submitJobApplication({ formData }) {
  const response = await fetch(`${API_BASE}/api/job/apply`, {
    method: "POST",
    body: formData,
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || "Application submission failed");
  }
  return result;
}
