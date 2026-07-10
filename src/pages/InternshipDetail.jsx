import { useParams, Link, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  Briefcase,
  Users,
  Calendar,
  DollarSign,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import HiringProcessTimeline from "../components/careers/HiringProcessTimeline";
import { fetchInternshipBySlug } from "../api/internships";
import { getInternshipIcon } from "../components/careers/internshipIcons";
import { usePageMeta } from "../hooks/usePageMeta";
import { internshipMeta } from "../seo/pageMeta";

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

const InternshipDetail = () => {
  const { slug } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["internship", slug],
    queryFn: () => fetchInternshipBySlug(slug),
    enabled: Boolean(slug),
  });

  const internship = data?.data;

  usePageMeta(
    internship
      ? internshipMeta(internship)
      : { title: "Internship | Axiolink Systems (Pvt) Ltd." }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isError || !internship) {
    return <Navigate to="/careers" replace />;
  }

  const status = (internship.status || "").toLowerCase();
  const isOpen =
    (status === "open" || status === "published") &&
    internship.applicationsOpen !== false;

  if (!isOpen) {
    return <Navigate to="/careers" replace />;
  }

  const Icon = getInternshipIcon(internship.icon);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: internship.title,
    description: internship.description,
    hiringOrganization: {
      "@type": "Organization",
      name: "Axiolink Systems (Pvt) Ltd.",
    },
    jobLocationType: internship.workMode === "Remote" ? "TELECOMMUTE" : undefined,
    employmentType: "INTERN",
  };

  return (
    <div className="min-h-screen pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Header */}
      <section className="section-padding bg-gradient-to-br from-primary-50 via-white to-navy-50 relative overflow-hidden border-b border-neutral-100">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%233B82F6%22%20fill-opacity%3D%220.06%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-80" />
        <div className="container-custom relative z-10">
          <Link
            to="/careers"
            className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-primary-600 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Careers
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/20">
                <Icon className="w-7 h-7 text-white" />
              </div>
              <Badge variant="primary" size="md">
                {internship.department}
              </Badge>
              <Badge variant="success" size="md">
                {internship.positions} positions open
              </Badge>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-neutral-900 mb-4">
              {internship.title}
            </h1>
            <p className="text-lg text-neutral-600 leading-relaxed max-w-3xl mb-8">
              {internship.description}
            </p>

            <div className="flex flex-wrap gap-3">
              <Link to={`/careers/${internship.slug}/apply`}>
                <Button
                  size="lg"
                  className="group shadow-lg shadow-primary-500/20"
                >
                  Apply Now
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Details grid */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-10">
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <DetailBlock title="Responsibilities" items={internship.responsibilities} />
                <DetailBlock title="What You'll Learn" items={internship.whatYouLearn} />
                <DetailBlock title="Required Skills" items={internship.requiredSkills} />
                <DetailBlock title="Preferred Skills" items={internship.preferredSkills} />
                <DetailBlock title="Who Can Apply" items={internship.whoCanApply} />
                <DetailBlock title="Benefits" items={internship.benefits} />

                {internship.technologies?.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-3">
                      Technology Stack
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {internship.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1.5 rounded-lg bg-primary-50 text-primary-700 text-sm font-medium border border-primary-100"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
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
                <InfoRow icon={Briefcase} label="Work Mode" value={internship.workMode} />
                <InfoRow icon={Clock} label="Duration" value={internship.duration} />
                <InfoRow
                  icon={DollarSign}
                  label="Compensation"
                  value={
                    internship.paid === false
                      ? "Unpaid"
                      : internship.stipend || "Paid"
                  }
                />
                <InfoRow icon={Users} label="Open Positions" value={internship.positions} />
                <InfoRow icon={Calendar} label="Application Deadline" value={internship.applicationDeadline} />
                <InfoRow icon={Users} label="Skill Level" value={internship.skillLevel} />

                <Link to={`/careers/${internship.slug}/apply`}>
                  <Button className="w-full mt-4">
                    Apply for This Role
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Hiring process */}
      <section className="section-padding bg-neutral-50">
        <div className="container-custom max-w-2xl">
          <h2 className="text-2xl font-display font-bold text-neutral-900 mb-8 text-center">
            Hiring Process
          </h2>
          <HiringProcessTimeline compact />
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-white border-t border-neutral-100">
        <div className="container-custom max-w-2xl text-center">
          <h2 className="text-2xl font-display font-bold text-neutral-900 mb-4">
            Ready to apply?
          </h2>
          <p className="text-neutral-600 mb-6">
            Submit your application on our dedicated application page.
          </p>
          <Link to={`/careers/${internship.slug}/apply`}>
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

export default InternshipDetail;
