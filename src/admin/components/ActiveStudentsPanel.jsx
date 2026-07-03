import { Link } from "react-router-dom";
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  GraduationCap,
  Layers,
  Trash2,
  UserCheck,
  XCircle,
} from "lucide-react";
import { formatPrice, getPaymentLabel } from "../constants/enrollments";

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
  "from-blue-500 to-indigo-600",
  "from-violet-500 to-purple-600",
  "from-sky-500 to-cyan-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
];

const avatarColor = (name) => avatarColors[(name?.charCodeAt(0) || 0) % avatarColors.length];

const paymentStyles = {
  PAID: "bg-emerald-50 text-emerald-700 border-emerald-200",
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  PARTIAL: "bg-orange-50 text-orange-700 border-orange-200",
  WAIVED: "bg-blue-50 text-blue-700 border-blue-200",
  REFUNDED: "bg-slate-100 text-slate-600 border-slate-200",
};

const MetaChip = ({ icon: Icon, children }) => (
  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-white/80 text-slate-600 border border-slate-200/80">
    {Icon && <Icon className="w-3 h-3 text-slate-400 shrink-0" />}
    {children}
  </span>
);

const ProgressRing = ({ progress }) => {
  const p = Math.min(100, Math.max(0, progress || 0));
  return (
    <div className="relative w-11 h-11 shrink-0">
      <svg className="w-11 h-11 -rotate-90" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r="15.5" fill="none" stroke="#e2e8f0" strokeWidth="3" />
        <circle
          cx="18"
          cy="18"
          r="15.5"
          fill="none"
          stroke="#2563eb"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${p} 100`}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-blue-700">
        {p}%
      </span>
    </div>
  );
};

const ActiveStudentCard = ({
  student,
  courseId,
  isPending,
  onComplete,
  onWithdraw,
  onDelete,
  studentLink,
}) => (
  <article className="group relative flex flex-col rounded-2xl border border-blue-100/90 bg-gradient-to-br from-white via-white to-blue-50/50 shadow-sm hover:shadow-md hover:border-blue-200/90 transition-all duration-200 overflow-hidden">
    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-500" />

    <button
      type="button"
      disabled={isPending}
      onClick={() => onDelete(student)}
      className="absolute top-3.5 right-3.5 p-1.5 rounded-lg text-slate-300 opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-50 transition-all"
      title="Remove enrollment"
    >
      <Trash2 className="w-4 h-4" />
    </button>

    <div className="p-5 pb-4">
      <div className="flex items-start gap-3.5">
        <div className="relative shrink-0">
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${avatarColor(student.fullName)} flex items-center justify-center text-white font-semibold text-sm shadow-md`}
          >
            {initials(student.fullName)}
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-blue-500 border-2 border-white" title="Active student" />
        </div>

        <div className="min-w-0 flex-1 pr-6">
          <Link
            to={studentLink(student, courseId)}
            className="font-semibold text-slate-900 hover:text-blue-700 transition-colors line-clamp-1"
          >
            {student.fullName}
          </Link>
          <p className="text-xs text-slate-400 mt-0.5 truncate">{student.email}</p>
          {student.phone && <p className="text-xs text-slate-400 truncate">{student.phone}</p>}
        </div>

        <ProgressRing progress={student.progress} />
      </div>

      <div className="mt-4 p-3.5 rounded-xl bg-white/70 border border-blue-100/60">
        <div className="flex items-start gap-2">
          <div className="p-1.5 rounded-lg bg-blue-100/80 shrink-0">
            <BookOpen className="w-4 h-4 text-blue-700" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-900 leading-snug">
              {student.course?.title || "Course"}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {student.courseCategory && <MetaChip icon={Layers}>{student.courseCategory}</MetaChip>}
              {student.courseDuration && <MetaChip icon={Clock}>{student.courseDuration}</MetaChip>}
              {student.courseLevel && <MetaChip icon={GraduationCap}>{student.courseLevel}</MetaChip>}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${
            paymentStyles[student.paymentStatus] || paymentStyles.PENDING
          }`}
        >
          {getPaymentLabel(student.paymentStatus)}
        </span>
        <span className="text-xs text-slate-500">Attendance {student.attendance ?? 0}%</span>
        {student.coursePrice != null && (
          <span className="text-xs text-slate-500">{formatPrice(student.coursePrice)}</span>
        )}
      </div>

      <p className="flex items-center gap-1.5 mt-3 text-xs text-slate-500">
        <Calendar className="w-3.5 h-3.5 text-blue-500 shrink-0" />
        Active since {formatDate(student.activeAt || student.enrollmentDate || student.createdAt)}
      </p>
    </div>

    <div className="mt-auto px-4 py-3.5 bg-slate-50/80 border-t border-blue-100/60 flex flex-wrap items-center gap-2">
      <button
        type="button"
        disabled={isPending}
        onClick={() => onComplete(student)}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all disabled:opacity-50"
      >
        <CheckCircle2 className="w-3.5 h-3.5" />
        Mark completed
      </button>
      <button
        type="button"
        disabled={isPending}
        onClick={() => onWithdraw(student)}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:border-red-200 hover:text-red-600 hover:bg-red-50 transition-all disabled:opacity-50"
      >
        <XCircle className="w-3.5 h-3.5" />
        Withdraw
      </button>
      <Link
        to={studentLink(student, courseId)}
        className="ml-auto inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium text-blue-700 hover:bg-blue-50 transition-colors"
      >
        View details
        <ChevronRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  </article>
);

const ActiveStudentsPanel = ({
  students = [],
  courseId,
  isPending,
  onComplete,
  onWithdraw,
  onDelete,
  studentLink,
}) => {
  if (!students.length) {
    return (
      <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-4">
          <UserCheck className="w-7 h-7 text-blue-500" />
        </div>
        <p className="text-sm font-medium text-slate-700">No active students yet</p>
        <p className="text-xs text-slate-500 mt-1 max-w-xs">
          Activate new enrollments above to start tracking their progress here.
        </p>
      </div>
    );
  }

  return (
    <div className="p-5">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {students.map((student) => (
          <ActiveStudentCard
            key={student.id}
            student={student}
            courseId={courseId}
            isPending={isPending}
            onComplete={onComplete}
            onWithdraw={onWithdraw}
            onDelete={onDelete}
            studentLink={studentLink}
          />
        ))}
      </div>
    </div>
  );
};

export default ActiveStudentsPanel;
