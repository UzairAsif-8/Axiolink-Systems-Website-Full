import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { Clock, Shield, Send } from "lucide-react";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
import Button from "../ui/Button";
import FileDropzone from "./FileDropzone";
import ApplicationSuccess from "./ApplicationSuccess";
import {
  buildJobApplicationPayload,
  submitJobApplication,
  fetchJobs,
  getOpenJobs,
} from "../../api/jobs";
import { SITE_CONTACT } from "../../data/siteContact";
import { scrollToRef } from "../../utils/scrollTo";

const JobApplicationForm = ({ defaultJobSlug = "", jobTitle = "" }) => {
  const navigate = useNavigate();
  const { data: apiJobs } = useQuery({ queryKey: ["jobs"], queryFn: fetchJobs });
  const openJobs = getOpenJobs(apiJobs);

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [resume, setResume] = useState(null);
  const [resumeError, setResumeError] = useState("");
  const formRef = useRef(null);
  const errorRef = useRef(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      currentCity: "",
      linkedin: "",
      githubPortfolio: "",
      jobPosition: defaultJobSlug,
      degree: "",
      graduationYear: "",
      whyJoin: "",
      proudProject: "",
      portfolioWebsite: "",
      confirmAccurate: false,
      agreeProcess: false,
    },
  });

  const confirmAccurate = watch("confirmAccurate");
  const agreeProcess = watch("agreeProcess");

  useEffect(() => {
    if (defaultJobSlug) setValue("jobPosition", defaultJobSlug);
  }, [defaultJobSlug, setValue]);

  useEffect(() => {
    if (submitError) scrollToRef(errorRef);
  }, [submitError]);

  const selectedJob = openJobs.find((j) => j.slug === watch("jobPosition"));

  const onSubmit = async (data) => {
    if (!confirmAccurate || !agreeProcess) return;

    setLoading(true);
    setSubmitError("");

    const payload = buildJobApplicationPayload(
      {
        ...data,
        jobTitle: selectedJob?.title || jobTitle || data.jobPosition,
      },
      resume
    );

    try {
      await submitJobApplication(payload);
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err.message || "Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return <ApplicationSuccess onBack={() => navigate("/careers")} />;
  }

  return (
    <div ref={formRef} className="rounded-2xl border border-white/60 bg-white/70 backdrop-blur-xl shadow-xl overflow-hidden scroll-mt-24">
      <div className="px-4 sm:px-6 md:px-8 pt-6 sm:pt-8 pb-5 border-b border-neutral-100 bg-gradient-to-r from-navy-50/50 to-transparent">
        <h2 className="text-xl md:text-2xl font-display font-bold text-neutral-900">
          {jobTitle ? `Apply — ${jobTitle}` : "Job Application"}
        </h2>
        <p className="text-sm text-neutral-500 mt-1 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          Takes about 2 minutes
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit, () => scrollToRef(formRef))} className="px-4 sm:px-6 md:px-8 py-6 sm:py-8 space-y-5">
        {!defaultJobSlug && (
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Position *</label>
            <select
              {...register("jobPosition", { required: "Required" })}
              className="w-full px-4 py-3 text-sm border border-neutral-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select a position</option>
              {openJobs.map((j) => (
                <option key={j.slug} value={j.slug}>{j.title}</option>
              ))}
            </select>
            {errors.jobPosition && (
              <p className="mt-1 text-sm text-red-600">{errors.jobPosition.message}</p>
            )}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-5">
          <Input label="Full Name *" {...register("fullName", { required: "Required" })} error={errors.fullName?.message} />
          <Input label="Email *" type="email" {...register("email", { required: "Required" })} error={errors.email?.message} />
          <Input label="Phone *" type="tel" {...register("phone", { required: "Required" })} error={errors.phone?.message} placeholder={SITE_CONTACT.phone} />
          <Input label="Current City *" {...register("currentCity", { required: "Required" })} error={errors.currentCity?.message} />
          <Input label="LinkedIn" {...register("linkedin")} />
          <Input label="GitHub / Portfolio" {...register("githubPortfolio")} />
          <Input label="Degree / Qualification" {...register("degree")} />
          <Input label="Graduation Year" {...register("graduationYear")} />
        </div>

        <Textarea
          label="Why do you want to join Axiolink? *"
          {...register("whyJoin", { required: "Required" })}
          error={errors.whyJoin?.message}
          rows={5}
        />

        <Textarea label="Relevant experience (optional)" {...register("proudProject")} rows={4} />

        <FileDropzone
          label="Resume / CV"
          value={resume}
          onChange={(file, err) => { setResume(file); setResumeError(err || ""); }}
          error={resumeError}
          emptyHint="PDF only, max 5MB"
        />

        <Input label="Portfolio Website" {...register("portfolioWebsite")} />

        <div className="space-y-3">
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" {...register("confirmAccurate", { required: true })} className="mt-1 rounded" />
            <span className="text-sm text-neutral-600">I confirm that the information provided is accurate.</span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" {...register("agreeProcess", { required: true })} className="mt-1 rounded" />
            <span className="text-sm text-neutral-600">I agree to Axiolink Systems&apos; recruitment process.</span>
          </label>
        </div>

        <p className="flex items-start gap-2 text-xs text-neutral-500">
          <Shield className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          Your information will only be used for recruitment purposes.
        </p>

        {submitError && (
          <p ref={errorRef} role="alert" className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg border border-red-100">
            {submitError}
          </p>
        )}

        <Button
          type="submit"
          size="lg"
          loading={loading}
          disabled={loading || !confirmAccurate || !agreeProcess}
          className="w-full sm:w-auto"
        >
          {!loading && <Send className="mr-2 w-5 h-5" />}
          Submit Application
        </Button>
      </form>
    </div>
  );
};

export default JobApplicationForm;
