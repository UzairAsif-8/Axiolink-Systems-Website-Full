const API_BASE = import.meta.env.VITE_API_URL || "";

async function parseJson(res) {
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Request failed");
  return json.data ?? json;
}

export async function fetchPublicCourses() {
  const res = await fetch(`${API_BASE}/api/courses`);
  return parseJson(res);
}

export async function fetchPublicCourseBySlug(slug) {
  const res = await fetch(`${API_BASE}/api/courses/${slug}`);
  return parseJson(res);
}

export async function fetchPublicBlogs(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const url = qs ? `${API_BASE}/api/blogs?${qs}` : `${API_BASE}/api/blogs`;
  const res = await fetch(url);
  return parseJson(res);
}

export async function fetchPublicBlogBySlug(slug) {
  const res = await fetch(`${API_BASE}/api/blogs/${slug}`);
  return parseJson(res);
}

export async function fetchPublicSettings() {
  const res = await fetch(`${API_BASE}/api/settings`);
  return parseJson(res);
}
