const API_BASE = import.meta.env.VITE_API_URL || "";

/** Verify certificate via backend API */
export async function verifyCertificate(code) {
  const trimmed = code?.trim();
  if (!trimmed) {
    return { valid: false, message: "Please enter a certificate code." };
  }

  const response = await fetch(
    `${API_BASE}/api/certificate/verify/${encodeURIComponent(trimmed)}`
  );
  const result = await response.json();

  if (response.ok && result.valid) {
    return {
      valid: true,
      certificate: {
        ...result.certificate,
        issueDate:
          typeof result.certificate.issueDate === "string"
            ? result.certificate.issueDate.slice(0, 10)
            : result.certificate.issueDate,
      },
    };
  }

  return {
    valid: false,
    message: result.message || "Certificate not found.",
  };
}
