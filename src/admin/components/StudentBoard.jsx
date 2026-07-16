import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Award, ChevronRight, GraduationCap, Trash2, UserCheck, Users, UserPlus } from "lucide-react";
import api from "../api/client";
import ConfirmDialog from "./ConfirmDialog";
import PaymentSlipPreview from "./PaymentSlipPreview";
import StatusBadge from "./StatusBadge";
import ActiveStudentsPanel from "./ActiveStudentsPanel";
import {
  filterNewEnrollments,
  filterActiveStudents,
  filterGraduates,
  filterWithdrawnStudents,
  countNewByPayment,
  getPaymentLabel,
  ACTIVE_STATUS,
  COMPLETED_STATUS,
  WITHDRAWN_STATUS,
} from "../constants/enrollments";
import toast from "react-hot-toast";

const selectClass =
  "text-sm border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20";

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

const studentLink = (student, courseId) =>
  courseId
    ? `/admin/courses/${courseId}/students/${student.id}`
    : `/admin/students/${student.id}`;

const SectionCard = ({ icon: Icon, title, count, subtitle, children, accent = "slate" }) => {
  const accents = {
    slate: { header: "border-slate-200/80 bg-slate-50/60", icon: "text-slate-600", badge: "bg-slate-100 text-slate-600" },
    blue: { header: "border-blue-200/80 bg-gradient-to-r from-blue-50/80 to-indigo-50/50", icon: "text-blue-600", badge: "bg-blue-100 text-blue-700 ring-1 ring-blue-200/60" },
    indigo: { header: "border-indigo-200/80 bg-gradient-to-r from-indigo-50/80 to-violet-50/50", icon: "text-indigo-600", badge: "bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200/60" },
    violet: { header: "border-violet-200/80 bg-violet-50/50", icon: "text-violet-600", badge: "bg-violet-100 text-violet-700" },
  };
  const style = accents[accent] || accents.slate;

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div className={`px-5 py-4 border-b border-slate-100 flex items-center justify-between ${style.header}`}>
        <div className="flex items-center gap-3">
          {Icon && (
            <div className={`p-2 rounded-xl bg-white/80 border border-white shadow-sm ${style.icon}`}>
              <Icon className="w-5 h-5" />
            </div>
          )}
          <div>
            <h3 className="font-semibold text-slate-900">{title}</h3>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${style.badge}`}>{count}</span>
      </div>
      {children}
    </div>
  );
};

const NewEnrollmentsTable = ({ rows, courseId, isPending, onActivate, onWithdraw, onPaymentChange, onDelete }) => {
  if (!rows.length) {
    return <p className="text-sm text-slate-500 text-center py-10 px-4">No new enrollments waiting.</p>;
  }

  return (
    <div className="table-scroll">
      <table className="w-full text-sm table-min-sm">
        <thead>
          <tr className="border-b border-slate-100 text-left bg-slate-50/50">
            <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Student</th>
            <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase hidden md:table-cell">Course</th>
            <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase hidden sm:table-cell">Enrolled</th>
            <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Payment</th>
            <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase hidden lg:table-cell">Slip</th>
            <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {rows.map((s) => (
            <tr key={s.id} className="hover:bg-amber-50/20">
              <td className="py-3.5 px-4">
                <Link to={studentLink(s, courseId)} className="font-medium text-slate-900 hover:text-blue-600">
                  {s.fullName}
                </Link>
                <p className="text-xs text-slate-400 mt-0.5">{s.email}</p>
              </td>
              <td className="py-3.5 px-4 hidden md:table-cell text-slate-600 text-xs">
                <p>{s.course?.title || "—"}</p>
                {s.courseCategory && <p className="text-slate-400">{s.courseCategory}</p>}
              </td>
              <td className="py-3.5 px-4 hidden sm:table-cell text-slate-500 text-xs">
                {formatDate(s.enrollmentDate || s.createdAt)}
              </td>
              <td className="py-3.5 px-4">
                <select
                  value={s.paymentStatus || "PENDING"}
                  disabled={isPending}
                  onChange={(e) => onPaymentChange(s.id, e.target.value)}
                  className={selectClass}
                >
                  {["PENDING", "PARTIAL", "PAID", "WAIVED", "REFUNDED"].map((p) => (
                    <option key={p} value={p}>{getPaymentLabel(p)}</option>
                  ))}
                </select>
              </td>
              <td className="py-3.5 px-4 hidden lg:table-cell">
                {s.paymentSlipUrl ? (
                  <PaymentSlipPreview url={s.paymentSlipUrl} compact />
                ) : (
                  <span className="text-xs text-slate-400">—</span>
                )}
              </td>
              <td className="py-3.5 px-4">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => onActivate(s)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                  >
                    Activate
                  </button>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => onWithdraw(s)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 disabled:opacity-50"
                  >
                    Decline
                  </button>
                  <Link
                    to={studentLink(s, courseId)}
                    className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    Open <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => onDelete(s)}
                    className="p-1.5 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const GraduatesTable = ({ rows, courseId, isPending, onCertificate, onDelete }) => {
  if (!rows.length) {
    return (
      <p className="text-sm text-slate-500 text-center py-10 px-4">
        Graduates will appear here after students complete their course.
      </p>
    );
  }

  return (
    <div className="table-scroll">
      <table className="w-full text-sm table-min-sm">
        <thead>
          <tr className="border-b border-slate-100 text-left bg-violet-50/30">
            <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Graduate</th>
            <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase hidden md:table-cell">Course</th>
            <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase hidden sm:table-cell">Completed</th>
            <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Progress</th>
            <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Certificate</th>
            <th className="py-3 px-4 w-10" />
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {rows.map((s) => (
            <tr key={s.id} className="hover:bg-violet-50/20">
              <td className="py-3.5 px-4">
                <Link to={studentLink(s, courseId)} className="font-medium text-slate-900 hover:text-blue-600">
                  {s.fullName}
                </Link>
                <p className="text-xs text-slate-400 mt-0.5">{s.email}</p>
              </td>
              <td className="py-3.5 px-4 hidden md:table-cell text-slate-600 text-xs">{s.course?.title || "—"}</td>
              <td className="py-3.5 px-4 hidden sm:table-cell text-slate-500 text-xs">{formatDate(s.completedAt)}</td>
              <td className="py-3.5 px-4 text-slate-600">{s.progress ?? 100}%</td>
              <td className="py-3.5 px-4">
                <button
                  type="button"
                  disabled={isPending || s.certificateIssued}
                  onClick={() => onCertificate(s)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    s.certificateIssued
                      ? "bg-emerald-600 text-white cursor-default shadow-sm"
                      : "bg-white text-slate-700 border border-slate-200 hover:bg-violet-50 hover:border-violet-300"
                  }`}
                >
                  <Award className="w-4 h-4" />
                  {s.certificateIssued ? "Certificate issued" : "Issue certificate"}
                </button>
              </td>
              <td className="py-3.5 px-4">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => onDelete(s)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const StudentBoard = ({
  enrollments = [],
  courseId = null,
}) => {
  const qc = useQueryClient();
  const location = useLocation();
  const [newFilter, setNewFilter] = useState("ALL");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [confirmComplete, setConfirmComplete] = useState(null);
  const [confirmWithdraw, setConfirmWithdraw] = useState(null);
  const [confirmActivate, setConfirmActivate] = useState(null);

  useEffect(() => {
    setNewFilter("ALL");
  }, [location.pathname]);

  const newEnrollments = filterNewEnrollments(enrollments);
  const activeStudents = filterActiveStudents(enrollments);
  const graduates = filterGraduates(enrollments);
  const withdrawn = filterWithdrawnStudents(enrollments);
  const paymentCounts = countNewByPayment(enrollments);

  const filteredNew =
    newFilter === "ALL"
      ? newEnrollments
      : newFilter === "PENDING"
        ? newEnrollments.filter((e) => e.paymentStatus === "PENDING")
        : newFilter === "PAID"
          ? newEnrollments.filter((e) => e.paymentStatus === "PAID" || e.paymentStatus === "WAIVED")
          : newEnrollments.filter((e) => e.paymentStatus === "PARTIAL");

  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin-enrollments"] });

  const statusMut = useMutation({
    mutationFn: ({ id, status, note }) =>
      api.patch(`/admin/courses/enrollments/${id}/status`, { status, note }),
    onSuccess: (_, vars) => {
      const labels = {
        ACTIVE: "Student activated — now learning",
        COMPLETED: "Moved to Graduates",
        WITHDRAWN: "Enrollment withdrawn",
      };
      toast.success(labels[vars.status] || "Status updated");
      invalidate();
    },
    onError: (err) => toast.error(err.response?.data?.message || "Update failed"),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, body }) => api.patch(`/admin/courses/enrollments/${id}`, body),
    onSuccess: () => {
      toast.success("Enrollment updated");
      invalidate();
    },
    onError: (err) => toast.error(err.response?.data?.message || "Update failed"),
  });

  const certificateMut = useMutation({
    mutationFn: (id) => api.patch(`/admin/courses/enrollments/${id}/certificate`, { issued: true }),
    onSuccess: () => {
      toast.success("Certificate issued and added to registry");
      invalidate();
      qc.invalidateQueries({ queryKey: ["admin-certificates"] });
    },
    onError: (err) => toast.error(err.response?.data?.message || "Could not issue certificate"),
  });

  const deleteMut = useMutation({
    mutationFn: (id) => api.delete(`/admin/courses/enrollments/${id}`),
    onSuccess: () => {
      toast.success("Enrollment removed");
      invalidate();
      setDeleteTarget(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || "Delete failed"),
  });

  const isPending =
    statusMut.isPending || updateMut.isPending || deleteMut.isPending || certificateMut.isPending;

  const newTabs = [
    { key: "ALL", label: "All", count: paymentCounts.all },
    { key: "PENDING", label: "Payment pending", count: paymentCounts.pending },
    { key: "PARTIAL", label: "Partial", count: paymentCounts.partial },
    { key: "PAID", label: "Paid", count: paymentCounts.paid },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-1">New Enrollments</h2>
        <p className="text-sm text-slate-500 mb-4">
          Review sign-ups, confirm payment, then activate students to start their course.
        </p>

        <div className="flex flex-wrap gap-2 pb-1">
          {newTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setNewFilter(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                newFilter === tab.key
                  ? "bg-amber-500 text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {tab.label}
              <span className={`ml-1.5 ${newFilter === tab.key ? "text-amber-100" : "text-slate-400"}`}>
                ({tab.count})
              </span>
            </button>
          ))}
        </div>

        <div className="mt-4 bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
          <NewEnrollmentsTable
            rows={filteredNew}
            courseId={courseId}
            isPending={isPending}
            onActivate={setConfirmActivate}
            onWithdraw={setConfirmWithdraw}
            onPaymentChange={(id, paymentStatus) => updateMut.mutate({ id, body: { paymentStatus } })}
            onDelete={setDeleteTarget}
          />
        </div>
      </div>

      <SectionCard
        icon={UserCheck}
        title="Active Students"
        subtitle="Students currently enrolled and progressing through their course"
        count={`${activeStudents.length} student${activeStudents.length !== 1 ? "s" : ""}`}
        accent="blue"
      >
        <ActiveStudentsPanel
          students={activeStudents}
          courseId={courseId}
          isPending={isPending}
          onComplete={setConfirmComplete}
          onWithdraw={setConfirmWithdraw}
          onDelete={setDeleteTarget}
          studentLink={studentLink}
        />
      </SectionCard>

      <SectionCard
        icon={GraduationCap}
        title="Graduates"
        subtitle="Students who completed the course — issue their Buland Parwaz certificate"
        count={`${graduates.length} graduate${graduates.length !== 1 ? "s" : ""}`}
        accent="violet"
      >
        <GraduatesTable
          rows={graduates}
          courseId={courseId}
          isPending={isPending}
          onCertificate={(s) => certificateMut.mutate(s.id)}
          onDelete={setDeleteTarget}
        />
      </SectionCard>

      {withdrawn.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden opacity-80">
          <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/60 flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-500" />
            <div>
              <h3 className="font-semibold text-slate-700">Withdrawn</h3>
              <p className="text-xs text-slate-500">{withdrawn.length} enrollment{withdrawn.length !== 1 ? "s" : ""}</p>
            </div>
          </div>
          <div className="divide-y divide-slate-50">
            {withdrawn.map((s) => (
              <div key={s.id} className="px-5 py-3 flex items-center justify-between text-sm gap-4">
                <div className="min-w-0">
                  <span className="font-medium text-slate-700">{s.fullName}</span>
                  {!courseId && s.course?.title && (
                    <span className="text-slate-400 ml-2 truncate">{s.course.title}</span>
                  )}
                </div>
                <StatusBadge status={WITHDRAWN_STATUS} />
              </div>
            ))}
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Remove this enrollment?"
        message={`${deleteTarget?.fullName} will be permanently removed from student records.`}
        onConfirm={() => deleteMut.mutate(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
        loading={deleteMut.isPending}
      />

      <ConfirmDialog
        open={!!confirmActivate}
        title="Activate this student?"
        message={`${confirmActivate?.fullName} will move to Active Students and can begin ${confirmActivate?.course?.title || "their course"}.`}
        confirmLabel="Activate student"
        confirmVariant="primary"
        onConfirm={() => {
          statusMut.mutate({
            id: confirmActivate.id,
            status: ACTIVE_STATUS,
            note: "Payment confirmed — student activated",
          });
          setConfirmActivate(null);
        }}
        onCancel={() => setConfirmActivate(null)}
        loading={statusMut.isPending}
      />

      <ConfirmDialog
        open={!!confirmComplete}
        title="Mark course as completed?"
        message={`${confirmComplete?.fullName} will move to Graduates where you can issue their certificate.`}
        confirmLabel="Mark completed"
        confirmVariant="primary"
        onConfirm={() => {
          statusMut.mutate({
            id: confirmComplete.id,
            status: COMPLETED_STATUS,
            note: "Course completed successfully",
          });
          setConfirmComplete(null);
        }}
        onCancel={() => setConfirmComplete(null)}
        loading={statusMut.isPending}
      />

      <ConfirmDialog
        open={!!confirmWithdraw}
        title="Withdraw this student?"
        message={`${confirmWithdraw?.fullName} will be removed from active learning and marked as withdrawn.`}
        confirmLabel="Withdraw"
        onConfirm={() => {
          statusMut.mutate({
            id: confirmWithdraw.id,
            status: WITHDRAWN_STATUS,
            note: "Enrollment withdrawn",
          });
          setConfirmWithdraw(null);
        }}
        onCancel={() => setConfirmWithdraw(null)}
        loading={statusMut.isPending}
      />
    </div>
  );
};

export default StudentBoard;
