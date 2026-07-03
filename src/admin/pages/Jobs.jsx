import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Briefcase } from "lucide-react";
import api from "../api/client";
import { useAdminData } from "../hooks/useAdminData";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import EmptyState from "../components/EmptyState";
import ConfirmDialog from "../components/ConfirmDialog";
import RecruitmentPopupToggle from "../components/RecruitmentPopupToggle";
import Button from "../../components/ui/Button";
import toast from "react-hot-toast";

const JobsAdmin = () => {
  const qc = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data, isLoading, isError } = useAdminData(["admin-jobs"], async () => {
    const { data: res } = await api.get("/admin/jobs", { params: { limit: 100 } });
    return Array.isArray(res?.data) ? res.data : [];
  });

  const deleteMut = useMutation({
    mutationFn: (id) => api.delete(`/admin/jobs/${id}`),
    onSuccess: () => {
      toast.success("Job deleted");
      qc.invalidateQueries({ queryKey: ["admin-jobs"] });
      qc.invalidateQueries({ queryKey: ["jobs"] });
      setDeleteTarget(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || "Delete failed"),
  });

  const items = data || [];

  return (
    <div>
      <PageHeader
        title="Jobs"
        description="Manage full-time and contract job listings shown on the Careers page."
        actions={
          <Link to="/admin/jobs/new">
            <Button><Plus className="w-4 h-4 mr-2" />New Job</Button>
          </Link>
        }
      />
      {isError && <p className="text-sm text-red-600 mb-4">Failed to load jobs from API.</p>}

      <RecruitmentPopupToggle type="jobs" label="Jobs" />

      {!isLoading && items.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No jobs yet"
          description="Create your first job listing to start receiving applications."
          actionLabel="Create first job"
          actionTo="/admin/jobs/new"
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="table-scroll">
            <table className="w-full text-sm table-min-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase">Title</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase hidden md:table-cell">Department</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase hidden sm:table-cell">Type</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase">Status</th>
                  <th className="text-right px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400">Loading...</td></tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60">
                      <td className="px-6 py-4">
                        <Link to={`/admin/jobs/${item.id}/edit`} className="font-medium text-slate-900 hover:text-blue-600">
                          {item.title}
                        </Link>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell text-slate-500">{item.department}</td>
                      <td className="px-4 py-4 hidden sm:table-cell text-slate-500">{item.type || "Full-time"}</td>
                      <td className="px-4 py-4"><StatusBadge status={item.status} /></td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Link to={`/admin/jobs/${item.id}/edit`} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100" title="Edit">
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <button type="button" onClick={() => setDeleteTarget(item)} className="p-2 rounded-lg text-red-500 hover:bg-red-50" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
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

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete job?"
        message={`"${deleteTarget?.title}" will be permanently removed.`}
        onConfirm={() => deleteMut.mutate(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
        loading={deleteMut.isPending}
      />
    </div>
  );
};

export default JobsAdmin;
