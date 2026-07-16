/** Certificate code pattern: XXXX-XX-XXXX-XXX (13 alphanumeric chars). */
export const CERT_CODE_PLACEHOLDER = "XXXX-XX-XXXX-XXX";
export const CERT_CODE_RAW_LENGTH = 13;
export const CERT_CODE_PATTERN = /^[A-Z0-9]{4}-[A-Z0-9]{2}-[A-Z0-9]{4}-[A-Z0-9]{3}$/;

/** Strip to uppercase alphanumeric (optionally capped at 13 for input). */
export function stripCertificateCode(value, { maxLength = CERT_CODE_RAW_LENGTH } = {}) {
  const cleaned = String(value || "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase();
  return maxLength == null ? cleaned : cleaned.slice(0, maxLength);
}

/**
 * Auto-format to XXXX-XX-XXXX-XXX as the user types.
 * Accepts input with or without dashes. Caps at 13 body chars.
 */
export function formatCertificateCode(value) {
  const raw = stripCertificateCode(value);
  const parts = [];
  if (raw.length > 0) parts.push(raw.slice(0, 4));
  if (raw.length > 4) parts.push(raw.slice(4, 6));
  if (raw.length > 6) parts.push(raw.slice(6, 10));
  if (raw.length > 10) parts.push(raw.slice(10, 13));
  return parts.join("-");
}

/** Display helper — formats standard 13-char codes; leaves legacy codes intact. */
export function displayCertificateCode(value) {
  const trimmed = String(value || "").trim();
  if (!trimmed) return "";
  if (CERT_CODE_PATTERN.test(trimmed.toUpperCase())) return trimmed.toUpperCase();
  const raw = stripCertificateCode(trimmed, { maxLength: null });
  if (raw.length === CERT_CODE_RAW_LENGTH) return formatCertificateCode(raw);
  return trimmed.toUpperCase();
}

/** True when the code has a full 13-character body (with or without dashes). */
export function isCompleteCertificateCode(value) {
  return stripCertificateCode(value).length === CERT_CODE_RAW_LENGTH;
}
