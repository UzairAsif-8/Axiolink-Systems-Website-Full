import { motion } from "framer-motion";
import { ArrowRight, GraduationCap, ShieldCheck } from "lucide-react";
import Button from "../ui/Button";
import BulandParwazLogo from "../../assets/BulandParwazLogo.png";
import { COMPANY_NAME } from "../../data/company";

const BulandParwazHero = ({ onExploreCourses, onVerifyCertificate }) => {
  return (
    <section
      className="relative pt-24 sm:pt-28 pb-16 sm:pb-20 overflow-hidden bg-white"
      aria-labelledby="buland-parwaz-heading"
    >
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%2310B981%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-90 pointer-events-none" />

      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 sm:mb-8"
          >
            <div className="inline-flex w-full justify-center px-4 sm:px-8">
              <div className="w-full max-w-[9rem] sm:max-w-[10rem] md:max-w-[11rem] lg:max-w-[12rem] bg-white rounded-2xl">
                <img
                  src={BulandParwazLogo}
                  alt="Buland Parwaz Program"
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-700 mb-4">
              {COMPANY_NAME}
            </p>

            <h1
              id="buland-parwaz-heading"
              className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-neutral-900 mb-5 leading-tight"
            >
              Buland Parwaz Program
            </h1>

            <p className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed mb-10">
              A structured professional training initiative offering bootcamps,
              courses, workshops, and mentorship to build industry-ready skills.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="group w-full sm:w-auto" onClick={onExploreCourses}>
                <GraduationCap className="mr-2 w-5 h-5" />
                View Programs
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto"
                onClick={onVerifyCertificate}
              >
                <ShieldCheck className="mr-2 w-5 h-5" />
                Verify Certificate
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BulandParwazHero;
