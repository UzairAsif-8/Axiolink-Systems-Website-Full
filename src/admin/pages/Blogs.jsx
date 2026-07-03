import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, BookOpen } from "lucide-react";
import api from "../api/client";
import { useAdminData } from "../hooks/useAdminData";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import EmptyState from "../components/EmptyState";
import ConfirmDialog from "../components/ConfirmDialog";
import Button from "../../components/ui/Button";
import toast from "react-hot-toast";

const BlogsAdmin = () => {
  const qc = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data, isLoading, isError } = useAdminData(["admin-blogs"], async () => {
    const { data: res } = await api.get("/admin/blogs");
    return res.data;
  });

  const deleteMut = useMutation({
    mutationFn: (id) => api.delete(`/admin/blogs/${id}`),
    onSuccess: () => {
      toast.success("Post deleted");
      qc.invalidateQueries({ queryKey: ["admin-blogs"] });
      setDeleteTarget(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || "Delete failed"),
  });

  return (
    <div>
      <PageHeader
        title="Blog CMS"
        description="Create and publish blog posts."
        actions={
          <Link to="/admin/blogs/new">
            <Button><Plus className="w-4 h-4 mr-2" />New Post</Button>
          </Link>
        }
      />
      {isError && <p className="text-sm text-red-600 mb-4">Failed to load blogs.</p>}

      {!isLoading && (data || []).length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No blog posts yet"
          description="Write your first post to share updates with your audience."
          actionLabel="Create first post"
          actionTo="/admin/blogs/new"
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="table-scroll">
          <table className="w-full text-sm table-min-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase">Title</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase">Category</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="text-right px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-400">Loading...</td></tr>
              ) : (
                (data || []).map((b) => (
                  <tr key={b.id}>
                    <td className="px-6 py-4">
                      <Link to={`/admin/blogs/${b.id}`} className="font-medium text-slate-900 hover:text-blue-600">{b.title}</Link>
                    </td>
                    <td className="px-4 py-4 text-slate-500">{b.category}</td>
                    <td className="px-4 py-4"><StatusBadge status={b.status} /></td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link to={`/admin/blogs/${b.id}`} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100"><Pencil className="w-4 h-4" /></Link>
                        <button type="button" onClick={() => setDeleteTarget(b)} className="p-2 rounded-lg text-red-500 hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
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
        title="Delete blog post?"
        message={`"${deleteTarget?.title}" will be permanently removed.`}
        onConfirm={() => deleteMut.mutate(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
        loading={deleteMut.isPending}
      />
    </div>
  );
};

export default BlogsAdmin;
