import { useParams, Link, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import { fetchJobBySlug } from "../api/jobs";
import { usePageMeta } from "../hooks/usePageMeta";

const DetailBlock = ({ title, items }) =>
  items?.length > 0 ? (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-neutral-900 mb-3">{title}</h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-neutral-600">
            <CheckCircle2 className="w-4 h-4 text-primary-500 shrink-0 mt-1" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  ) : null;

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 p-3 rounded-xl bg-neutral-50">
    <Icon className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
    <div>
      <p className="text-xs text-neutral-500 uppercase tracking-wide">{label}</p>
      <p className="text-sm font-medium text-neutral-900">{value}</p>
    </div>
  </div>
);

const JobDetail = () => {
  const { slug } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["job", slug],
    queryFn: () => fetchJobBySlug(slug),
    enabled: Boolean(slug),
  });

  const job = data?.data;

  usePageMeta({
    title: job
      ? `${job.title} | Careers | Axiolink Systems (Pvt) Ltd.`
      : "Job | Axiolink Systems (Pvt) Ltd.",
    description: job?.description,
    canonical: job
      ? `https://axiolinksystems.com/careers/jobs/${job.slug}`
      : undefined,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isError || !job) {
    return <Navigate to="/careers" replace />;
  }

  const isOpen =
    (job.status === "open" || job.status === "published") &&
    job.applicationsOpen !== false;

  if (!isOpen) {
    return <Navigate to="/careers" replace />;
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    hiringOrganization: {
      "@type": "Organization",
      name: "Axiolink Systems (Pvt) Ltd.",
    },
    jobLocationType: job.workMode === "Remote" ? "TELECOMMUTE" : undefined,
    employmentType: job.jobType || job.type || "FULL_TIME",
  };

  return (
    <div className="min-h-screen pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="section-padding bg-gradient-to-br from-navy-50 via-white to-primary-50 relative overflow-hidden border-b border-neutral-100">
        <div className="container-custom relative z-10">
          <Link
            to="/careers#jobs"
            className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-primary-600 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Careers
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-navy-600 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
                <Briefcase className="w-7 h-7 text-white" />
              </div>
              <Badge variant="primary" size="md">{job.department}</Badge>
              <Badge variant="success" size="md">
                {job.positions} {job.positions === 1 ? "position" : "positions"} open
              </Badge>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-neutral-900 mb-4">
              {job.title}
            </h1>
            <p className="text-lg text-neutral-600 leading-relaxed max-w-3xl mb-8">
              {job.description}
            </p>

            <Link to={`/careers/jobs/${job.slug}/apply`}>
              <Button size="lg" className="group shadow-lg shadow-primary-500/20">
                Apply Now
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-10">
            <div className="lg:col-span-2">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <DetailBlock title="Responsibilities" items={job.responsibilities} />
                <DetailBlock title="Requirements" items={job.requirements} />
                <DetailBlock title="Benefits" items={job.benefits} />
              </motion.div>
            </div>

            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="lg:sticky lg:top-24 space-y-3 p-4 sm:p-6 rounded-2xl bg-neutral-50 border border-neutral-200"
              >
                <h3 className="font-semibold text-neutral-900 mb-4">At a Glance</h3>
                <InfoRow icon={Briefcase} label="Job Type" value={job.jobType || job.type || "Full-time"} />
                <InfoRow icon={MapPin} label="Location" value={job.location || job.workMode} />
                <InfoRow icon={Briefcase} label="Work Mode" value={job.workMode} />
                {job.salaryRange && (
                  <InfoRow icon={DollarSign} label="Salary" value={job.salaryRange} />
                )}
                <InfoRow icon={Users} label="Open Positions" value={job.positions} />
                <InfoRow icon={Calendar} label="Application Deadline" value={job.applicationDeadline} />

                <Link to={`/careers/jobs/${job.slug}/apply`}>
                  <Button className="w-full mt-4">Apply for This Role</Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-neutral-50 border-t border-neutral-100">
        <div className="container-custom max-w-2xl text-center">
          <h2 className="text-2xl font-display font-bold text-neutral-900 mb-4">
            Ready to apply?
          </h2>
          <p className="text-neutral-600 mb-6">
            Submit your application on our dedicated application page.
          </p>
          <Link to={`/careers/jobs/${job.slug}/apply`}>
            <Button size="lg" className="group">
              Start Application
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default JobDetail;
