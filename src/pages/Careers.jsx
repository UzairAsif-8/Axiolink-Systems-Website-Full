import { useQuery } from "@tanstack/react-query";
import CareersHero from "../components/careers/CareersHero";
import WhyJoinSection from "../components/careers/WhyJoinSection";
import InternshipGrid from "../components/careers/InternshipGrid";
import JobGrid from "../components/careers/JobGrid";
import HiringProcessTimeline from "../components/careers/HiringProcessTimeline";
import BenefitsSection from "../components/careers/BenefitsSection";
import CultureSection from "../components/careers/CultureSection";
import FAQSection from "../components/careers/FAQSection";
import { fetchInternships, getOpenInternships } from "../api/internships";
import { fetchJobs, getOpenJobs } from "../api/jobs";
import { usePageMeta } from "../hooks/usePageMeta";
import { PAGE_META } from "../seo/pageMeta";
import Button from "../components/ui/Button";
import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Careers = () => {
  const { data: apiInternships } = useQuery({
    queryKey: ["internships"],
    queryFn: fetchInternships,
  });

  const { data: apiJobs } = useQuery({
    queryKey: ["jobs"],
    queryFn: fetchJobs,
  });

  const openInternships = getOpenInternships(apiInternships);
  const openJobs = getOpenJobs(apiJobs);

  usePageMeta(PAGE_META.careers);

  const jobListingsSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Axiolink Systems (Pvt) Ltd. Open Positions",
    itemListElement: [
      ...openJobs.map((job, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "JobPosting",
          title: job.title,
          description: job.description,
          hiringOrganization: {
            "@type": "Organization",
            name: "Axiolink Systems (Pvt) Ltd.",
          },
          employmentType: job.jobType || job.type || "FULL_TIME",
        },
      })),
      ...openInternships.map((internship, index) => ({
        "@type": "ListItem",
        position: openJobs.length + index + 1,
        item: {
          "@type": "JobPosting",
          title: internship.title,
          description: internship.description,
          hiringOrganization: {
            "@type": "Organization",
            name: "Axiolink Systems (Pvt) Ltd.",
          },
          employmentType: "INTERN",
        },
      })),
    ],
  };

  const hasListings = openJobs.length > 0 || openInternships.length > 0;

  return (
    <div className="min-h-screen">
      {hasListings && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jobListingsSchema) }}
        />
      )}

      <CareersHero />
      <JobGrid jobs={openJobs} />
      {openInternships.length > 0 && (
        <InternshipGrid internships={openInternships} />
      )}
      <WhyJoinSection />
      <HiringProcessTimeline />
      <BenefitsSection />
      <CultureSection />
      <FAQSection />

      <section className="section-padding bg-gradient-to-br from-primary-600 via-primary-700 to-navy-700">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Interested in Joining Us?
            </h2>
            <p className="text-lg text-primary-100 mb-8">
              Share your background and tell us how you&apos;d like to
              contribute. We&apos;d love to hear from you.
            </p>
            <Link to="/contact">
              <Button
                size="lg"
                className="group !bg-navy-900/90 !text-white border-2 border-white/30 hover:!bg-navy-950 hover:!text-white hover:border-white/50 shadow-xl"
              >
                <Mail className="mr-2 w-5 h-5" />
                Contact Us
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Careers;
