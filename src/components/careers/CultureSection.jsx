import { motion } from "framer-motion";
import { cultureValues } from "../../data/careersContent";
import { stockImages } from "../../data/stockImages";
import { COMPANY_NAME } from "../../data/company";

const CultureSection = () => (
  <section className="section-padding bg-white" aria-labelledby="culture-heading">
    <div className="container-custom">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2
            id="culture-heading"
            className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4"
          >
            Company Culture
          </h2>
          <p className="text-lg text-neutral-600 mb-8">
            At {COMPANY_NAME}, culture isn&apos;t a poster on the wall — it&apos;s
            how we work, learn, and grow together every day.
          </p>

          <div className="grid sm:grid-cols-2 gap-3">
            {cultureValues.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ x: 4 }}
                className="p-4 rounded-xl bg-neutral-50 border border-neutral-100 hover:border-primary-200 transition-colors"
              >
                <h3 className="font-semibold text-neutral-900 text-sm mb-1">
                  {value.title}
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-neutral-900/10">
            <img
              src={stockImages.teamCollaboration}
              alt="Axiolink Systems (Pvt) Ltd. team collaborating in a modern workspace"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary-500/20 rounded-full blur-2xl pointer-events-none" />
        </motion.div>
      </div>
    </div>
  </section>
);

export default CultureSection;
