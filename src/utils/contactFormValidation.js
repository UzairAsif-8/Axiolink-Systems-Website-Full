export const EMPTY_CONTACT_FORM = {
  name: "",
  email: "",
  company: "",
  phone: "",
  subject: "",
  message: "",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function sanitizeContactForm(data) {
  return {
    name: (data.name ?? "").trim(),
    email: (data.email ?? "").trim(),
    company: (data.company ?? "").trim(),
    phone: (data.phone ?? "").trim(),
    subject: (data.subject ?? "").trim(),
    message: (data.message ?? "").trim(),
  };
}

export function validateContactForm(data) {
  const sanitized = sanitizeContactForm(data);
  const errors = {};

  if (!sanitized.name) {
    errors.name = "Full name is required.";
  } else if (sanitized.name.length < 2) {
    errors.name = "Please enter your full name.";
  }

  if (!sanitized.email) {
    errors.email = "Email is required.";
  } else if (!EMAIL_REGEX.test(sanitized.email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!sanitized.subject) {
    errors.subject = "Subject is required.";
  }

  if (!sanitized.message) {
    errors.message = "Message is required.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    sanitized,
  };
}
