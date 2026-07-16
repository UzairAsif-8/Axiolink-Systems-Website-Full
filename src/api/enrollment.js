import { apiUrl } from "./config.js";

export async function submitEnrollment({ name, email, phone, courseSlug, courseTitle, paymentSlip }) {
  const formData = new FormData();
  formData.append(
    "enrollment",
    JSON.stringify({
      name,
      email,
      phone: phone || undefined,
      courseSlug,
      course_id: courseSlug,
      course_title: courseTitle,
    })
  );
  formData.append("file", paymentSlip);

  const response = await fetch(apiUrl("courses/enroll"), {
    method: "POST",
    body: formData,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Enrollment failed");
  }

  return result.data ?? result;
}
