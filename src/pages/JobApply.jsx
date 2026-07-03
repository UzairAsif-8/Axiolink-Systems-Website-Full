import { useParams, Link, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import JobApplicationForm from "../components/careers/JobApplicationForm";
import { fetchJobBySlug } from "../api/jobs";
import { usePageMeta } from "../hooks/usePageMeta";

const JobApply = () => {
  const { slug } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["job", slug],
    queryFn: () => fetchJobBySlug(slug),
    enabled: Boolean(slug),
  });

  const job = data?.data;

  usePageMeta({
    title: job
      ? `Apply — ${job.title} | Axiolink Systems (Pvt) Ltd.`
      : "Apply for Job | Axiolink Systems (Pvt) Ltd.",
    description: job
      ? `Submit your application for ${job.title}.`
      : "Submit your job application to Axiolink Systems (Pvt) Ltd.",
    canonical: slug
      ? `https://axiolinksystems.com/careers/jobs/${slug}/apply`
      : "https://axiolinksystems.com/careers/jobs/apply",
  });

  if (slug && isLoading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (slug && (isError || !job)) {
    return <Navigate to="/careers" replace />;
  }

  if (slug) {
    const isOpen =
      (job.status === "open" || job.status === "published") &&
      job.applicationsOpen !== false;
    if (!isOpen) return <Navigate to={`/careers/jobs/${slug}`} replace />;
  }

  const backTo = slug ? `/careers/jobs/${slug}` : "/careers#jobs";

  return (
    <div className="min-h-screen pt-20">
      <section className="section-padding bg-gradient-to-br from-navy-50 via-white to-primary-50 border-b border-neutral-100">
        <div className="container-custom max-w-4xl">
          <Link
            to={backTo}
            className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-primary-600 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            {slug ? "Back to job details" : "Back to Careers"}
          </Link>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-3">
              {job ? `Apply for ${job.title}` : "Job Application"}
            </h1>
            <p className="text-neutral-600 max-w-2xl">
              Complete the form below to submit your application.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl">
          <JobApplicationForm
            key={slug || "general"}
            defaultJobSlug={slug || ""}
            jobTitle={job?.title}
          />
        </div>
      </section>
    </div>
  );
};

export default JobApply;
