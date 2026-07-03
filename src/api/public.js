import { apiUrl } from "./config.js";

async function parseJson(res) {
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Request failed");
  return json.data ?? json;
}

export async function fetchPublicCourses() {
  const res = await fetch(apiUrl("courses"));
  return parseJson(res);
}

export async function fetchPublicCourseBySlug(slug) {
  const res = await fetch(apiUrl(`courses/${slug}`));
  return parseJson(res);
}

export async function fetchPublicBlogs(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const url = qs ? `${apiUrl("blogs")}?${qs}` : apiUrl("blogs");
  const res = await fetch(url);
  return parseJson(res);
}

export async function fetchPublicBlogBySlug(slug) {
  const res = await fetch(apiUrl(`blogs/${slug}`));
  return parseJson(res);
}

export async function fetchPublicSettings() {
  const res = await fetch(apiUrl("settings"));
  return parseJson(res);
}

export { apiUrl } from "./config.js";
