const API_BASE = import.meta.env.VITE_API_URL || "";

export async function submitEnrollment(data) {
  const response = await fetch(`${API_BASE}/api/courses/enroll`, {
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
