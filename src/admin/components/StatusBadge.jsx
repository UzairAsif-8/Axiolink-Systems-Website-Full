const styles = {
  NEW: "bg-blue-50 text-blue-700 ring-blue-600/20",
  UNDER_REVIEW: "bg-amber-50 text-amber-700 ring-amber-600/20",
  SHORTLISTED: "bg-violet-50 text-violet-700 ring-violet-600/20",
  INTERVIEW_SCHEDULED: "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
  SELECTED: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  INTERNSHIP_COMPLETED: "bg-violet-50 text-violet-700 ring-violet-600/20",
  ACTIVE: "bg-blue-50 text-blue-700 ring-blue-600/20",
  COMPLETED: "bg-violet-50 text-violet-700 ring-violet-600/20",
  WITHDRAWN: "bg-slate-100 text-slate-500 ring-slate-500/20",
  REJECTED: "bg-red-50 text-red-700 ring-red-600/20",
  PUBLISHED: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  DRAFT: "bg-slate-100 text-slate-600 ring-slate-500/20",
  ARCHIVED: "bg-slate-100 text-slate-500 ring-slate-500/20",
  READ: "bg-slate-100 text-slate-600 ring-slate-500/20",
  PAID: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  PENDING: "bg-amber-50 text-amber-700 ring-amber-600/20",
  PARTIAL: "bg-orange-50 text-orange-700 ring-orange-600/20",
};

const labels = {
  SELECTED: "Approved",
  INTERNSHIP_COMPLETED: "Completed",
  UNDER_REVIEW: "In Review",
  INTERVIEW_SCHEDULED: "Interview",
  NEW: "New",
  SHORTLISTED: "Shortlisted",
  ACTIVE: "Active",
  COMPLETED: "Completed",
  WITHDRAWN: "Withdrawn",
  REJECTED: "Rejected",
};

const StatusBadge = ({ status, className = "" }) => {
  const label = labels[status] || (status || "").replace(/_/g, " ");
  const style = styles[status] || "bg-slate-100 text-slate-600 ring-slate-500/20";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ring-1 ring-inset capitalize ${style} ${className}`}
    >
      {label}
    </span>
  );
};

export default StatusBadge;
