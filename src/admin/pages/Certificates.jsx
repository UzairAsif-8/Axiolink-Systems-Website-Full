import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Award, Pencil, Trash2, Ban } from "lucide-react";
import api from "../api/client";
import { useAdminData } from "../hooks/useAdminData";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";
import ConfirmDialog from "../components/ConfirmDialog";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import toast from "react-hot-toast";

const CertificatesAdmin = () => {
  const qc = useQueryClient();
  const [form, setForm] = useState({ certificateCode: "", studentName: "", courseName: "" });
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [revokeTarget, setRevokeTarget] = useState(null);

  const { data, isLoading, isError, refetch } = useAdminData(["admin-certificates"], async () => {
    const { data: res } = await api.get("/admin/certificates");
    return res.data;
  });

  const issueMut = useMutation({
    mutationFn: (body) => api.post("/admin/certificates", body),
    onSuccess: () => {
      toast.success("Certificate issued");
      setForm({ certificateCode: "", studentName: "", courseName: "" });
      refetch();
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to issue certificate"),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, body }) => api.put(`/admin/certificates/${id}`, body),
    onSuccess: () => {
      toast.success("Certificate updated");
      setEditTarget(null);
      refetch();
    },
    onError: (err) => toast.error(err.response?.data?.message || "Update failed"),
  });

  const revokeMut = useMutation({
    mutationFn: (id) => api.post(`/admin/certificates/${id}/revoke`),
    onSuccess: () => {
      toast.success("Certificate revoked");
      setRevokeTarget(null);
      refetch();
    },
    onError: (err) => toast.error(err.response?.data?.message || "Revoke failed"),
  });

  const deleteMut = useMutation({
    mutationFn: (id) => api.delete(`/admin/certificates/${id}`),
    onSuccess: () => {
      toast.success("Certificate deleted");
      setDeleteTarget(null);
      refetch();
    },
    onError: (err) => toast.error(err.response?.data?.message || "Delete failed"),
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Certificates" description="Issue and manage course completion certificates." />
      {isError && <p className="text-sm text-red-600">Failed to load certificates.</p>}

      <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm">
        <h3 className="text-sm font-semibold mb-4">Issue Certificate</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <Input label="Code" value={form.certificateCode} onChange={(e) => setForm({ ...form, certificateCode: e.target.value })} />
          <Input label="Student" value={form.studentName} onChange={(e) => setForm({ ...form, studentName: e.target.value })} />
          <Input label="Course" value={form.courseName} onChange={(e) => setForm({ ...form, courseName: e.target.value })} />
        </div>
        <Button onClick={() => issueMut.mutate(form)} loading={issueMut.isPending} className="mt-4">Issue Certificate</Button>
      </div>

      {!isLoading && (data || []).length === 0 ? (
        <EmptyState
          icon={Award}
          title="No certificates issued yet"
          description="Issue your first certificate using the form above."
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="table-scroll">
          <table className="w-full text-sm table-min-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase">Code</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase">Student</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase">Course</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase">Valid</th>
                <th className="text-right px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400">Loading...</td></tr>
              ) : (
                (data || []).map((c) => (
                  <tr key={c.id}>
                    <td className="px-6 py-4 font-mono text-xs">{c.certificateCode}</td>
                    <td className="px-4 py-4">{c.studentName}</td>
                    <td className="px-4 py-4">{c.courseName}</td>
                    <td className="px-4 py-4">
                      <span className={`text-xs font-medium ${c.isValid ? "text-emerald-600" : "text-red-600"}`}>
                        {c.isValid ? "Valid" : "Revoked"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button type="button" onClick={() => setEditTarget(c)} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100"><Pencil className="w-4 h-4" /></button>
                        {c.isValid && (
                          <button type="button" onClick={() => setRevokeTarget(c)} className="p-2 rounded-lg text-amber-600 hover:bg-amber-50"><Ban className="w-4 h-4" /></button>
                        )}
                        <button type="button" onClick={() => setDeleteTarget(c)} className="p-2 rounded-lg text-red-500 hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          </div>
        </div>
      )}

      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setEditTarget(null)} />
          <div className="relative w-full max-w-md bg-white rounded-xl border p-6 shadow-xl space-y-4">
            <h3 className="font-semibold">Edit Certificate</h3>
            <Input label="Code" value={editTarget.certificateCode} onChange={(e) => setEditTarget({ ...editTarget, certificateCode: e.target.value })} />
            <Input label="Student" value={editTarget.studentName} onChange={(e) => setEditTarget({ ...editTarget, studentName: e.target.value })} />
            <Input label="Course" value={editTarget.courseName} onChange={(e) => setEditTarget({ ...editTarget, courseName: e.target.value })} />
            <div className="flex gap-3 justify-end">
              <Button variant="secondary" onClick={() => setEditTarget(null)}>Cancel</Button>
              <Button loading={updateMut.isPending} onClick={() => updateMut.mutate({ id: editTarget.id, body: editTarget })}>Save</Button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog open={!!deleteTarget} title="Delete certificate?" message={`Remove certificate ${deleteTarget?.certificateCode}?`} onConfirm={() => deleteMut.mutate(deleteTarget.id)} onCancel={() => setDeleteTarget(null)} loading={deleteMut.isPending} />
      <ConfirmDialog open={!!revokeTarget} title="Revoke certificate?" message={`Revoke ${revokeTarget?.certificateCode}? It will no longer verify.`} confirmLabel="Revoke" onConfirm={() => revokeMut.mutate(revokeTarget.id)} onCancel={() => setRevokeTarget(null)} loading={revokeMut.isPending} />
    </div>
  );
};

export default CertificatesAdmin;
