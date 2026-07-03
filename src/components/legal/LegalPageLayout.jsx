import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, Mail, Phone, ArrowRight, Shield } from "lucide-react";
import Button from "../ui/Button";
import { SITE_CONTACT } from "../../data/siteContact";

/**
 * Shared layout for Privacy Policy and Terms of Service pages.
 * Provides hero, sticky table of contents, section rendering, and contact CTA.
 */
const LegalPageLayout = ({
  title,
  lastUpdated,
  summary,
  intro,
  sections,
  relatedPage,
}) => {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const observers = sections.map(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(id);
        },
        { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
      );
      observer.observe(el);
      return observer;
    });

    return () => observers.forEach((o) => o?.disconnect());
  }, [sections]);

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-navy-50 section-padding">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%23e2e8f0%22%20fill-opacity%3D%220.4%22%3E%3Cpath%20d%3D%22M20%2020h20v20H20z%22/%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
        <div className="container-custom relative">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
                <Shield className="w-4 h-4" />
                Legal
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-neutral-900 mb-4">
                {title}
              </h1>
              <p className="text-sm text-neutral-500 mb-4">
                Last updated: {lastUpdated}
              </p>
              <p className="text-lg text-neutral-600 leading-relaxed">{intro}</p>
            </motion.div>
          </div>

          {/* Summary cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto mt-12"
          >
            {summary.map((item, i) => (
              <div
                key={i}
                className="bg-white/80 backdrop-blur-sm rounded-xl border border-neutral-200/80 p-5 text-left shadow-sm"
              >
                <item.icon className="w-5 h-5 text-primary-600 mb-3" />
                <h3 className="text-sm font-semibold text-neutral-900 mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Content + TOC */}
      <section className="section-padding bg-neutral-50">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-10 lg:gap-14">
            {/* Sticky table of contents */}
            <aside className="lg:w-64 shrink-0">
              <nav
                className="lg:sticky lg:top-28 bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-sm"
                aria-label="Table of contents"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-4">
                  On this page
                </p>
                <ul className="space-y-1">
                  {sections.map(({ id, title: sectionTitle }) => (
                    <li key={id}>
                      <a
                        href={`#${id}`}
                        className={`block text-sm py-2 px-3 rounded-lg transition-colors duration-200 ${
                          activeId === id
                            ? "bg-primary-50 text-primary-700 font-medium"
                            : "text-neutral-600 hover:text-primary-600 hover:bg-neutral-50"
                        }`}
                      >
                        {sectionTitle}
                      </a>
                    </li>
                  ))}
                </ul>
                {relatedPage && (
                  <div className="mt-6 pt-5 border-t border-neutral-100">
                    <Link
                      to={relatedPage.href}
                      className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                      <FileText className="w-4 h-4" />
                      {relatedPage.label}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </nav>
            </aside>

            {/* Sections */}
            <div className="flex-1 min-w-0 space-y-6">
              {sections.map((section, index) => (
                <motion.article
                  key={section.id}
                  id={section.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: index * 0.03 }}
                  className="scroll-mt-28 bg-white rounded-2xl border border-neutral-200/80 p-6 md:p-8 shadow-sm"
                >
                  <h2 className="text-xl md:text-2xl font-display font-bold text-neutral-900 mb-4">
                    {section.title}
                  </h2>
                  <div className="space-y-4 text-neutral-600 leading-relaxed">
                    {section.content}
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="section-padding bg-white border-t border-neutral-100">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-neutral-900 mb-3">
              Questions about this document?
            </h2>
            <p className="text-neutral-600 mb-8">
              Our team is happy to clarify any part of this policy. Reach out
              anytime — we typically respond within one business day.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <a
                href={SITE_CONTACT.mailto}
                className="inline-flex items-center gap-2 text-neutral-700 hover:text-primary-600 transition-colors"
              >
                <Mail className="w-4 h-4" />
                {SITE_CONTACT.email}
              </a>
              <span className="hidden sm:inline text-neutral-300">|</span>
              <a
                href={SITE_CONTACT.tel}
                className="inline-flex items-center gap-2 text-neutral-700 hover:text-primary-600 transition-colors"
              >
                <Phone className="w-4 h-4" />
                {SITE_CONTACT.phone}
              </a>
            </div>
            <Link to="/contact">
              <Button size="lg">Contact Us</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LegalPageLayout;
