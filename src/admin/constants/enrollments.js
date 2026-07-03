export const ENROLLMENT_STATUSES = [
  { key: "NEW", label: "New Enrollment" },
  { key: "ACTIVE", label: "Active" },
  { key: "COMPLETED", label: "Completed" },
  { key: "WITHDRAWN", label: "Withdrawn" },
];

export const PAYMENT_STATUSES = [
  { key: "PENDING", label: "Pending" },
  { key: "PARTIAL", label: "Partial" },
  { key: "PAID", label: "Paid" },
  { key: "REFUNDED", label: "Refunded" },
  { key: "WAIVED", label: "Waived" },
];

export const NEW_STATUS = "NEW";
export const ACTIVE_STATUS = "ACTIVE";
export const COMPLETED_STATUS = "COMPLETED";
export const WITHDRAWN_STATUS = "WITHDRAWN";

export const getEnrollmentStatusLabel = (key) =>
  ENROLLMENT_STATUSES.find((s) => s.key === key)?.label || key?.replace(/_/g, " ") || "Unknown";

export const getPaymentLabel = (key) =>
  PAYMENT_STATUSES.find((s) => s.key === key)?.label || key || "Unknown";

export const filterNewEnrollments = (items) => (items || []).filter((e) => e.status === NEW_STATUS);
export const filterActiveStudents = (items) => (items || []).filter((e) => e.status === ACTIVE_STATUS);
export const filterGraduates = (items) => (items || []).filter((e) => e.status === COMPLETED_STATUS);
export const filterWithdrawnStudents = (items) => (items || []).filter((e) => e.status === WITHDRAWN_STATUS);

export const countNewByPayment = (items) => {
  const news = filterNewEnrollments(items);
  return {
    all: news.length,
    pending: news.filter((e) => e.paymentStatus === "PENDING").length,
    paid: news.filter((e) => e.paymentStatus === "PAID" || e.paymentStatus === "WAIVED").length,
    partial: news.filter((e) => e.paymentStatus === "PARTIAL").length,
  };
};

export const formatPrice = (price) => {
  if (price == null) return null;
  return `Rs. ${Number(price).toLocaleString()}`;
};
