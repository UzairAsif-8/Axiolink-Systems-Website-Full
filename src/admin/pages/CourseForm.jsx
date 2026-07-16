import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/client";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import Button from "../../components/ui/Button";
import ConfirmDialog from "../components/ConfirmDialog";
import CourseImageField from "../components/CourseImageField";
import toast from "react-hot-toast";

const selectClass =
  "w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400";

const CourseForm = () => {
  const { id } = useParams();
  const isNew = id === "new";
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [thumbnailPublicId, setThumbnailPublicId] = useState(null);
  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      status: "DRAFT",
      enrollmentOpen: false,
      certificateAvailable: true,
      isCompleted: false,
    },
  });

  const isCompleted = watch("isCompleted");

  const { data: item } = useQuery({
    queryKey: ["course", id],
    enabled: !isNew,
    queryFn: async () => {
      const { data: res } = await api.get(`/admin/courses/${id}`);
      return res.data;
    },
  });

  useEffect(() => {
    if (item) {
      reset({
        ...item,
        enrollmentOpen: Boolean(item.enrollmentOpen),
        certificateAvailable: item.certificateAvailable !== false,
        isCompleted: Boolean(item.isCompleted),
      });
      setThumbnailUrl(item.thumbnailUrl || null);
      setThumbnailPublicId(item.thumbnailPublicId || null);
    }
  }, [item, reset]);

  const saveMut = useMutation({
    mutationFn: (body) =>
      isNew ? api.post("/admin/courses", body) : api.put(`/admin/courses/${id}`, body),
    onSuccess: () => {
      toast.success(isNew ? "Course created" : "Course updated");
      qc.invalidateQueries({ queryKey: ["admin-courses"] });
      navigate("/admin/courses");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Save failed"),
  });

  const deleteMut = useMutation({
    mutationFn: () => api.delete(`/admin/courses/${id}`),
    onSuccess: () => {
      toast.success("Course deleted");
      qc.invalidateQueries({ queryKey: ["admin-courses"] });
      navigate("/admin/courses");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Delete failed"),
  });

  const onSubmit = (data) => {
    const completed = Boolean(data.isCompleted);
    saveMut.mutate({
      ...data,
      thumbnailUrl: thumbnailUrl || null,
      thumbnailPublicId: thumbnailPublicId || null,
      enrollmentOpen: completed ? false : Boolean(data.enrollmentOpen),
      certificateAvailable: Boolean(data.certificateAvailable),
      isCompleted: completed,
      ...(completed && !item?.completedAt ? { completedAt: new Date().toISOString() } : {}),
    });
  };

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">{isNew ? "New Course" : "Edit Course"}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-6 rounded-xl bg-white border border-slate-200/80 shadow-sm">
        <CourseImageField
          thumbnailUrl={thumbnailUrl}
          thumbnailPublicId={thumbnailPublicId}
          onChange={({ thumbnailUrl: url, thumbnailPublicId: publicId }) => {
            setThumbnailUrl(url);
            setThumbnailPublicId(publicId);
          }}
        />

        <Input label="Title *" {...register("title", { required: true })} />
        <Input label="Slug" {...register("slug")} placeholder="auto-generated from title if empty" />
        <Input label="Category" {...register("category")} placeholder="e.g. Web Development, AI" />
        <Textarea label="Description *" rows={4} {...register("description", { required: true })} />
        <div className="grid md:grid-cols-2 gap-4">
          <Input label="Duration" {...register("duration")} placeholder="e.g. 8 weeks" />
          <Input label="Level" {...register("level")} placeholder="e.g. Beginner" />
          <Input label="Price (PKR)" type="number" {...register("price", { valueAsNumber: true })} />
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select {...register("status")} className={selectClass}>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register("enrollmentOpen")} disabled={isCompleted} />
          Enrollment open
          {isCompleted && (
            <span className="text-slate-400 text-xs">(closed when course is completed)</span>
          )}
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register("certificateAvailable")} />
          Certificate available
        </label>
        <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-4">
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" {...register("isCompleted")} className="mt-0.5" />
            <span>
              <span className="font-medium text-slate-900">Mark course as completed</span>
              <span className="block text-slate-600 mt-1">
                Moves this course to the &ldquo;Previous Courses&rdquo; section on the Buland Parwaz
                page and closes enrollment.
              </span>
            </span>
          </label>
        </div>
        <div className="flex gap-3 pt-4">
          <Button type="submit" loading={saveMut.isPending}>Save</Button>
          <Button type="button" variant="secondary" onClick={() => navigate("/admin/courses")}>Cancel</Button>
          {!isNew && (
            <Button type="button" variant="danger" onClick={() => setConfirmDelete(true)} className="ml-auto">Delete</Button>
          )}
        </div>
      </form>
      <ConfirmDialog open={confirmDelete} title="Delete course?" message="This course will be permanently removed." onConfirm={() => deleteMut.mutate()} onCancel={() => setConfirmDelete(false)} loading={deleteMut.isPending} />
    </div>
  );
};

export default CourseForm;
