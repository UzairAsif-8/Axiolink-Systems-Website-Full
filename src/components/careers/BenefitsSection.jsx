import { motion } from "framer-motion";
import { benefitsItems } from "../../data/careersContent";

const BenefitsSection = () => (
  <section
    className="py-16 md:py-20 bg-white border-y border-neutral-100"
    aria-labelledby="benefits-heading"
  >
    <div className="container-custom max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-10"
      >
        <h2
          id="benefits-heading"
          className="text-2xl md:text-3xl font-display font-bold text-neutral-900 tracking-tight"
        >
          What you get
        </h2>
        <p className="text-neutral-500 mt-2 text-sm md:text-base">
          Benefits and support across roles — from interns to contract
          specialists to full-time team members.
        </p>
      </motion.div>

      <ul className="grid sm:grid-cols-2 gap-x-10 gap-y-0">
        {benefitsItems.map((item, index) => (
          <motion.li
            key={item}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.04 }}
            className="flex items-center gap-3 py-3.5 border-b border-neutral-100 last:border-b-0 sm:[&:nth-last-child(-n+2)]:border-b-0"
          >
            <span
              className="shrink-0 w-1.5 h-1.5 rounded-full bg-primary-500"
              aria-hidden
            />
            <span className="text-neutral-700 text-sm md:text-base">{item}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  </section>
);

export default BenefitsSection;
