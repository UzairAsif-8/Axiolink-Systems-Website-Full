import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import { floatingTechIcons } from "./internshipIcons";
import { COMPANY_NAME } from "../../data/company";

const CareersHero = () => {
  return (
    <section
      className="relative min-h-[70dvh] sm:min-h-[85vh] flex items-center pt-20 sm:pt-24 pb-12 sm:pb-16 overflow-hidden bg-white"
      aria-labelledby="careers-hero-heading"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-navy-50" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%233B82F6%22%20fill-opacity%3D%220.06%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-80" />

      <motion.div
        className="absolute top-1/4 -left-32 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-32 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl"
        animate={{ x: [0, -30, 0], y: [0, -25, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {floatingTechIcons.map((Icon, i) => (
        <motion.div
          key={i}
          className="absolute hidden lg:flex w-12 h-12 rounded-xl bg-white/80 backdrop-blur-sm border border-neutral-200/80 shadow-sm items-center justify-center text-primary-500/70"
          style={{
            top: `${15 + (i % 4) * 18}%`,
            left: `${8 + (i % 3) * 28}%`,
          }}
          animate={{ y: [0, -12, 0], opacity: [0.5, 0.85, 0.5] }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3,
          }}
        >
          <Icon className="w-5 h-5" />
        </motion.div>
      ))}

      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Badge variant="primary" size="lg" className="mb-6 gap-1.5">
              <Sparkles className="w-4 h-4" />
              Careers at {COMPANY_NAME}
            </Badge>

            <h1
              id="careers-hero-heading"
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-neutral-900 mb-6 leading-tight"
            >
              Build Your Career With{" "}
              <span className="bg-gradient-to-r from-navy-600 via-primary-600 to-emerald-600 bg-clip-text text-transparent">
                {COMPANY_NAME}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-neutral-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Join a team that builds enterprise software, AI solutions, and
              digital products — with mentorship, ownership, and room to grow
              across engineering, design, and business.
            </p>

            <Link to="/contact">
              <Button size="lg" className="group shadow-lg shadow-primary-500/20">
                Get in Touch
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CareersHero;
