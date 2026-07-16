/** Certificate code pattern: XXXX-XX-XXXX-XXXX-XXX (17 alphanumeric chars). */
export const CERT_CODE_RAW_LENGTH = 17;
export const CERT_CODE_PATTERN =
  /^[A-Z0-9]{4}-[A-Z0-9]{2}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{3}$/;

const SEGMENTS = [4, 2, 4, 4, 3];

export function stripCertificateCode(value, { maxLength = CERT_CODE_RAW_LENGTH } = {}) {
  const cleaned = String(value || "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase();
  return maxLength == null ? cleaned : cleaned.slice(0, maxLength);
}

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

export function displayCertificateCode(value) {
  const trimmed = String(value || "").trim();
  if (!trimmed) return "";
  if (CERT_CODE_PATTERN.test(trimmed.toUpperCase())) return trimmed.toUpperCase();
  const raw = stripCertificateCode(trimmed, { maxLength: null });
  if (raw.length === CERT_CODE_RAW_LENGTH) return formatCertificateCode(raw);
  return trimmed.toUpperCase();
}
