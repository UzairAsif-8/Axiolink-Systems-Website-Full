import { sendContactEmail, isEmailJsConfigured } from "../services/emailjsContact.service";
import { apiUrl } from "./config.js";

async function saveContactToBackend(data) {
  const response = await fetch(apiUrl("contact"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(result.message || "Failed to save message");
  }

  return response.json();
}

export async function submitContact(data) {
  if (!isEmailJsConfigured()) {
    throw new Error("EMAILJS_NOT_CONFIGURED");
  }

  await sendContactEmail(data);

  try {
    await saveContactToBackend(data);
  } catch {
    // Email delivered; backend persistence is optional.
  }

  return { message: "Message sent" };
}

export async function subscribeNewsletter(email) {
  const response = await fetch(apiUrl("newsletter/subscribe"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Subscription failed");
  }

  return result;
}
