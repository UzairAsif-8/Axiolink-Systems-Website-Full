import { apiUrl } from "./config.js";

export async function submitEnrollment(data) {
  const response = await fetch(apiUrl("courses/enroll"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Enrollment failed");
  }

  return result;
}
