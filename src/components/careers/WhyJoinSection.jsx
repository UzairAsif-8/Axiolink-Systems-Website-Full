import { motion } from "framer-motion";
import { whyJoinItems } from "../../data/careersContent";
import { COMPANY_NAME } from "../../data/company";

const WhyJoinSection = () => (
  <section
    className="py-16 md:py-20 bg-neutral-50 border-b border-neutral-100"
    aria-labelledby="why-join-heading"
  >
    <div className="container-custom max-w-5xl">
      <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-4 lg:sticky lg:top-28"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-600 mb-3">
            Why join us
          </p>
          <h2
            id="why-join-heading"
            className="text-2xl md:text-3xl font-display font-bold text-neutral-900 tracking-tight leading-snug"
          >
            Why {COMPANY_NAME}
          </h2>
          <p className="text-neutral-500 mt-3 text-sm md:text-base leading-relaxed">
            Whether you join full-time, on contract, through Buland Parwaz, or
            as an intern — we invest in people who want to do meaningful work.
          </p>
        </motion.div>

        <div className="lg:col-span-8 grid sm:grid-cols-2 gap-x-10 gap-y-8">
          {whyJoinItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="border-l-2 border-neutral-200 pl-5 hover:border-primary-400 transition-colors duration-300"
            >
              <h3 className="text-sm font-semibold text-neutral-900 mb-1.5">
                {item.title}
              </h3>
              <p className="text-sm text-neutral-500 leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default WhyJoinSection;
