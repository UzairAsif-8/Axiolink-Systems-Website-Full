/** Certificate code pattern: XXXX-XX-XXXX-XXXX-XXX (17 alphanumeric chars). */
export const CERT_CODE_PLACEHOLDER = "XXXX-XX-XXXX-XXXX-XXX";
export const CERT_CODE_RAW_LENGTH = 17;
export const CERT_CODE_PATTERN =
  /^[A-Z0-9]{4}-[A-Z0-9]{2}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{3}$/;

/** Group lengths for XXXX-XX-XXXX-XXXX-XXX */
const SEGMENTS = [4, 2, 4, 4, 3];

/** Strip to uppercase alphanumeric (optionally capped for input). */
export function stripCertificateCode(value, { maxLength = CERT_CODE_RAW_LENGTH } = {}) {
  const cleaned = String(value || "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase();
  return maxLength == null ? cleaned : cleaned.slice(0, maxLength);
}

/**
 * Auto-format to XXXX-XX-XXXX-XXXX-XXX as the user types.
 * Accepts input with or without dashes. Caps at 17 body chars.
 */
export function formatCertificateCode(value) {
  const raw = stripCertificateCode(value);
  if (!raw) return "";

  const parts = [];
  let offset = 0;
  for (const len of SEGMENTS) {
    if (raw.length <= offset) break;
    parts.push(raw.slice(offset, offset + len));
    offset += len;
  }
  return parts.join("-");
}

/** Display helper — formats standard 17-char codes; leaves legacy codes intact. */
export function displayCertificateCode(value) {
  const trimmed = String(value || "").trim();
  if (!trimmed) return "";
  if (CERT_CODE_PATTERN.test(trimmed.toUpperCase())) return trimmed.toUpperCase();
  const raw = stripCertificateCode(trimmed, { maxLength: null });
  if (raw.length === CERT_CODE_RAW_LENGTH) return formatCertificateCode(raw);
  return trimmed.toUpperCase();
}

/** True when the code has a full 17-character body (with or without dashes). */
export function isCompleteCertificateCode(value) {
  return stripCertificateCode(value).length === CERT_CODE_RAW_LENGTH;
}
