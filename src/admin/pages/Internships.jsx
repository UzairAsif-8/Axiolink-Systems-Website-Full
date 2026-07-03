import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Copy, Trash2, Briefcase, Users } from "lucide-react";
import api from "../api/client";
import { useAdminData } from "../hooks/useAdminData";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import EmptyState from "../components/EmptyState";
import ConfirmDialog from "../components/ConfirmDialog";
import RecruitmentPopupToggle from "../components/RecruitmentPopupToggle";
import Button from "../../components/ui/Button";
import toast from "react-hot-toast";

const InternshipsAdmin = () => {
  const qc = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data, isLoading, isError } = useAdminData(["admin-internships"], async () => {
    const { data: res } = await api.get("/admin/internships", { params: { limit: 100 } });
    return Array.isArray(res?.data) ? res.data : [];
  });

  const { data: allApplications } = useAdminData(["admin-applications", "all"], async () => {
    const { data: res } = await api.get("/admin/applications", { params: { limit: 500 } });
    return res.data;
  });

  const appCountByInternship = useMemo(() => {
    const counts = {};
    for (const app of allApplications || []) {
      if (app.internshipId) counts[app.internshipId] = (counts[app.internshipId] || 0) + 1;
    }
    return counts;
  }, [allApplications]);

  const deleteMut = useMutation({
    mutationFn: (id) => api.delete(`/admin/internships/${id}`),
    onSuccess: () => {
      toast.success("Internship deleted");
      qc.invalidateQueries({ queryKey: ["admin-internships"] });
      setDeleteTarget(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || "Delete failed"),
  });

  const duplicateMut = useMutation({
    mutationFn: (id) => api.post(`/admin/internships/${id}/duplicate`),
    onSuccess: () => {
      toast.success("Internship duplicated");
      qc.invalidateQueries({ queryKey: ["admin-internships"] });
    },
    onError: (err) => toast.error(err.response?.data?.message || "Duplicate failed"),
  });

  const items = data || [];

  return (
    <div>
      <PageHeader
        title="Internships"
        description="Manage listings and review applicants in status blocks per internship."
        actions={
          <Link to="/admin/internships/new">
            <Button><Plus className="w-4 h-4 mr-2" />New Internship</Button>
          </Link>
        }
      />
      {isError && <p className="text-sm text-red-600 mb-4">Failed to load internships from API.</p>}

      <RecruitmentPopupToggle type="internships" label="Internships" />

      {!isLoading && items.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No internships yet"
          description="Create your first internship listing to start receiving applications."
          actionLabel="Create first internship"
          actionTo="/admin/internships/new"
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="table-scroll">
          <table className="w-full text-sm table-min-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase">Title</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase hidden md:table-cell">Department</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase hidden sm:table-cell">Applicants</th>
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
                      <Link to={`/admin/internships/${item.id}/applications`} className="font-medium text-slate-900 hover:text-blue-600">{item.title}</Link>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell text-slate-500">{item.department}</td>
                    <td className="px-4 py-4"><StatusBadge status={item.status} /></td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <Link to={`/admin/internships/${item.id}/applications`} className="inline-flex items-center gap-1.5 text-slate-600 hover:text-blue-600">
                        <Users className="w-4 h-4" />
                        {appCountByInternship[item.id] || 0}
                      </Link>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link to={`/admin/internships/${item.id}/applications`} className="p-2 rounded-lg text-blue-600 hover:bg-blue-50" title="Manage applicants">
                          <Users className="w-4 h-4" />
                        </Link>
                        <Link to={`/admin/internships/${item.id}/edit`} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100" title="Edit">
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button type="button" onClick={() => duplicateMut.mutate(item.id)} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100" title="Duplicate">
                          <Copy className="w-4 h-4" />
                        </button>
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
        title="Delete internship?"
        message={`"${deleteTarget?.title}" will be permanently removed. This cannot be undone.`}
        onConfirm={() => deleteMut.mutate(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
        loading={deleteMut.isPending}
      />
    </div>
  );
};

export default InternshipsAdmin;
