import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/client";
import Textarea from "../../components/ui/Textarea";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import ConfirmDialog from "../components/ConfirmDialog";
import FormSelectWithCustom from "../components/FormSelectWithCustom";
import StringListField from "../components/StringListField";
import {
  JOB_DEPARTMENTS,
  JOB_TYPE_OPTIONS,
  JOB_WORK_MODE_OPTIONS,
  JOB_STATUS_OPTIONS,
  JOB_SALARY_OPTIONS,
  DEFAULT_LISTS,
  slugifyTitle,
  computeDeadline,
} from "../constants/jobForm";
import toast from "react-hot-toast";

const defaultValues = {
  title: "",
  department: "",
  description: "",
  location: "Hybrid — Karachi & Remote",
  workMode: "HYBRID",
  type: "Full-time",
  salaryRange: "Competitive",
  positions: "1",
  deadlineDays: "",
  status: "PUBLISHED",
  applicationsOpen: "true",
  featured: "false",
  responsibilities: DEFAULT_LISTS.responsibilities,
  requirements: DEFAULT_LISTS.requirements,
  benefits: DEFAULT_LISTS.benefits,
};

const JobForm = () => {
  const { id } = useParams();
  const isNew = !id || id === "new";
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const {
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm({ defaultValues, mode: "onSubmit" });

  const { data: item } = useQuery({
    queryKey: ["job-admin", id],
    enabled: !isNew,
    queryFn: async () => {
      const { data: res } = await api.get(`/admin/jobs/${id}`);
      return res.data;
    },
  });

  useEffect(() => {
    if (!item) return;
    reset({
      title: item.title || "",
      department: item.department || "",
      description: item.description || "",
      location: item.location || defaultValues.location,
      workMode: item.workMode || defaultValues.workMode,
      type: item.type || defaultValues.type,
      salaryRange: item.salaryRange || defaultValues.salaryRange,
      positions: String(item.positions ?? 1),
      deadlineDays: "",
      status: item.status || defaultValues.status,
      applicationsOpen: item.applicationsOpen !== false ? "true" : "false",
      featured: item.featured ? "true" : "false",
      responsibilities: item.responsibilities?.length ? item.responsibilities : DEFAULT_LISTS.responsibilities,
      requirements: item.requirements?.length ? item.requirements : DEFAULT_LISTS.requirements,
      benefits: item.benefits?.length ? item.benefits : DEFAULT_LISTS.benefits,
    });
  }, [item, reset]);

  const saveMut = useMutation({
    mutationFn: (body) =>
      isNew ? api.post("/admin/jobs", body) : api.put(`/admin/jobs/${id}`, body),
    onSuccess: () => {
      toast.success(isNew ? "Job created" : "Job updated");
      qc.invalidateQueries({ queryKey: ["admin-jobs"] });
      qc.invalidateQueries({ queryKey: ["jobs"] });
      navigate("/admin/jobs");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Save failed");
    },
  });

  const deleteMut = useMutation({
    mutationFn: () => api.delete(`/admin/jobs/${id}`),
    onSuccess: () => {
      toast.success("Job deleted");
      qc.invalidateQueries({ queryKey: ["admin-jobs"] });
      qc.invalidateQueries({ queryKey: ["jobs"] });
      navigate("/admin/jobs");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Delete failed"),
  });

  const onSubmit = (data) => {
    const workModeUpper = String(data.workMode || "").trim().toUpperCase();
    if (!["REMOTE", "HYBRID", "ONSITE"].includes(workModeUpper)) {
      toast.error("Work mode must be Remote, Hybrid, or Onsite.");
      return;
    }
    const statusUpper = String(data.status || "").trim().toUpperCase();
    if (!["DRAFT", "PUBLISHED", "ARCHIVED"].includes(statusUpper)) {
      toast.error("Status must be Draft, Published, or Archived.");
      return;
    }
    const positionsNum = Number(data.positions);
    if (!Number.isFinite(positionsNum) || positionsNum < 1) {
      toast.error("Open positions must be at least 1.");
      return;
    }

    const baseSlug = slugifyTitle(data.title);
    const slug = isNew
      ? `${baseSlug}-${Date.now().toString(36).slice(-6)}`
      : item?.slug || baseSlug;

    saveMut.mutate({
      title: data.title,
      slug,
      department: data.department,
      description: data.description,
      location: data.location,
      workMode: workModeUpper,
      type: data.type,
      salaryRange: data.salaryRange || null,
      deadline: computeDeadline(data.deadlineDays),
      positions: positionsNum,
      status: statusUpper,
      applicationsOpen: ["true", "yes", "1"].includes(String(data.applicationsOpen).toLowerCase()),
      featured: ["true", "yes", "1"].includes(String(data.featured).toLowerCase()),
      responsibilities: data.responsibilities?.length ? data.responsibilities : DEFAULT_LISTS.responsibilities,
      requirements: data.requirements?.length ? data.requirements : DEFAULT_LISTS.requirements,
      benefits: data.benefits?.length ? data.benefits : DEFAULT_LISTS.benefits,
    });
  };

  return (
    <div className="max-w-3xl w-full mx-auto space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">
        {isNew ? "New Job" : "Edit Job"}
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit, () => toast.error("Please complete all required fields."))}
        className="space-y-5 p-4 sm:p-6 rounded-xl bg-white border border-slate-200/80 shadow-sm"
        noValidate
      >
        <Controller
          name="title"
          control={control}
          rules={{ required: "Job title is required" }}
          render={({ field }) => (
            <Input
              label="Job title *"
              placeholder="e.g. Senior Software Engineer"
              error={errors.title?.message}
              {...field}
            />
          )}
        />

        <Controller
          name="department"
          control={control}
          rules={{ required: "Department is required" }}
          render={({ field }) => (
            <FormSelectWithCustom
              label="Department *"
              error={errors.department?.message}
              options={JOB_DEPARTMENTS}
              allowEmpty
              emptyLabel="Select department"
              customPlaceholder="Custom department"
              {...field}
            />
          )}
        />

        <Controller
          name="description"
          control={control}
          rules={{ required: "Description is required", minLength: { value: 10, message: "At least 10 characters" } }}
          render={({ field }) => (
            <Textarea label="Description *" rows={4} error={errors.description?.message} {...field} />
          )}
        />

        <Controller
          name="responsibilities"
          control={control}
          rules={{ validate: (v) => (v?.length > 0) || "Add at least one responsibility" }}
          render={({ field }) => (
            <StringListField label="Responsibilities *" error={errors.responsibilities?.message} {...field} />
          )}
        />

        <Controller
          name="requirements"
          control={control}
          rules={{ validate: (v) => (v?.length > 0) || "Add at least one requirement" }}
          render={({ field }) => (
            <StringListField label="Requirements *" error={errors.requirements?.message} {...field} />
          )}
        />

        <Controller
          name="benefits"
          control={control}
          rules={{ validate: (v) => (v?.length > 0) || "Add at least one benefit" }}
          render={({ field }) => (
            <StringListField label="Benefits *" error={errors.benefits?.message} {...field} />
          )}
        />

        <p className="text-sm font-semibold text-slate-800 pt-2 border-t border-slate-100">Role details</p>

        <div className="grid md:grid-cols-2 gap-4">
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <FormSelectWithCustom label="Job type" options={JOB_TYPE_OPTIONS} customPlaceholder="e.g. Full-time" {...field} />
            )}
          />
          <Controller
            name="workMode"
            control={control}
            render={({ field }) => (
              <FormSelectWithCustom label="Work mode" options={JOB_WORK_MODE_OPTIONS} customPlaceholder="REMOTE, HYBRID, or ONSITE" {...field} />
            )}
          />
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <Input label="Location" placeholder="e.g. Karachi, Pakistan" {...field} />
            )}
          />
          <Controller
            name="salaryRange"
            control={control}
            render={({ field }) => (
              <FormSelectWithCustom label="Salary range" options={JOB_SALARY_OPTIONS} customPlaceholder="Custom salary range" {...field} />
            )}
          />
          <Controller
            name="positions"
            control={control}
            render={({ field }) => (
              <FormSelectWithCustom label="Open positions" options={["1", "2", "3", "5", "10"]} customInputType="number" customMin={1} {...field} />
            )}
          />
          <Controller
            name="deadlineDays"
            control={control}
            render={({ field }) => (
              <FormSelectWithCustom
                label="Application deadline"
                options={["", "7", "14", "30", "60", "90"]}
                customPlaceholder="Days from today (number)"
                customInputType="number"
                {...field}
              />
            )}
          />
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <FormSelectWithCustom label="Status" options={JOB_STATUS_OPTIONS} {...field} />
            )}
          />
          <Controller
            name="applicationsOpen"
            control={control}
            render={({ field }) => (
              <FormSelectWithCustom label="Accepting applications" options={["true", "false"]} {...field} />
            )}
          />
          <Controller
            name="featured"
            control={control}
            render={({ field }) => (
              <FormSelectWithCustom label="Featured on careers page" options={["false", "true"]} {...field} />
            )}
          />
        </div>

        <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-100">
          <Button type="submit" loading={saveMut.isPending}>
            {isNew ? "Publish Job" : "Save Changes"}
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate("/admin/jobs")}>
            Cancel
          </Button>
          {!isNew && (
            <Button type="button" variant="ghost" className="text-red-600 ml-auto" onClick={() => setConfirmDelete(true)}>
              Delete
            </Button>
          )}
        </div>
      </form>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete job?"
        message="This job listing will be permanently removed."
        onConfirm={() => deleteMut.mutate()}
        onCancel={() => setConfirmDelete(false)}
        loading={deleteMut.isPending}
      />
    </div>
  );
};

export default JobForm;
