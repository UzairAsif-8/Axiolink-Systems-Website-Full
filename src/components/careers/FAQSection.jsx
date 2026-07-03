import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import {
  generalFaqItems,
  internshipFaqItems,
} from "../../data/careersContent";
import { COMPANY_NAME } from "../../data/company";

const FAQGroup = ({ title, subtitle, items, startIndex, openIndex, setOpenIndex }) => (
  <div className="mb-10 last:mb-0">
    <div className="mb-6">
      <h3 className="text-xl font-display font-bold text-neutral-900">
        {title}
      </h3>
      {subtitle && (
        <p className="text-sm text-neutral-500 mt-1">{subtitle}</p>
      )}
    </div>
    <div className="space-y-3">
      {items.map((item, index) => {
        const globalIndex = startIndex + index;
        const isOpen = openIndex === globalIndex;
        return (
          <motion.div
            key={item.question}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.03 }}
            className="rounded-2xl bg-white border border-neutral-200 overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? -1 : globalIndex)}
              className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-neutral-50 transition-colors"
              aria-expanded={isOpen}
            >
              <span className="font-semibold text-neutral-900">
                {item.question}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-neutral-400 shrink-0 transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="px-5 pb-5 text-neutral-600 leading-relaxed border-t border-neutral-100 pt-4">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  </div>
);

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section
      className="section-padding bg-neutral-50"
      aria-labelledby="faq-heading"
    >
      <div className="container-custom max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2
            id="faq-heading"
            className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4"
          >
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-neutral-600">
            Common questions about working with {COMPANY_NAME}.
          </p>
        </motion.div>

        <FAQGroup
          title="Careers at Axiolink"
          subtitle="Full-time, contract, project work, and general applications"
          items={generalFaqItems}
          startIndex={0}
          openIndex={openIndex}
          setOpenIndex={setOpenIndex}
        />

        <FAQGroup
          title="Internships"
          subtitle="When internship positions are open"
          items={internshipFaqItems}
          startIndex={generalFaqItems.length}
          openIndex={openIndex}
          setOpenIndex={setOpenIndex}
        />
      </div>
    </section>
  );
};

export default FAQSection;
