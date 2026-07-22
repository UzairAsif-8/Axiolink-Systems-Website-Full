import { Link } from "react-router-dom";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Download, Clock, Trash2, CheckCircle2, XCircle, Award } from "lucide-react";
import api from "../api/client";
import { useAdminData } from "../hooks/useAdminData";
import StatusBadge from "../components/StatusBadge";
import Panel from "../components/Panel";
import ConfirmDialog from "../components/ConfirmDialog";
import InternApprovalDateModal from "../components/InternApprovalDateModal";
import Button from "../../components/ui/Button";
import Textarea from "../../components/ui/Textarea";
import {
  ALL_APPLICATION_STATUSES,
  getStatusLabel,
  ACTIVE_INTERN_STATUS,
  COMPLETED_STATUS,
  WITHDRAWN_STATUS,
  formatWorkMode,
} from "../constants/applications";
import { resolveMediaUrl, isLikelyLocalUpload } from "../../utils/mediaUrl";
import toast from "react-hot-toast";

const selectClass =
  "w-full max-w-xs px-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400";

const ApplicationDetailView = ({ applicationId, backTo, onDeleted }) => {
  const qc = useQueryClient();
  const [noteText, setNoteText] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  const { data: detail, isLoading, isError, refetch } = useAdminData(
    ["application", applicationId],
    async () => {
      const { data: res } = await api.get(`/admin/applications/${applicationId}`);
      return res.data;
    },
    { enabled: !!applicationId }
  );

  const statusMut = useMutation({
    mutationFn: (payload) => {
      const body = typeof payload === "string" ? { status: payload } : payload;
      return api.patch(`/admin/applications/${applicationId}/status`, body);
    },
    onSuccess: () => {
      toast.success("Status updated");
      setShowApprovalModal(false);
      refetch();
      qc.invalidateQueries({ queryKey: ["admin-applications"] });
    },
    onError: (err) => toast.error(err.response?.data?.message || "Update failed"),
  });

  const noteMut = useMutation({
    mutationFn: (content) => api.post(`/admin/applications/${applicationId}/notes`, { content }),
    onSuccess: () => {
      toast.success("Note saved");
      setNoteText("");
      refetch();
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to save note"),
  });

  const certificateMut = useMutation({
    mutationFn: () => api.patch(`/admin/applications/${applicationId}/certificate`, { issued: true }),
    onSuccess: () => {
      toast.success("Certificate marked as issued");
      refetch();
      qc.invalidateQueries({ queryKey: ["admin-applications"] });
    },
    onError: (err) => toast.error(err.response?.data?.message || "Could not update certificate"),
  });

  const deleteMut = useMutation({
    mutationFn: () => api.delete(`/admin/applications/${applicationId}`),
    onSuccess: () => {
      toast.success("Applicant removed");
      qc.invalidateQueries({ queryKey: ["admin-applications"] });
      onDeleted?.();
    },
    onError: (err) => toast.error(err.response?.data?.message || "Delete failed"),
  });

  if (isLoading) {
    return <p className="text-slate-400 py-12 text-center">Loading applicant...</p>;
  }

  if (isError || !detail) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Could not load this applicant.</p>
        <Link to={backTo} className="text-blue-600 text-sm font-medium">Back to list</Link>
      </div>
    );
  }

  const handleStatusChange = (nextStatus) => {
    if (nextStatus === ACTIVE_INTERN_STATUS && detail.status !== ACTIVE_INTERN_STATUS) {
      setShowApprovalModal(true);
      return;
    }
    statusMut.mutate({ status: nextStatus });
  };

  const internshipStart = detail.internshipStartedAt || detail.intern?.startDate;
  const internshipEnd = detail.intern?.endDate;

  return (
    <div className="max-w-3xl space-y-6">
      <Link to={backTo} className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700">
        <ArrowLeft className="w-4 h-4" />Back to list
      </Link>

      <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">{detail.fullName}</h1>
            <p className="text-slate-500 mt-1">{detail.internshipTitle}</p>
            {(detail.internshipDepartment || detail.internshipDuration) && (
              <p className="text-sm text-slate-400 mt-0.5">
                {[detail.internshipDepartment, detail.internshipDuration, formatWorkMode(detail.internshipWorkMode)]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            )}
            <p className="text-sm text-slate-400 mt-1">{detail.email} · {detail.phone || "No phone"}</p>
          </div>
          <StatusBadge status={detail.status} className="self-start" />
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100">
          <label className="block text-sm font-medium text-slate-700 mb-2">Application status</label>
          <select
            value={detail.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={statusMut.isPending}
            className={selectClass}
          >
            {ALL_APPLICATION_STATUSES.map((s) => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>
        </div>

        {(internshipStart || internshipEnd) && (
          <div className="mt-4 grid sm:grid-cols-2 gap-4 text-sm">
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100">
              <p className="text-xs font-medium text-emerald-700 uppercase tracking-wide">Internship start</p>
              <p className="mt-1 font-medium text-slate-900">
                {internshipStart ? new Date(internshipStart).toLocaleDateString() : "—"}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100">
              <p className="text-xs font-medium text-emerald-700 uppercase tracking-wide">Internship end</p>
              <p className="mt-1 font-medium text-slate-900">
                {internshipEnd ? new Date(internshipEnd).toLocaleDateString() : "—"}
              </p>
            </div>
          </div>
        )}

        {detail.status === ACTIVE_INTERN_STATUS && (
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="secondary"
              loading={statusMut.isPending}
              onClick={() => statusMut.mutate({ status: COMPLETED_STATUS })}
            >
              <CheckCircle2 className="w-4 h-4 mr-1" />Mark completed
            </Button>
            <Button
              size="sm"
              variant="danger"
              loading={statusMut.isPending}
              onClick={() => statusMut.mutate({ status: WITHDRAWN_STATUS })}
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

      <Panel title="Applicant details">
        <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
          <div><dt className="text-slate-400 mb-0.5">University</dt><dd className="font-medium text-slate-900">{detail.university || "—"}</dd></div>
          <div><dt className="text-slate-400 mb-0.5">Degree</dt><dd className="font-medium text-slate-900">{detail.degree || "—"}</dd></div>
          {detail.skills?.length > 0 && (
            <div className="sm:col-span-2"><dt className="text-slate-400 mb-0.5">Skills</dt><dd className="text-slate-900">{detail.skills.join(", ")}</dd></div>
          )}
          {detail.whyJoin && (
            <div className="sm:col-span-2"><dt className="text-slate-400 mb-0.5">Why they want to join</dt><dd className="text-slate-700 leading-relaxed">{detail.whyJoin}</dd></div>
          )}
        </dl>
        {detail.resumeUrl && (
          <div className="mt-5 space-y-2">
            {isLikelyLocalUpload(detail.resumeUrl) ? (
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                <p className="font-medium">This resume is no longer available</p>
                <p className="mt-1 text-amber-800">
                  It was stored on the server disk and removed after a redeploy. Ask the applicant
                  to resend their CV, or have them re-apply once Cloudinary uploads are enabled.
                </p>
                <p className="mt-2 text-xs text-amber-700 break-all opacity-80">{detail.resumeUrl}</p>
              </div>
            ) : (
              <a
                href={resolveMediaUrl(detail.resumeUrl)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
              >
                <Download className="w-4 h-4" />Download resume
              </a>
            )}
          </div>
        )}
      </Panel>

      <Panel title="Your notes">
        {(detail.notes || []).length > 0 && (
          <div className="space-y-2 mb-4">
            {(detail.notes || []).map((note) => (
              <div key={note.id} className="p-3 rounded-lg bg-slate-50 text-sm">
                <p className="text-slate-800">{note.content}</p>
                <p className="text-xs text-slate-400 mt-1">{note.authorName} · {new Date(note.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
        <Textarea
          rows={3}
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Write a private note about this applicant..."
        />
        <Button
          onClick={() => noteMut.mutate(noteText)}
          loading={noteMut.isPending}
          disabled={!noteText.trim()}
          className="mt-3"
          size="sm"
        >
          Save note
        </Button>
      </Panel>

      {(detail.statusHistory || []).length > 0 && (
        <Panel title="Activity">
          <ul className="space-y-3">
            {(detail.statusHistory || []).map((entry) => (
              <li key={entry.id} className="flex gap-3 text-sm">
                <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-800">
                    {entry.fromStatus
                      ? `Changed from ${getStatusLabel(entry.fromStatus)} to ${getStatusLabel(entry.toStatus)}`
                      : `Application received — ${getStatusLabel(entry.toStatus)}`}
                  </p>
                  {entry.note && <p className="text-slate-500 text-xs mt-0.5">{entry.note}</p>}
                  <p className="text-xs text-slate-400 mt-0.5">{entry.changedBy} · {new Date(entry.changedAt).toLocaleString()}</p>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      <Button variant="danger" size="sm" onClick={() => setConfirmDelete(true)}>
        <Trash2 className="w-4 h-4 mr-1" />Remove applicant
      </Button>

      <ConfirmDialog
        open={confirmDelete}
        title="Remove this applicant?"
        message={`${detail.fullName} will be permanently removed.`}
        onConfirm={() => deleteMut.mutate()}
        onCancel={() => setConfirmDelete(false)}
        loading={deleteMut.isPending}
      />

      <InternApprovalDateModal
        open={showApprovalModal}
        applicantName={detail.fullName}
        loading={statusMut.isPending}
        onCancel={() => setShowApprovalModal(false)}
        onConfirm={({ startDate, endDate }) =>
          statusMut.mutate({
            status: ACTIVE_INTERN_STATUS,
            note: "Approved and added to active interns",
            internshipStartDate: startDate,
            internshipEndDate: endDate,
          })
        }
      />
    </div>
  );
};

export default ApplicationDetailView;
