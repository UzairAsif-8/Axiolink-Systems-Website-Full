import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MapPin, Briefcase, ArrowRight, DollarSign } from "lucide-react";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

const JobCard = ({ job, index = 0 }) => {
  const navigate = useNavigate();

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.06 }}
      whileHover={{ y: -6 }}
      className="group h-full"
    >
      <div className="h-full flex flex-col rounded-2xl bg-white border border-neutral-200/80 p-6 shadow-sm hover:shadow-xl hover:shadow-primary-500/10 hover:border-primary-200 transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-navy-600 to-primary-600 flex items-center justify-center text-white shadow-lg shadow-primary-500/25 group-hover:scale-105 transition-transform">
            <Briefcase className="w-6 h-6" />
          </div>
          <Badge variant="primary" size="sm">
            {job.positions} {job.positions === 1 ? "role" : "roles"}
          </Badge>
        </div>

        <h3 className="text-lg font-display font-bold text-neutral-900 mb-2 group-hover:text-primary-700 transition-colors">
          {job.title}
        </h3>
        <p className="text-sm text-neutral-600 mb-4 line-clamp-2 flex-1">
          {job.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="inline-flex items-center gap-1 text-xs text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-lg">
            <Briefcase className="w-3 h-3" />
            {job.jobType || job.type || "Full-time"}
          </span>
          {job.salaryRange && (
            <span className="inline-flex items-center gap-1 text-xs text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-lg">
              <DollarSign className="w-3 h-3" />
              {job.salaryRange}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs text-neutral-500 mb-5 pt-4 border-t border-neutral-100">
          <span className="inline-flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {job.location || job.workMode}
          </span>
          <span>{job.department}</span>
        </div>

        <div className="flex gap-2 mt-auto">
          <Button
            size="sm"
            className="flex-1 group/btn"
            onClick={() => navigate(`/careers/jobs/${job.slug}`)}
          >
            View Details
            <ArrowRight className="ml-1 w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => navigate(`/careers/jobs/${job.slug}/apply`)}
          >
            Apply
          </Button>
        </div>
      </div>
    </motion.article>
  );
};

export default JobCard;
