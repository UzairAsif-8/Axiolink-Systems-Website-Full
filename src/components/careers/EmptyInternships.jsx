import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";

const EmptyInternships = () => (
  <section className="section-padding bg-neutral-50">
    <div className="container-custom">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg mx-auto text-center py-20 px-8 rounded-2xl bg-white border border-neutral-200 shadow-sm"
      >
        <div className="w-20 h-20 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-6">
          <Briefcase className="w-10 h-10 text-neutral-400" />
        </div>
        <h2 className="text-2xl font-display font-bold text-neutral-900 mb-3">
          No Open Positions Right Now
        </h2>
        <p className="text-neutral-600 leading-relaxed">
          We don&apos;t have any internship openings at the moment. Check back
          soon or send your resume to our team for future opportunities.
        </p>
      </motion.div>
    </div>
  </section>
);

export default EmptyInternships;
