import { motion } from "framer-motion";
import { hiringProcessSteps } from "../../data/careersContent";

const HiringProcessTimeline = ({ compact = false }) => (
  <section
    className={compact ? "" : "section-padding bg-white"}
    aria-labelledby={compact ? undefined : "hiring-process-heading"}
  >
    <div className={compact ? "" : "container-custom"}>
      {!compact && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2
            id="hiring-process-heading"
            className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4"
          >
            Hiring Process
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            How we evaluate and welcome people across internships, contracts,
            and full-time roles.
          </p>
        </motion.div>
      )}

      <div className="max-w-2xl mx-auto relative">
        <div
          className="absolute left-[1.125rem] top-4 bottom-4 w-0.5 bg-gradient-to-b from-primary-500 via-primary-400 to-emerald-500"
          aria-hidden
        />

        <div className="space-y-6">
          {hiringProcessSteps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="relative flex gap-5 pl-0"
            >
              <div className="relative z-10 shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-white text-sm font-bold flex items-center justify-center shadow-lg shadow-primary-500/30">
                {step.step}
              </div>
              <div className="flex-1 pb-2 pt-0.5">
                <h3 className="font-semibold text-neutral-900 mb-1">
                  {step.title}
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default HiringProcessTimeline;
