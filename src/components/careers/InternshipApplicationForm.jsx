import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Clock, Shield } from "lucide-react";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
import Button from "../ui/Button";
import FileDropzone from "./FileDropzone";
import ApplicationSuccess from "./ApplicationSuccess";
import StepProgress from "./StepProgress";
import InternshipSkillPicker from "./InternshipSkillPicker";
import { getSuggestedSkillsForInternship } from "../../utils/internshipSkills";
import { internships as staticInternships } from "../../data/internships";
import {
  buildApplicationPayload,
  submitInternshipApplication,
  fetchInternships,
  getOpenInternships,
} from "../../api/internships";
import { SITE_CONTACT } from "../../data/siteContact";
import { scrollToRef } from "../../utils/scrollTo";

const STEPS = [
  { id: 1, label: "Personal" },
  { id: 2, label: "Details" },
  { id: 3, label: "Submit" },
];

const LEGACY_DRAFT_PREFIX = "axiolink-internship-draft";

/** Remove old localStorage drafts so prior visitors' data is never restored. */
function clearLegacyInternshipDrafts() {
  if (typeof localStorage === "undefined") return;
  for (let i = localStorage.length - 1; i >= 0; i -= 1) {
    const key = localStorage.key(i);
    if (key?.startsWith(LEGACY_DRAFT_PREFIX)) {
      localStorage.removeItem(key);
    }
  }
}

const selectClass =
  "w-full px-4 py-3 text-sm border border-neutral-200 rounded-xl bg-white/80 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors";

const InternshipApplicationForm = ({
  defaultInternshipSlug = "",
  internshipTitle = "",
}) => {
  const navigate = useNavigate();
  const { data: apiInternships } = useQuery({
    queryKey: ["internships"],
    queryFn: fetchInternships,
  });
  const openInternships = getOpenInternships(apiInternships);
  const positionOptions =
    openInternships.length > 0
      ? openInternships
      : staticInternships.filter((i) => i.status === "open");
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [resume, setResume] = useState(null);
  const [resumeError, setResumeError] = useState("");
  const [skills, setSkills] = useState([]);
  const [skillsError, setSkillsError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      currentCity: "",
      linkedin: "",
      githubPortfolio: "",
      internshipPosition: defaultInternshipSlug,
      university: "",
      degree: "",
      semester: "",
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

  const internshipPosition = watch("internshipPosition");

  const selectedInternship = positionOptions.find((i) => i.slug === internshipPosition);
  const suggestedSkills = getSuggestedSkillsForInternship(selectedInternship);
  const prevPositionRef = useRef(null);
  const formContainerRef = useRef(null);
  const errorBannerRef = useRef(null);
  const skillsSectionRef = useRef(null);

  useEffect(() => {
    if (
      prevPositionRef.current !== null &&
      prevPositionRef.current !== internshipPosition
    ) {
      setSkills([]);
      setSkillsError("");
    }
    prevPositionRef.current = internshipPosition;
  }, [internshipPosition]);

  useEffect(() => {
    clearLegacyInternshipDrafts();
  }, []);

  useEffect(() => {
    if (defaultInternshipSlug) {
      setValue("internshipPosition", defaultInternshipSlug);
    }
  }, [defaultInternshipSlug, setValue]);

  const stepFields = {
    1: ["fullName", "email", "phone", "currentCity"],
    2: [
      "internshipPosition",
      "university",
      "degree",
      "graduationYear",
      "whyJoin",
    ],
    3: [],
  };

  const goNext = async () => {
    if (step === 2 && skills.length === 0) {
      setSkillsError("Add at least one skill");
      scrollToRef(skillsSectionRef);
      return;
    }
    setSkillsError("");
    const valid = await trigger(stepFields[step]);
    if (valid) {
      setStep((s) => Math.min(s + 1, 3));
    } else {
      scrollToRef(formContainerRef);
    }
  };

  const goBack = () => setStep((s) => Math.max(s - 1, 1));

  const onSubmit = async (data) => {
    if (!confirmAccurate || !agreeProcess) return;

    setLoading(true);
    setSubmitError("");

    const payload = buildApplicationPayload(
      {
        ...data,
        skills,
        internshipTitle: selectedInternship?.title || data.internshipPosition,
      },
      resume
    );

    try {
      await submitInternshipApplication(payload);
      clearLegacyInternshipDrafts();
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err.message || "Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (submitError) scrollToRef(errorBannerRef);
  }, [submitError]);

  useEffect(() => {
    if (skillsError) scrollToRef(skillsSectionRef);
  }, [skillsError]);

  useEffect(() => {
    if (step > 1) scrollToRef(formContainerRef);
  }, [step]);

  const onInvalid = () => scrollToRef(formContainerRef);

  const step3Complete = confirmAccurate && agreeProcess;

  if (submitted) {
    return (
      <ApplicationSuccess
        onBack={() => navigate("/careers")}
      />
    );
  }

  return (
    <div
      ref={formContainerRef}
      className="rounded-2xl border border-white/60 bg-white/70 backdrop-blur-xl shadow-xl shadow-neutral-900/5 overflow-hidden max-w-full scroll-mt-24"
    >
      {/* Header */}
      <div className="px-4 sm:px-6 md:px-8 pt-6 sm:pt-8 pb-5 sm:pb-6 border-b border-neutral-100/80 bg-gradient-to-r from-primary-50/50 to-transparent">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-display font-bold text-neutral-900">
              {internshipTitle ? `Apply — ${internshipTitle}` : "Apply for Internship"}
            </h2>
            <p className="text-sm text-neutral-500 mt-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Applications typically take less than 2 minutes
            </p>
          </div>
        </div>
        <StepProgress steps={STEPS} currentStep={step} />
      </div>

      <form
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        className="px-4 sm:px-6 md:px-8 py-6 sm:py-8"
      >
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25 }}
              className="space-y-5"
            >
              <p className="text-sm font-medium text-neutral-500 mb-2">
                Step 1 — Personal Information
              </p>
              <div className="grid md:grid-cols-2 gap-5">
                <Input
                  label="Full Name *"
                  {...register("fullName", { required: "Required" })}
                  error={errors.fullName?.message}
                  placeholder="Your full name"
                />
                <Input
                  label="Email Address *"
                  type="email"
                  {...register("email", {
                    required: "Required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email",
                    },
                  })}
                  error={errors.email?.message}
                  placeholder="you@university.edu"
                />
                <Input
                  label="Phone Number *"
                  type="tel"
                  {...register("phone", { required: "Required" })}
                  error={errors.phone?.message}
                  placeholder={SITE_CONTACT.phone}
                />
                <Input
                  label="Current City *"
                  {...register("currentCity", { required: "Required" })}
                  error={errors.currentCity?.message}
                  placeholder="City, Country"
                />
                <Input
                  label="LinkedIn Profile"
                  {...register("linkedin")}
                  placeholder="https://linkedin.com/in/you"
                />
                <Input
                  label="GitHub / Portfolio"
                  {...register("githubPortfolio")}
                  placeholder="https://github.com/you"
                />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25 }}
              className="space-y-5"
            >
              <p className="text-sm font-medium text-neutral-500 mb-2">
                Step 2 — Internship Details
              </p>
              <div className="grid md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Internship Position *
                  </label>
                  <select
                    {...register("internshipPosition", { required: "Required" })}
                    className={`${selectClass} ${errors.internshipPosition ? "border-red-300" : ""}`}
                  >
                    <option value="">Select a position</option>
                    {positionOptions.map((i) => (
                      <option key={i.slug} value={i.slug}>
                        {i.title}
                      </option>
                    ))}
                  </select>
                  {errors.internshipPosition && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.internshipPosition.message}
                    </p>
                  )}
                </div>
                <Input
                  label="Current University *"
                  {...register("university", { required: "Required" })}
                  error={errors.university?.message}
                  placeholder="University name"
                />
                <Input
                  label="Degree / Major *"
                  {...register("degree", { required: "Required" })}
                  error={errors.degree?.message}
                  placeholder="e.g. BS Computer Science"
                />
                <Input
                  label="Current Semester"
                  {...register("semester")}
                  placeholder="e.g. 6th semester"
                />
                <Input
                  label="Graduation Year *"
                  {...register("graduationYear", { required: "Required" })}
                  error={errors.graduationYear?.message}
                  placeholder="2026"
                />
              </div>

              <div ref={skillsSectionRef}>
              <InternshipSkillPicker
                suggestedSkills={suggestedSkills}
                selected={skills}
                positionSelected={Boolean(internshipPosition)}
                onChange={(t) => {
                  setSkills(t);
                  if (t.length) setSkillsError("");
                }}
                error={skillsError}
              />
              </div>

              <Textarea
                label="Why do you want to join Axiolink? *"
                {...register("whyJoin", { required: "Required" })}
                error={errors.whyJoin?.message}
                rows={5}
                placeholder="Tell us what draws you to Axiolink Systems (Pvt) Ltd. and this role..."
              />

              <Textarea
                label="Tell us about one project you're proud of"
                {...register("proudProject")}
                error={errors.proudProject?.message}
                rows={4}
                placeholder="Optional — describe a project, coursework, or achievement..."
              />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25 }}
              className="space-y-5"
            >
              <p className="text-sm font-medium text-neutral-500 mb-2">
                Step 3 — Resume & Submission
              </p>

              <FileDropzone
                label="Resume / CV (optional)"
                value={resume}
                onChange={(file, err) => {
                  setResume(file);
                  setResumeError(err || "");
                }}
                error={resumeError}
                emptyText="Add your resume if you have one"
                emptyHint="Optional — PDF only, max 5MB"
                helperText="PDF only, max 5MB"
              />

              <Input
                label="Portfolio Website"
                {...register("portfolioWebsite")}
                placeholder="https://yourportfolio.com"
              />

              <div className="space-y-3 pt-2">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    {...register("confirmAccurate", { required: true })}
                    className="mt-1 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-neutral-600 group-hover:text-neutral-900 transition-colors">
                    I confirm that the information provided is accurate.
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    {...register("agreeProcess", { required: true })}
                    className="mt-1 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-neutral-600 group-hover:text-neutral-900 transition-colors">
                    I agree to Axiolink Systems (Pvt) Ltd.&apos; recruitment process.
                  </span>
                </label>
              </div>

              <p className="flex items-start gap-2 text-xs text-neutral-500 pt-2">
                <Shield className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                Your information will only be used for recruitment purposes.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {submitError && (
          <p
            ref={errorBannerRef}
            role="alert"
            className="mt-4 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg border border-red-100"
          >
            {submitError}
          </p>
        )}

        {/* Navigation */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 mt-8 pt-6 border-t border-neutral-100">
          {step > 1 ? (
            <Button type="button" variant="secondary" onClick={goBack}>
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back
            </Button>
          ) : (
            <div className="hidden sm:block flex-1" />
          )}

          {step < 3 ? (
            <Button
              type="button"
              onClick={goNext}
              className="sm:ml-auto flex-1 sm:flex-none"
            >
              Continue
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              loading={loading}
              disabled={loading || !step3Complete}
              className="sm:ml-auto flex-1 sm:flex-none bg-gradient-to-r from-primary-600 to-primary-700 shadow-lg shadow-primary-500/20 border-0"
            >
              Apply for Internship
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default InternshipApplicationForm;
