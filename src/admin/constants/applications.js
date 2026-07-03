export const PIPELINE_STATUSES = [
  { key: "NEW", label: "New" },
  { key: "UNDER_REVIEW", label: "In Review" },
  { key: "SHORTLISTED", label: "Shortlisted" },
  { key: "INTERVIEW_SCHEDULED", label: "Interview" },
  { key: "REJECTED", label: "Rejected" },
];

export const APPLICATION_STATUSES = [
  ...PIPELINE_STATUSES,
  { key: "SELECTED", label: "Approved" },
];

export const LIFECYCLE_STATUSES = [
  { key: "SELECTED", label: "Active Intern" },
  { key: "INTERNSHIP_COMPLETED", label: "Completed" },
  { key: "WITHDRAWN", label: "Withdrawn" },
];

export const ALL_APPLICATION_STATUSES = [
  ...APPLICATION_STATUSES,
  { key: "INTERNSHIP_COMPLETED", label: "Completed" },
  { key: "WITHDRAWN", label: "Withdrawn" },
];

export const PIPELINE_STATUS_KEYS = new Set(PIPELINE_STATUSES.map((s) => s.key));
export const ACTIVE_INTERN_STATUS = "SELECTED";
export const COMPLETED_STATUS = "INTERNSHIP_COMPLETED";
export const WITHDRAWN_STATUS = "WITHDRAWN";

export const getStatusLabel = (key) =>
  ALL_APPLICATION_STATUSES.find((s) => s.key === key)?.label || key?.replace(/_/g, " ") || "Unknown";

export const filterPipelineApplications = (applications) =>
  (applications || []).filter((a) => PIPELINE_STATUS_KEYS.has(a.status));

export const filterActiveInterns = (applications) =>
  (applications || []).filter((a) => a.status === ACTIVE_INTERN_STATUS);

export const filterParticipants = (applications) =>
  (applications || []).filter((a) => a.status === COMPLETED_STATUS);

export const filterWithdrawn = (applications) =>
  (applications || []).filter((a) => a.status === WITHDRAWN_STATUS);

export const groupApplicationsByStatus = (applications) => {
  const groups = Object.fromEntries(PIPELINE_STATUSES.map((s) => [s.key, []]));
  for (const app of applications || []) {
    if (groups[app.status]) groups[app.status].push(app);
  }
  return groups;
};

export const countByStatus = (applications) => {
  const grouped = groupApplicationsByStatus(filterPipelineApplications(applications));
  return Object.fromEntries(
    PIPELINE_STATUSES.map((s) => [s.key, grouped[s.key]?.length || 0])
  );
};

export const formatWorkMode = (mode) => {
  if (!mode) return null;
  return mode.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
};
