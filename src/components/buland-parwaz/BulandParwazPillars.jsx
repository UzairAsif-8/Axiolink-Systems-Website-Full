import { motion } from "framer-motion";
import { BookOpen, Users, Award, Briefcase } from "lucide-react";
import { stockImages } from "../../data/stockImages";

const pillars = [
  {
    icon: BookOpen,
    title: "Structured Curriculum",
    description:
      "Industry-aligned courses and bootcamps with clear learning outcomes and practical assignments.",
  },
  {
    icon: Users,
    title: "Expert Mentorship",
    description:
      "Learn directly from professionals who build and deploy real-world software solutions.",
  },
  {
    icon: Award,
    title: "Recognized Credentials",
    description:
      "Earn verifiable certificates that employers and partners can authenticate online.",
  },
  {
    icon: Briefcase,
    title: "Career Readiness",
    description:
      "Develop portfolio-ready skills and confidence to advance in today's tech landscape.",
  },
];

const BulandParwazPillars = () => {
  return (
    <section className="section-padding bg-neutral-50 border-y border-neutral-200/60">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-6xl mx-auto mb-16 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-semibold uppercase tracking-widest text-primary-600 mb-3">
              About the Program
            </p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-5 leading-tight">
              Elevating talent through{" "}
              <span className="gradient-text">practical education</span>
            </h2>
            <p className="text-neutral-600 text-lg leading-relaxed mb-6">
              Buland Parwaz is the flagship training arm of Axiolink Systems —
              designed to bridge the gap between academic knowledge and
              professional execution through hands-on learning experiences.
            </p>
            <p className="text-neutral-600 leading-relaxed">
              Whether you are starting your journey or upskilling for your next
              role, our programs combine structured instruction with real project
              work so you graduate with skills you can apply immediately.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="rounded-2xl overflow-hidden shadow-xl shadow-neutral-900/8 ring-1 ring-neutral-200/80">
              <img
                src={stockImages.trainingWorkshop}
                alt="Students in a professional training session"
                className="w-full h-72 md:h-80 object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-4 sm:-left-6 bg-white rounded-xl border border-neutral-200 shadow-lg px-6 py-4">
              <p className="text-2xl font-display font-bold text-emerald-700">100%</p>
              <p className="text-sm text-neutral-600">Practical, project-based learning</p>
            </div>
          </motion.div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="bg-white rounded-xl border border-neutral-200/80 p-6"
            >
              <div className="w-11 h-11 rounded-lg bg-primary-50 text-primary-700 flex items-center justify-center mb-4">
                <pillar.icon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-neutral-900 mb-2">
                {pillar.title}
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BulandParwazPillars;
