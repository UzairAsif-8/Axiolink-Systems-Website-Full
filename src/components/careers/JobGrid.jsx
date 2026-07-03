import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Search, Filter, Briefcase } from "lucide-react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import JobCard from "./JobCard";

const JobGrid = ({ jobs, id = "jobs" }) => {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");

  const departments = useMemo(() => {
    const values = [...new Set(jobs.map((item) => item.department).filter(Boolean))].sort();
    return ["All", ...values];
  }, [jobs]);

  const filtered = useMemo(() => {
    return jobs.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase()) ||
        item.department.toLowerCase().includes(search.toLowerCase());
      const matchesDept = department === "All" || item.department === department;
      return matchesSearch && matchesDept;
    });
  }, [jobs, search, department]);

  const hasOpenings = jobs.length > 0;

  return (
    <section
      id={id}
      className="section-padding bg-white"
      aria-labelledby="jobs-heading"
    >
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          {hasOpenings && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary-700 bg-primary-50 border border-primary-200 px-3 py-1 rounded-full mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
              Hiring now
            </span>
          )}
          <h2
            id="jobs-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-neutral-900 mb-4"
          >
            Open Positions
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            {hasOpenings
              ? `${jobs.length} open ${jobs.length === 1 ? "role" : "roles"} across our teams. Find your next career move at Axiolink Systems.`
              : "We don't have full-time openings at the moment. Check back soon or get in touch for future opportunities."}
          </p>
        </motion.div>

        {hasOpenings ? (
          <>
            <div className="flex flex-col lg:flex-row gap-4 mb-10">
              <div className="flex-1 relative max-w-xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <Input
                  placeholder="Search jobs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-12"
                  aria-label="Search jobs"
                />
              </div>
              {departments.length > 1 && (
                <div className="flex flex-wrap gap-2">
                  {departments.map((dept) => (
                    <button
                      key={dept}
                      type="button"
                      onClick={() => setDepartment(dept)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        department === dept
                          ? "bg-primary-600 text-white shadow-md shadow-primary-500/25"
                          : "bg-neutral-50 text-neutral-600 border border-neutral-200 hover:border-primary-300"
                      }`}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {filtered.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((job, index) => (
                  <JobCard key={job.slug} job={job} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 rounded-2xl bg-neutral-50 border border-neutral-200">
                <Filter className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                <p className="text-neutral-600">No jobs match your filters.</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearch("");
                    setDepartment("All");
                  }}
                >
                  Clear filters
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 rounded-2xl bg-neutral-50 border border-neutral-200">
            <Briefcase className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-600 mb-4">No open jobs right now.</p>
            <Link to="/contact">
              <Button>Contact us</Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default JobGrid;
