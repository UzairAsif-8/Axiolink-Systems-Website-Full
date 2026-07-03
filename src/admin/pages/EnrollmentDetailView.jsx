import { Link } from "react-router-dom";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle2,
  History,
  XCircle,
  Trash2,
} from "lucide-react";
import api from "../api/client";
import { useAdminData } from "../hooks/useAdminData";
import StatusBadge from "../components/StatusBadge";
import Panel from "../components/Panel";
import ConfirmDialog from "../components/ConfirmDialog";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import {
  ENROLLMENT_STATUSES,
  getEnrollmentStatusLabel,
  getPaymentLabel,
  formatPrice,
  ACTIVE_STATUS,
  COMPLETED_STATUS,
  WITHDRAWN_STATUS,
} from "../constants/enrollments";
import toast from "react-hot-toast";

const selectClass =
  "w-full max-w-xs px-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400";

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

const EnrollmentDetailView = ({ enrollmentId, backTo, onDeleted }) => {
  const qc = useQueryClient();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { data: detail, isLoading, isError, refetch } = useAdminData(
    ["enrollment", enrollmentId],
    async () => {
      const { data: res } = await api.get(`/admin/courses/enrollments/${enrollmentId}`);
      return res.data;
    },
    { enabled: !!enrollmentId }
  );

  const statusMut = useMutation({
    mutationFn: ({ status, note }) =>
      api.patch(`/admin/courses/enrollments/${enrollmentId}/status`, { status, note }),
    onSuccess: () => {
      toast.success("Status updated");
      refetch();
      qc.invalidateQueries({ queryKey: ["admin-enrollments"] });
    },
    onError: (err) => toast.error(err.response?.data?.message || "Update failed"),
  });

  const updateMut = useMutation({
    mutationFn: (body) => api.patch(`/admin/courses/enrollments/${enrollmentId}`, body),
    onSuccess: () => {
      toast.success("Progress saved");
      refetch();
      qc.invalidateQueries({ queryKey: ["admin-enrollments"] });
    },
    onError: (err) => toast.error(err.response?.data?.message || "Update failed"),
  });

  const certificateMut = useMutation({
    mutationFn: () => api.patch(`/admin/courses/enrollments/${enrollmentId}/certificate`, { issued: true }),
    onSuccess: () => {
      toast.success("Certificate issued");
      refetch();
      qc.invalidateQueries({ queryKey: ["admin-enrollments"] });
      qc.invalidateQueries({ queryKey: ["admin-certificates"] });
    },
    onError: (err) => toast.error(err.response?.data?.message || "Could not issue certificate"),
  });

  const deleteMut = useMutation({
    mutationFn: () => api.delete(`/admin/courses/enrollments/${enrollmentId}`),
    onSuccess: () => {
      toast.success("Enrollment removed");
      qc.invalidateQueries({ queryKey: ["admin-enrollments"] });
      onDeleted?.();
    },
    onError: (err) => toast.error(err.response?.data?.message || "Delete failed"),
  });

  if (isLoading) {
    return <p className="text-slate-400 py-12 text-center">Loading student...</p>;
  }

  if (isError || !detail) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Could not load this enrollment.</p>
        <Link to={backTo} className="text-blue-600 text-sm font-medium">Back to students</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <Link to={backTo} className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700">
        <ArrowLeft className="w-4 h-4" />Back to students
      </Link>

      <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">{detail.fullName}</h1>
            <p className="text-slate-500 mt-1">{detail.email}</p>
            {detail.phone && <p className="text-sm text-slate-400 mt-0.5">{detail.phone}</p>}
          </div>
          <StatusBadge status={detail.status} className="self-start" />
        </div>

        <div className="mt-5 p-4 rounded-xl bg-blue-50/50 border border-blue-100/60">
          <div className="flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-900">{detail.course?.title}</p>
              <p className="text-sm text-slate-500 mt-1">
                {[detail.courseCategory, detail.courseDuration, detail.courseLevel]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              {detail.coursePrice != null && (
                <p className="text-sm text-slate-600 mt-1">{formatPrice(detail.coursePrice)}</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100 grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Enrollment status</label>
            <select
              value={detail.status}
              onChange={(e) => statusMut.mutate({ status: e.target.value })}
              disabled={statusMut.isPending}
              className={selectClass}
            >
              {ENROLLMENT_STATUSES.map((s) => (
                <option key={s.key} value={s.key}>{s.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Payment status</label>
            <select
              value={detail.paymentStatus || "PENDING"}
              onChange={(e) => updateMut.mutate({ paymentStatus: e.target.value })}
              disabled={updateMut.isPending}
              className={selectClass}
            >
              {["PENDING", "PARTIAL", "PAID", "WAIVED", "REFUNDED"].map((p) => (
                <option key={p} value={p}>{getPaymentLabel(p)}</option>
              ))}
            </select>
          </div>
        </div>

        {detail.status === "NEW" && (
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              size="sm"
              loading={statusMut.isPending}
              onClick={() =>
                statusMut.mutate({ status: ACTIVE_STATUS, note: "Student activated" })
              }
            >
              Activate student
            </Button>
            <Button
              size="sm"
              variant="danger"
              loading={statusMut.isPending}
              onClick={() =>
                statusMut.mutate({ status: WITHDRAWN_STATUS, note: "Enrollment declined" })
              }
            >
              <XCircle className="w-4 h-4 mr-1" />Decline
            </Button>
          </div>
        )}

        {detail.status === ACTIVE_STATUS && (
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="secondary"
              loading={statusMut.isPending}
              onClick={() =>
                statusMut.mutate({ status: COMPLETED_STATUS, note: "Course completed" })
              }
            >
              <CheckCircle2 className="w-4 h-4 mr-1" />Mark completed
            </Button>
            <Button
              size="sm"
              variant="danger"
              loading={statusMut.isPending}
              onClick={() =>
                statusMut.mutate({ status: WITHDRAWN_STATUS, note: "Student withdrawn" })
              }
            >
              <XCircle className="w-4 h-4 mr-1" />Withdraw
            </Button>
          </div>
        )}

        {detail.status === COMPLETED_STATUS && (
          <div className="mt-4">
            <button
              type="button"
              disabled={detail.certificateIssued || certificateMut.isPending}
              onClick={() => certificateMut.mutate()}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                detail.certificateIssued
                  ? "bg-emerald-600 text-white cursor-default"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-violet-50 hover:border-violet-300"
              }`}
            >
              <Award className="w-4 h-4" />
              {detail.certificateIssued ? "Certificate issued" : "Issue certificate"}
            </button>
          </div>
        )}
      </div>

      {(detail.status === ACTIVE_STATUS || detail.status === COMPLETED_STATUS) && (
        <Panel title="Learning progress">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              updateMut.mutate({
                progress: Number(fd.get("progress")),
                attendance: Number(fd.get("attendance")),
              });
            }}
            className="space-y-4"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Course progress (%)"
                name="progress"
                type="number"
                min={0}
                max={100}
                defaultValue={detail.progress ?? 0}
              />
              <Input
                label="Attendance (%)"
                name="attendance"
                type="number"
                min={0}
                max={100}
                defaultValue={detail.attendance ?? 0}
              />
            </div>
            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all"
                style={{ width: `${Math.min(100, detail.progress || 0)}%` }}
              />
            </div>
            <Button type="submit" size="sm" loading={updateMut.isPending}>Save progress</Button>
          </form>
        </Panel>
      )}

      <Panel title="Enrollment timeline">
        <dl className="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-slate-400 mb-0.5">Enrolled</dt>
            <dd className="font-medium text-slate-900">{formatDate(detail.enrollmentDate || detail.createdAt)}</dd>
          </div>
          {detail.activeAt && (
            <div>
              <dt className="text-slate-400 mb-0.5">Activated</dt>
              <dd className="font-medium text-slate-900">{formatDate(detail.activeAt)}</dd>
            </div>
          )}
          {detail.completedAt && (
            <div>
              <dt className="text-slate-400 mb-0.5">Completed</dt>
              <dd className="font-medium text-slate-900">{formatDate(detail.completedAt)}</dd>
            </div>
          )}
          {detail.certificateIssuedAt && (
            <div>
              <dt className="text-slate-400 mb-0.5">Certificate issued</dt>
              <dd className="font-medium text-emerald-700">{formatDate(detail.certificateIssuedAt)}</dd>
            </div>
          )}
        </dl>
      </Panel>

      {(detail.statusHistory || []).length > 0 && (
        <Panel title="Activity">
          <ul className="space-y-3">
            {(detail.statusHistory || []).map((entry) => (
              <li key={entry.id} className="flex gap-3 text-sm">
                <History className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-800">
                    {entry.fromStatus
                      ? `${getEnrollmentStatusLabel(entry.fromStatus)} → ${getEnrollmentStatusLabel(entry.toStatus)}`
                      : `Enrolled — ${getEnrollmentStatusLabel(entry.toStatus)}`}
                  </p>
                  {entry.note && <p className="text-slate-500 text-xs mt-0.5">{entry.note}</p>}
                  <p className="text-xs text-slate-400 mt-0.5">
                    {entry.changedBy} · {new Date(entry.changedAt).toLocaleString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      <Button variant="danger" size="sm" onClick={() => setConfirmDelete(true)}>
        <Trash2 className="w-4 h-4 mr-1" />Remove enrollment
      </Button>

      <ConfirmDialog
        open={confirmDelete}
        title="Remove this enrollment?"
        message={`${detail.fullName} will be permanently removed.`}
        onConfirm={() => deleteMut.mutate()}
        onCancel={() => setConfirmDelete(null)}
        loading={deleteMut.isPending}
      />
    </div>
  );
};

export default EnrollmentDetailView;
