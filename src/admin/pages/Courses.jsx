import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, GraduationCap, Users } from "lucide-react";
import api from "../api/client";
import { useAdminData } from "../hooks/useAdminData";
import { getCourseDisplayImage } from "../../utils/courseImages";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import EmptyState from "../components/EmptyState";
import ConfirmDialog from "../components/ConfirmDialog";
import RecruitmentPopupToggle from "../components/RecruitmentPopupToggle";
import Button from "../../components/ui/Button";
import toast from "react-hot-toast";

const CoursesAdmin = () => {
  const qc = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data, isLoading, isError } = useAdminData(["admin-courses"], async () => {
    const { data: res } = await api.get("/admin/courses");
    return res.data;
  });

  const { data: enrollments } = useAdminData(["admin-enrollments", "all"], async () => {
    const { data: res } = await api.get("/admin/courses/enrollments/list", { params: { limit: 500 } });
    return res.data;
  });

  const countByCourse = (courseId) =>
    (enrollments || []).filter((e) => e.courseId === courseId).length;

  const deleteMut = useMutation({
    mutationFn: (id) => api.delete(`/admin/courses/${id}`),
    onSuccess: () => {
      toast.success("Course deleted");
      qc.invalidateQueries({ queryKey: ["admin-courses"] });
      setDeleteTarget(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || "Delete failed"),
  });

  return (
    <div>
      <PageHeader
        title="Courses"
        description="Buland Parwaz program courses."
        actions={
          <Link to="/admin/courses/new">
            <Button><Plus className="w-4 h-4 mr-2" />New Course</Button>
          </Link>
        }
      />
      <RecruitmentPopupToggle type="courses" label="Courses" />
      {isError && <p className="text-sm text-red-600 mb-4">Failed to load courses.</p>}

      {!isLoading && (data || []).length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="No courses yet"
          description="Create your first course to start enrolling students."
          actionLabel="Create first course"
          actionTo="/admin/courses/new"
        />
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {isLoading ? (
            <p className="text-slate-400">Loading...</p>
          ) : (
            (data || []).map((c) => (
              <div key={c.id} className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-sm">
                <div className="h-32 bg-slate-100">
                  <img
                    src={getCourseDisplayImage(c)}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5">
                <div className="flex justify-between gap-3">
                  <div>
                    <Link to={`/admin/courses/${c.id}`} className="font-semibold text-slate-900 hover:text-blue-600">{c.title}</Link>
                    <p className="text-sm text-slate-500">{c.category}</p>
                    {c.isCompleted && (
                      <span className="inline-block mt-1 text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                        Completed — shown in Previous Courses
                      </span>
                    )}
                  </div>
                  <StatusBadge status={c.status} />
                </div>
                <p className="text-sm text-slate-600 mt-3 line-clamp-2">{c.description}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <Link
                    to={`/admin/courses/${c.id}/students`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100"
                  >
                    <Users className="w-3 h-3" /> Students ({countByCourse(c.id)})
                  </Link>
                  <Link to={`/admin/courses/${c.id}`} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100">
                    <Pencil className="w-3 h-3" /> Edit
                  </Link>
                  <button type="button" onClick={() => setDeleteTarget(c)} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100">
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete course?"
        message={`"${deleteTarget?.title}" will be permanently removed.`}
        onConfirm={() => deleteMut.mutate(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
        loading={deleteMut.isPending}
      />
    </div>
  );
};

export default CoursesAdmin;
