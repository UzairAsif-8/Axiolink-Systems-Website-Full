import { Link } from "react-router-dom";
import {
  Briefcase,
  Calendar,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  MapPin,
  Clock,
  Trash2,
  UserCheck,
  XCircle,
} from "lucide-react";
import { formatWorkMode } from "../constants/applications";

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

const initials = (name) =>
  (name || "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const avatarColors = [
  "from-emerald-500 to-teal-600",
  "from-blue-500 to-indigo-600",
  "from-violet-500 to-purple-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
];

const avatarColor = (name) => avatarColors[(name?.charCodeAt(0) || 0) % avatarColors.length];

const MetaChip = ({ icon: Icon, children }) => (
  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-white/80 text-slate-600 border border-slate-200/80 shadow-sm">
    {Icon && <Icon className="w-3 h-3 text-slate-400 shrink-0" />}
    {children}
  </span>
);

const ActiveInternCard = ({
  app,
  internshipId,
  isPending,
  onComplete,
  onWithdraw,
  onDelete,
  applicantLink,
}) => (
  <article className="group relative flex flex-col rounded-2xl border border-emerald-100/90 bg-gradient-to-br from-white via-white to-emerald-50/60 shadow-sm hover:shadow-md hover:border-emerald-200/90 transition-all duration-200 overflow-hidden">
    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500" />

    <button
      type="button"
      disabled={isPending}
      onClick={() => onDelete(app)}
      className="absolute top-3.5 right-3.5 p-1.5 rounded-lg text-slate-300 opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-50 transition-all"
      title="Remove intern"
    >
      <Trash2 className="w-4 h-4" />
    </button>

    <div className="p-5 pb-4">
      <div className="flex items-start gap-3.5">
        <div className="relative shrink-0">
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${avatarColor(app.fullName)} flex items-center justify-center text-white font-semibold text-sm shadow-md`}
          >
            {initials(app.fullName)}
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-sm" title="Active" />
        </div>

        <div className="min-w-0 flex-1 pr-6">
          <Link
            to={applicantLink(app, internshipId)}
            className="font-semibold text-slate-900 hover:text-emerald-700 transition-colors line-clamp-1"
          >
            {app.fullName}
          </Link>
          <p className="text-xs text-slate-400 mt-0.5 truncate">{app.email}</p>
          {(app.degree || app.university) && (
            <p className="flex items-center gap-1 text-xs text-slate-500 mt-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">
                {[app.degree, app.university].filter(Boolean).join(" · ")}
              </span>
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 p-3.5 rounded-xl bg-white/70 border border-emerald-100/60">
        <div className="flex items-start gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-100/80 shrink-0">
            <Briefcase className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 leading-snug">
              {app.internshipTitle || "Internship"}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {app.internshipDepartment && (
                <MetaChip icon={MapPin}>{app.internshipDepartment}</MetaChip>
              )}
              {app.internshipDuration && (
                <MetaChip icon={Clock}>{app.internshipDuration}</MetaChip>
              )}
              {app.internshipWorkMode && (
                <MetaChip>{formatWorkMode(app.internshipWorkMode)}</MetaChip>
              )}
            </div>
          </div>
        </div>
      </div>

      {app.skills?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {app.skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600"
            >
              {skill}
            </span>
          ))}
          {app.skills.length > 4 && (
            <span className="px-2 py-0.5 rounded-md text-[11px] font-medium text-slate-400">
              +{app.skills.length - 4}
            </span>
          )}
        </div>
      )}

      <p className="flex items-center gap-1.5 mt-3.5 text-xs text-slate-500">
        <Calendar className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
        {formatDate(app.internshipStartedAt || app.intern?.startDate || app.activeInternAt)}
        {(app.intern?.endDate || app.internshipEndDate) && (
          <span className="text-slate-400">
            {" · Ends "}
            {formatDate(app.intern?.endDate || app.internshipEndDate)}
          </span>
        )}
      </p>
    </div>

    <div className="mt-auto px-4 py-3.5 bg-slate-50/80 border-t border-emerald-100/60 flex flex-wrap items-center gap-2">
      <button
        type="button"
        disabled={isPending}
        onClick={() => onComplete(app)}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm hover:shadow transition-all disabled:opacity-50"
      >
        <CheckCircle2 className="w-3.5 h-3.5" />
        Mark completed
      </button>
      <button
        type="button"
        disabled={isPending}
        onClick={() => onWithdraw(app)}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:border-red-200 hover:text-red-600 hover:bg-red-50 transition-all disabled:opacity-50"
      >
        <XCircle className="w-3.5 h-3.5" />
        Withdraw
      </button>
      <Link
        to={applicantLink(app, internshipId)}
        className="ml-auto inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium text-emerald-700 hover:bg-emerald-50 transition-colors"
      >
        View profile
        <ChevronRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  </article>
);

const ActiveInternsPanel = ({
  interns = [],
  internshipId,
  isPending,
  onComplete,
  onWithdraw,
  onDelete,
  applicantLink,
}) => {
  if (!interns.length) {
    return (
      <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4">
          <UserCheck className="w-7 h-7 text-emerald-500" />
        </div>
        <p className="text-sm font-medium text-slate-700">No active interns yet</p>
        <p className="text-xs text-slate-500 mt-1 max-w-xs">
          Approve applicants from the pipeline above to start tracking them here.
        </p>
      </div>
    );
  }

  return (
    <div className="p-5">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {interns.map((app) => (
          <ActiveInternCard
            key={app.id}
            app={app}
            internshipId={internshipId}
            isPending={isPending}
            onComplete={onComplete}
            onWithdraw={onWithdraw}
            onDelete={onDelete}
            applicantLink={applicantLink}
          />
        ))}
      </div>
    </div>
  );
};

export default ActiveInternsPanel;
