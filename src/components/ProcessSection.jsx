import { motion } from "framer-motion";
import {
  Search,
  Layers,
  Code2,
  ShieldCheck,
  Rocket,
  CheckCircle2,
  FileText,
  Users,
  ClipboardList,
  Headphones,
} from "lucide-react";
import Badge from "./ui/Badge";

const stepIcons = {
  search: Search,
  layers: Layers,
  code: Code2,
  shield: ShieldCheck,
  rocket: Rocket,
};

const trustSignals = [
  { icon: FileText, label: "Signed scope & milestone plan" },
  { icon: Users, label: "Dedicated project lead" },
  { icon: ClipboardList, label: "Regular progress reports" },
  { icon: Headphones, label: "Post-launch support options" },
];

const ProcessSection = ({ steps, subtitle }) => {
  return (
    <section className="section-padding bg-neutral-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.04%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-80" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container-custom relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <Badge
              variant="primary"
              size="lg"
              className="mb-4 bg-primary-600/20 text-primary-300 border-primary-500/30"
            >
              How We Work
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4">
              A Structured Delivery Process
            </h2>
            <p className="text-lg md:text-xl text-neutral-400 max-w-3xl mx-auto leading-relaxed">
              {subtitle ||
                "Every engagement follows a transparent, milestone-driven framework — so you always know what we are building, how quality is verified, and what happens at each stage."}
            </p>
          </motion.div>

          {/* Trust signals */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-12 md:mb-16"
          >
            {trustSignals.map((signal) => (
              <div
                key={signal.label}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10"
              >
                <div className="shrink-0 w-9 h-9 rounded-lg bg-primary-600/20 flex items-center justify-center">
                  <signal.icon className="w-4 h-4 text-primary-400" />
                </div>
                <span className="text-xs md:text-sm font-medium text-neutral-300 leading-snug">
                  {signal.label}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {/* Connector line — desktop */}
            <div
              className="hidden lg:block absolute top-[3.25rem] left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent"
              aria-hidden
            />

            <div className="grid sm:grid-cols-2 xl:grid-cols-5 gap-5 lg:gap-4">
              {steps.map((step, index) => {
                const Icon = stepIcons[step.icon] || Search;
                return (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                    className="relative group"
                  >
                    <div className="h-full flex flex-col rounded-2xl bg-white/[0.03] border border-white/10 p-5 md:p-6 transition-all duration-300 hover:bg-white/[0.06] hover:border-primary-500/30 hover:shadow-[0_8px_32px_-8px_rgba(59,130,246,0.2)]">
                      {/* Step indicator */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="relative">
                          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-600/25 group-hover:scale-105 transition-transform duration-300">
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-neutral-900 border border-white/20 text-[10px] font-bold text-primary-300 flex items-center justify-center">
                            {step.step}
                          </span>
                        </div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-primary-400/80">
                          Phase {String(step.step).padStart(2, "0")}
                        </span>
                      </div>

                      <h3 className="text-base md:text-lg font-display font-bold text-white mb-2 leading-snug">
                        {step.title}
                      </h3>
                      <p className="text-sm text-neutral-400 leading-relaxed mb-4 flex-1">
                        {step.description}
                      </p>

                      {/* Deliverables */}
                      {step.deliverables?.length > 0 && (
                        <ul className="space-y-2 mb-4 pt-4 border-t border-white/10">
                          {step.deliverables.map((item) => (
                            <li
                              key={item}
                              className="flex items-start gap-2 text-xs text-neutral-300"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
