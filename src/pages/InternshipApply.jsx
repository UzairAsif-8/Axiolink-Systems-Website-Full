import { useParams, Link, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import InternshipApplicationForm from "../components/careers/InternshipApplicationForm";
import { fetchInternshipBySlug } from "../api/internships";
import { usePageMeta } from "../hooks/usePageMeta";

const InternshipApply = () => {
  const { slug } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["internship", slug],
    queryFn: () => fetchInternshipBySlug(slug),
    enabled: Boolean(slug),
  });

  const internship = data?.data;

  usePageMeta({
    title: internship
      ? `Apply — ${internship.title} | Axiolink Systems (Pvt) Ltd.`
      : "Apply for Internship | Axiolink Systems (Pvt) Ltd.",
    description: internship
      ? `Submit your application for ${internship.title} at Axiolink Systems (Pvt) Ltd.`
      : "Submit your internship application to Axiolink Systems (Pvt) Ltd.",
    canonical: slug
      ? `https://axiolinksystems.com/careers/${slug}/apply`
      : "https://axiolinksystems.com/careers/apply",
  });

  if (slug && isLoading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (slug && (isError || !internship)) {
    return <Navigate to="/careers" replace />;
  }

  if (slug) {
    const status = (internship.status || "").toLowerCase();
    const isOpen =
      (status === "open" || status === "published") &&
      internship.applicationsOpen !== false;

    if (!isOpen) {
      return <Navigate to={`/careers/${slug}`} replace />;
    }
  }

  const backTo = slug ? `/careers/${slug}` : "/careers";
  const backLabel = slug ? "Back to role details" : "Back to Careers";

  return (
    <div className="min-h-screen pt-20">
      <section className="section-padding bg-gradient-to-br from-primary-50 via-white to-navy-50 border-b border-neutral-100">
        <div className="container-custom max-w-4xl">
          <Link
            to={backTo}
            className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-primary-600 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            {backLabel}
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-3">
              {internship ? `Apply for ${internship.title}` : "Internship Application"}
            </h1>
            <p className="text-neutral-600 max-w-2xl">
              {internship
                ? "Complete the form below to submit your application for this role."
                : "Select a position and share your details. Our team will review your application."}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl">
          <InternshipApplicationForm
            key={slug || "general"}
            defaultInternshipSlug={slug || ""}
            internshipTitle={internship?.title}
          />
        </div>
      </section>
    </div>
  );
};

export default InternshipApply;
