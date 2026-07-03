import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import api from "../api/client";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import Button from "../../components/ui/Button";
import MarkdownPreview from "../components/MarkdownPreview";
import ConfirmDialog from "../components/ConfirmDialog";
import toast from "react-hot-toast";

const selectClass =
  "w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400";

const BlogForm = () => {
  const { id } = useParams();
  const isNew = id === "new";
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [showPreview, setShowPreview] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: { status: "DRAFT", tags: "" },
  });

  const content = watch("content");

  const { data: item } = useQuery({
    queryKey: ["blog", id],
    enabled: !isNew,
    queryFn: async () => {
      const { data: res } = await api.get(`/admin/blogs/${id}`);
      return res.data;
    },
  });

  useEffect(() => {
    if (item) {
      reset({
        ...item,
        tags: Array.isArray(item.tags) ? item.tags.join(", ") : item.tags || "",
      });
    }
  }, [item, reset]);

  const saveMut = useMutation({
    mutationFn: (body) => {
      const payload = {
        ...body,
        tags: body.tags ? body.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      };
      return isNew ? api.post("/admin/blogs", payload) : api.put(`/admin/blogs/${id}`, payload);
    },
    onSuccess: () => {
      toast.success(isNew ? "Post created" : "Post updated");
      qc.invalidateQueries({ queryKey: ["admin-blogs"] });
      navigate("/admin/blogs");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Save failed"),
  });

  const deleteMut = useMutation({
    mutationFn: () => api.delete(`/admin/blogs/${id}`),
    onSuccess: () => {
      toast.success("Post deleted");
      qc.invalidateQueries({ queryKey: ["admin-blogs"] });
      navigate("/admin/blogs");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Delete failed"),
  });

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">{isNew ? "New Blog Post" : "Edit Blog Post"}</h1>
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
        >
          {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {showPreview ? "Edit" : "Preview"}
        </button>
      </div>

      {showPreview ? (
        <div className="p-6 rounded-xl bg-white border border-slate-200/80 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">{watch("title") || "Untitled"}</h2>
          {watch("excerpt") && <p className="text-slate-500 mb-6">{watch("excerpt")}</p>}
          <MarkdownPreview content={content} />
        </div>
      ) : (
        <form
          onSubmit={handleSubmit((d) => saveMut.mutate(d))}
          className="space-y-5 p-6 rounded-xl bg-white border border-slate-200/80 shadow-sm"
        >
          <Input label="Title *" {...register("title", { required: true })} />
          <Input label="Slug" {...register("slug")} placeholder="auto-generated if empty" />
          <Input label="Excerpt" {...register("excerpt")} />
          <div className="grid md:grid-cols-2 gap-4">
            <Input label="Category" {...register("category")} />
            <Input label="Author" {...register("author")} />
            <Input label="Tags (comma-separated)" {...register("tags")} placeholder="react, careers" />
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select {...register("status")} className={selectClass}>
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
          </div>
          <Input label="Featured Image URL" {...register("featuredImage")} />
          <div>
            <label className="block text-sm font-medium mb-2">Content (Markdown) *</label>
            <Textarea
              rows={14}
              {...register("content", { required: true })}
              placeholder="# Heading&#10;&#10;Write your post in **markdown**..."
              className="font-mono text-sm"
            />
            <p className="text-xs text-slate-400 mt-1">Supports # headings, **bold**, *italic*, lists, links, and `code`.</p>
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="submit" loading={saveMut.isPending}>Save Post</Button>
            <Button type="button" variant="secondary" onClick={() => navigate("/admin/blogs")}>Cancel</Button>
            {!isNew && (
              <Button type="button" variant="danger" onClick={() => setConfirmDelete(true)} className="ml-auto">Delete</Button>
            )}
          </div>
        </form>
      )}

      <ConfirmDialog open={confirmDelete} title="Delete blog post?" message="This post will be permanently removed." onConfirm={() => deleteMut.mutate()} onCancel={() => setConfirmDelete(false)} loading={deleteMut.isPending} />
    </div>
  );
};

export default BlogForm;
