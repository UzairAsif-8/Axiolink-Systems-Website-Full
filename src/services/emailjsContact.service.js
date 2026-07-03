import emailjs from "@emailjs/browser";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

/** @typedef {{ name: string; email: string; subject: string; message: string }} ContactEmailFields */

export function isEmailJsConfigured() {
  return Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);
}

function assertEmailJsConfigured() {
  if (!isEmailJsConfigured()) {
    throw new Error("EMAILJS_NOT_CONFIGURED");
  }
}

/**
 * Maps form fields (name, email, …) to EmailJS template variables.
 * Template expects: from_name, from_email, subject, message, time
 *
 * @param {ContactEmailFields} data
 * @returns {{ from_name: string; from_email: string; subject: string; message: string; time: string }}
 */
export function buildEmailJsPayload(data) {
  return {
    from_name: data.name,
    from_email: data.email,
    subject: data.subject,
    message: data.message,
    time: new Date().toLocaleString(),
  };
}

/**
 * @param {ContactEmailFields} data
 */
export async function sendContactEmail(data) {
  assertEmailJsConfigured();

  return emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    buildEmailJsPayload(data),
    { publicKey: PUBLIC_KEY }
  );
}
