import { Link, useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Mail, Trash2 } from "lucide-react";
import api from "../api/client";
import { useAdminData } from "../hooks/useAdminData";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import Panel from "../components/Panel";
import EmptyState from "../components/EmptyState";
import ConfirmDialog from "../components/ConfirmDialog";
import Button from "../../components/ui/Button";
import toast from "react-hot-toast";

const MESSAGE_STATUSES = ["NEW", "READ", "REPLIED", "ARCHIVED"];

const selectClass =
  "w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400";

const MessagesAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [reply, setReply] = useState("");

  const { data, isLoading, isError } = useAdminData(["admin-messages"], async () => {
    const { data: res } = await api.get("/admin/messages");
    return res.data;
  });

  const { data: detail, refetch } = useAdminData(
    ["message", id],
    async () => {
      const { data: res } = await api.get(`/admin/messages/${id}`);
      return res.data;
    },
    { enabled: !!id }
  );

  const updateMut = useMutation({
    mutationFn: (body) => api.patch(`/admin/messages/${id}`, body),
    onSuccess: () => {
      toast.success("Message updated");
      refetch();
      qc.invalidateQueries({ queryKey: ["admin-messages"] });
    },
    onError: (err) => toast.error(err.response?.data?.message || "Update failed"),
  });

  const deleteMut = useMutation({
    mutationFn: (msgId) => api.delete(`/admin/messages/${msgId}`),
    onSuccess: () => {
      toast.success("Message deleted");
      qc.invalidateQueries({ queryKey: ["admin-messages"] });
      setDeleteTarget(null);
      if (id) navigate("/admin/messages");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Delete failed"),
  });

  if (id && detail) {
    return (
      <div className="max-w-3xl space-y-6">
        <Link to="/admin/messages" className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700">
          <ArrowLeft className="w-4 h-4" />Back to messages
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">{detail.subject || "No subject"}</h1>
            <p className="text-slate-500 mt-1">{detail.name} · {detail.email}</p>
          </div>
          <StatusBadge status={detail.status} />
        </div>

        <Panel title="Message">
          <p className="text-sm text-slate-700 whitespace-pre-wrap">{detail.message}</p>
          {detail.phone && <p className="text-sm text-slate-500 mt-3">Phone: {detail.phone}</p>}
        </Panel>

        <Panel title="Update Status">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={detail.status}
                onChange={(e) => updateMut.mutate({ status: e.target.value })}
                className={selectClass}
                disabled={updateMut.isPending}
              >
                {MESSAGE_STATUSES.map((s) => (
                  <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Reply note</label>
              <textarea
                rows={3}
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                className={selectClass}
                placeholder="Internal reply note..."
              />
              <Button
                className="mt-3"
                onClick={() => updateMut.mutate({ status: "REPLIED", reply })}
                loading={updateMut.isPending}
              >
                Mark as Replied
              </Button>
            </div>
            <Button variant="danger" onClick={() => setDeleteTarget(detail)}>
              <Trash2 className="w-4 h-4 mr-2" />Delete Message
            </Button>
          </div>
        </Panel>

        <ConfirmDialog
          open={!!deleteTarget}
          title="Delete message?"
          message="This message will be permanently removed."
          onConfirm={() => deleteMut.mutate(deleteTarget.id)}
          onCancel={() => setDeleteTarget(null)}
          loading={deleteMut.isPending}
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Contact Messages" description="Inquiries from the website contact form." />
      {isError && <p className="text-sm text-red-600 mb-4">Failed to load messages.</p>}

      {!isLoading && (data || []).length === 0 ? (
        <EmptyState
          icon={Mail}
          title="No messages yet"
          description="Contact form submissions from the website will appear here."
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="table-scroll">
          <table className="w-full text-sm table-min-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase">From</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase">Subject</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan={3} className="px-6 py-12 text-center text-slate-400">Loading...</td></tr>
              ) : (
                (data || []).map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/60">
                    <td className="px-6 py-4">
                      <Link to={`/admin/messages/${m.id}`} className="font-medium text-slate-900 hover:text-blue-600">{m.name}</Link>
                      <p className="text-xs text-slate-400">{m.email}</p>
                    </td>
                    <td className="px-4 py-4 text-slate-600">{m.subject || "—"}</td>
                    <td className="px-4 py-4"><StatusBadge status={m.status} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesAdmin;
