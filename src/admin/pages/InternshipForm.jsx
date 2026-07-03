import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/client";
import Textarea from "../../components/ui/Textarea";
import Button from "../../components/ui/Button";
import ConfirmDialog from "../components/ConfirmDialog";
import FormSelectWithCustom from "../components/FormSelectWithCustom";
import TechStackMultiSelect from "../components/TechStackMultiSelect";
import {
  INTERNSHIP_DEPARTMENTS,
  INTERNSHIP_TITLE_OPTIONS,
  INTERNSHIP_DURATION_OPTIONS,
  INTERNSHIP_STIPEND_OPTIONS,
  INTERNSHIP_POSITION_OPTIONS,
  INTERNSHIP_SKILL_LEVEL_OPTIONS,
  INTERNSHIP_STATUS_OPTIONS,
  INTERNSHIP_WORK_MODE_OPTIONS,
  INTERNSHIP_COMPENSATION_OPTIONS,
  INTERNSHIP_APPLICATION_DEADLINE_OPTIONS,
  YES_NO_OPTIONS,
  LIST_TEMPLATES,
  DESCRIPTION_TEMPLATES,
  ALL_TECHNOLOGY_OPTIONS,
  slugifyTitle,
  getTechStackForTitle,
  computeDeadline,
} from "../constants/internshipForm";
import toast from "react-hot-toast";

const defaultDescription = DESCRIPTION_TEMPLATES.standard.text;

const defaultValues = {
  title: "",
  department: "",
  description: defaultDescription,
  location: "Hybrid — Karachi & Remote",
  workMode: "HYBRID",
  duration: "3 months",
  workingHours: "Flexible (20–40 hrs/week)",
  type: "Professional Internship",
  compensation: "unpaid",
  stipend: "Unpaid",
  positions: "10",
  deadlineDays: "",
  joiningDate: "Rolling basis",
  skillLevel: "Beginner to Intermediate",
  status: "PUBLISHED",
  applicationsOpen: "true",
  technologies: [],
};

const InternshipForm = () => {
  const { id } = useParams();
  const isNew = !id || id === "new";
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const {
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm({ defaultValues, mode: "onSubmit" });
  const selectedTitle = watch("title");
  const selectedTechnologies = watch("technologies") || [];
  const compensation = watch("compensation");
  const prevTitleRef = useRef(null);
  const techStack = useMemo(() => getTechStackForTitle(selectedTitle), [selectedTitle]);
  const techOptions = useMemo(() => {
    const base = techStack.options?.length ? techStack.options : ALL_TECHNOLOGY_OPTIONS;
    const extras = selectedTechnologies.filter((tech) => !base.includes(tech));
    return [...base, ...extras];
  }, [techStack.options, selectedTechnologies]);
  const techStackLabel =
    techStack.options?.length > 0 ? techStack.label : "Custom or all technologies";

  const departmentOptions = useMemo(
    () => INTERNSHIP_DEPARTMENTS.map((name) => ({ value: name, label: name })),
    []
  );

  const { data: item } = useQuery({
    queryKey: ["internship", id],
    enabled: !isNew,
    queryFn: async () => {
      const { data: res } = await api.get(`/admin/internships/${id}`);
      return res.data;
    },
  });

  useEffect(() => {
    if (!item) return;
    reset({
      title: item.title || "",
      department: item.department || "",
      description: item.description || "",
      workMode: item.workMode || defaultValues.workMode,
      duration: item.duration || defaultValues.duration,
      compensation: item.paid === false ? "unpaid" : "paid",
      stipend: item.paid === false ? "Unpaid" : item.stipend || defaultValues.stipend,
      positions: String(item.positions ?? defaultValues.positions),
      deadlineDays: "",
      skillLevel: item.skillLevel || defaultValues.skillLevel,
      status: item.status || defaultValues.status,
      applicationsOpen: item.applicationsOpen !== false ? "true" : "false",
      technologies:
        item.technologies?.length > 0
          ? item.technologies
          : getTechStackForTitle(item.title).defaults,
    });
    prevTitleRef.current = item.title || "";
  }, [item, reset]);

  useEffect(() => {
    if (!selectedTitle) return;
    const preset = INTERNSHIP_TITLE_OPTIONS.find((option) => option.title === selectedTitle);
    if (!preset) return;

    setValue("department", preset.department, { shouldValidate: true });
    setValue("skillLevel", preset.skillLevel, { shouldValidate: true });
    setValue(
      "description",
      `Join Axiolink Systems (Pvt) Ltd. as a ${selectedTitle.replace(/ Internship$/i, "")} intern and work on production-grade projects with mentorship from senior professionals.`,
      { shouldValidate: true }
    );

    if (prevTitleRef.current === selectedTitle) return;

    prevTitleRef.current = selectedTitle;
    const stack = getTechStackForTitle(selectedTitle);
    setValue("technologies", stack.defaults, { shouldValidate: true });
  }, [selectedTitle, setValue]);

  const saveMut = useMutation({
    mutationFn: (body) =>
      isNew ? api.post("/admin/internships", body) : api.put(`/admin/internships/${id}`, body),
    onSuccess: () => {
      toast.success(isNew ? "Internship published" : "Internship updated");
      qc.invalidateQueries({ queryKey: ["admin-internships"] });
      qc.invalidateQueries({ queryKey: ["internships"] });
      navigate("/admin/internships");
    },
    onError: (err) => {
      const apiErrors = err.response?.data?.errors;
      if (Array.isArray(apiErrors) && apiErrors.length > 0) {
        toast.error(apiErrors.map((e) => e.message).join(" · "));
        return;
      }
      toast.error(err.response?.data?.message || "Save failed");
    },
  });

  const deleteMut = useMutation({
    mutationFn: () => api.delete(`/admin/internships/${id}`),
    onSuccess: () => {
      toast.success("Internship deleted");
      qc.invalidateQueries({ queryKey: ["admin-internships"] });
      navigate("/admin/internships");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Delete failed"),
  });

  const backToApplications = !isNew ? `/admin/internships/${id}/applications` : "/admin/internships";

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

    const isPaid = data.compensation === "paid";
    const baseSlug = slugifyTitle(data.title);
    const slug = isNew
      ? `${baseSlug}-${Date.now().toString(36).slice(-6)}`
      : item?.slug || baseSlug;

    saveMut.mutate({
      title: data.title,
      slug,
      department: data.department,
      description: data.description,
      location: item?.location || defaultValues.location,
      workMode: workModeUpper,
      duration: data.duration,
      workingHours: item?.workingHours || defaultValues.workingHours,
      type: item?.type || defaultValues.type,
      joiningDate: item?.joiningDate || defaultValues.joiningDate,
      skillLevel: data.skillLevel,
      deadline: computeDeadline(data.deadlineDays),
      paid: isPaid,
      stipend: isPaid ? data.stipend : data.compensation === "unpaid" ? null : data.stipend || null,
      positions: positionsNum,
      status: statusUpper,
      applicationsOpen: ["true", "yes", "1"].includes(String(data.applicationsOpen).toLowerCase()),
      responsibilities: item?.responsibilities?.length
        ? item.responsibilities
        : LIST_TEMPLATES.responsibilities.standard.items,
      requirements: item?.requirements?.length
        ? item.requirements
        : LIST_TEMPLATES.requirements.standard.items,
      benefits: item?.benefits?.length ? item.benefits : LIST_TEMPLATES.benefits.standard.items,
      whatYouLearn: item?.whatYouLearn?.length
        ? item.whatYouLearn
        : LIST_TEMPLATES.whatYouLearn.standard.items,
      whoCanApply: item?.whoCanApply?.length
        ? item.whoCanApply
        : LIST_TEMPLATES.whoCanApply.standard.items,
      technologies: data.technologies?.length
        ? data.technologies
        : getTechStackForTitle(data.title).defaults,
      featured: item?.featured ?? false,
    });
  };

  return (
    <div className="max-w-3xl w-full mx-auto space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">
        {isNew ? "New Internship" : "Edit Internship"}
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit, (invalid) => {
          const firstError = Object.values(invalid)[0];
          toast.error(firstError?.message || "Please complete all required fields.");
        })}
        className="space-y-5 p-4 sm:p-6 rounded-xl bg-white border border-slate-200/80 shadow-sm"
        noValidate
      >
        <Controller
          name="title"
          control={control}
          rules={{ required: "Select or enter an internship title" }}
          render={({ field }) => (
            <FormSelectWithCustom
              label="Internship title *"
              error={errors.title?.message}
              options={INTERNSHIP_TITLE_OPTIONS.map((option) => option.title)}
              allowEmpty
              emptyLabel="Select a role"
              customPlaceholder="Custom internship title"
              {...field}
            />
          )}
        />

        <Controller
          name="department"
          control={control}
          rules={{ required: "Select or enter a department" }}
          render={({ field }) => (
            <FormSelectWithCustom
              label="Department *"
              error={errors.department?.message}
              options={departmentOptions.map((dept) => dept.value)}
              allowEmpty
              emptyLabel="Select department"
              customPlaceholder="Custom department name"
              {...field}
            />
          )}
        />

        <Controller
          name="description"
          control={control}
          rules={{
            required: "Description is required",
            minLength: { value: 10, message: "Description must be at least 10 characters" },
          }}
          render={({ field }) => (
            <Textarea
              label="Description *"
              rows={4}
              placeholder="Brief overview of the internship role..."
              error={errors.description?.message}
              {...field}
            />
          )}
        />

        <Controller
          name="technologies"
          control={control}
          rules={{
            validate: (value) =>
              (Array.isArray(value) && value.length > 0) || "Select at least one technology",
          }}
          render={({ field }) => (
            <TechStackMultiSelect
              label="Technology stack *"
              stackLabel={techStackLabel}
              options={techOptions}
              value={field.value}
              onChange={field.onChange}
              error={errors.technologies?.message}
            />
          )}
        />

        <p className="text-sm font-semibold text-slate-800 pt-2 border-t border-slate-100">
          Role details
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <Controller
            name="workMode"
            control={control}
            render={({ field }) => (
              <FormSelectWithCustom
                label="Work mode"
                options={INTERNSHIP_WORK_MODE_OPTIONS}
                customPlaceholder="REMOTE, HYBRID, or ONSITE"
                helperText="Custom: type REMOTE, HYBRID, or ONSITE"
                {...field}
              />
            )}
          />

          <Controller
            name="duration"
            control={control}
            render={({ field }) => (
              <FormSelectWithCustom
                label="Duration"
                options={INTERNSHIP_DURATION_OPTIONS}
                customPlaceholder="e.g. 12 weeks"
                {...field}
              />
            )}
          />

          <Controller
            name="compensation"
            control={control}
            render={({ field }) => (
              <FormSelectWithCustom
                label="Compensation"
                options={INTERNSHIP_COMPENSATION_OPTIONS}
                customPlaceholder="Describe compensation"
                {...field}
              />
            )}
          />

          {compensation === "paid" && (
            <Controller
              name="stipend"
              control={control}
              render={({ field }) => (
                <FormSelectWithCustom
                  label="Stipend"
                  options={INTERNSHIP_STIPEND_OPTIONS.filter((o) => o !== "Unpaid")}
                  customPlaceholder="Custom stipend amount"
                  {...field}
                />
              )}
            />
          )}

          <Controller
            name="positions"
            control={control}
            render={({ field }) => (
              <FormSelectWithCustom
                label="Open positions"
                options={INTERNSHIP_POSITION_OPTIONS}
                customPlaceholder="Number of positions"
                customInputType="number"
                customMin={1}
                {...field}
              />
            )}
          />

          <Controller
            name="deadlineDays"
            control={control}
            render={({ field }) => (
              <FormSelectWithCustom
                label="Application deadline"
                options={INTERNSHIP_APPLICATION_DEADLINE_OPTIONS}
                customPlaceholder="Days from today (number)"
                customInputType="number"
                customMin={1}
                {...field}
              />
            )}
          />

          <Controller
            name="skillLevel"
            control={control}
            render={({ field }) => (
              <FormSelectWithCustom
                label="Skill level"
                options={INTERNSHIP_SKILL_LEVEL_OPTIONS}
                customPlaceholder="Custom skill level"
                {...field}
              />
            )}
          />
        </div>

        <p className="text-sm font-semibold text-slate-800 pt-2 border-t border-slate-100">
          Publishing
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <FormSelectWithCustom
                label="Status"
                helperText="Only Published internships appear on the careers page. Custom: DRAFT, PUBLISHED, or ARCHIVED."
                options={INTERNSHIP_STATUS_OPTIONS}
                customPlaceholder="DRAFT, PUBLISHED, or ARCHIVED"
                {...field}
              />
            )}
          />

          <Controller
            name="applicationsOpen"
            control={control}
            render={({ field }) => (
              <FormSelectWithCustom
                label="Applications open"
                options={YES_NO_OPTIONS}
                customPlaceholder="true or false"
                {...field}
              />
            )}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" loading={saveMut.isPending}>
            Save
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(isNew ? "/admin/internships" : backToApplications)}
          >
            Cancel
          </Button>
          {!isNew && (
            <Button
              type="button"
              variant="danger"
              onClick={() => setConfirmDelete(true)}
              className="ml-auto"
            >
              Delete
            </Button>
          )}
        </div>
      </form>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete internship?"
        message="This internship will be permanently removed."
        onConfirm={() => deleteMut.mutate()}
        onCancel={() => setConfirmDelete(false)}
        loading={deleteMut.isPending}
      />
    </div>
  );
};

export default InternshipForm;
