import { apiUrl } from "./config.js";
import {
  displayCertificateCode,
  formatCertificateCode,
} from "../utils/certificateCode.js";

/** Verify certificate via backend API */
export async function verifyCertificate(code) {
  const formatted = formatCertificateCode(code);
  if (!formatted) {
    return { valid: false, message: "Please enter a certificate code." };
  }

  const response = await fetch(
    apiUrl(`certificate/verify/${encodeURIComponent(formatted)}`)
  );
  const result = await response.json();

  if (response.ok && result.valid) {
    return {
      valid: true,
      certificate: {
        ...result.certificate,
        certificateCode: displayCertificateCode(
          result.certificate.certificateCode || formatted
        ),
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
