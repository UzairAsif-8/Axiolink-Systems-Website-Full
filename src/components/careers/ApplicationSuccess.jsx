import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { CheckCircle2 } from "lucide-react";
import Button from "../ui/Button";
import { scrollToRef } from "../../utils/scrollTo";

const CONFETTI = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  x: (Math.random() - 0.5) * 280,
  y: -(Math.random() * 120 + 40),
  rotate: Math.random() * 360,
  color: ["#3b82f6", "#10b981", "#6366f1", "#f59e0b"][i % 4],
}));

const ApplicationSuccess = ({ onBack }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    scrollToRef(containerRef, { block: "center" });
  }, []);

  return (
  <motion.div
    ref={containerRef}
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    className="relative text-center py-16 px-8 rounded-2xl bg-white/80 backdrop-blur-xl border border-green-200/60 shadow-xl overflow-hidden scroll-mt-24"
    tabIndex={-1}
    role="status"
    aria-live="polite"
  >
    {/* Confetti */}
    {CONFETTI.map((p) => (
      <motion.span
        key={p.id}
        initial={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
        animate={{
          opacity: 0,
          x: p.x,
          y: p.y,
          rotate: p.rotate,
        }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute left-1/2 top-1/3 w-2 h-2 rounded-sm pointer-events-none"
        style={{ backgroundColor: p.color }}
      />
    ))}

    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.15 }}
      className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10"
    >
      <CheckCircle2 className="w-8 h-8 text-green-600" />
    </motion.div>

    <h2 className="text-2xl md:text-3xl font-display font-bold text-neutral-900 mb-4 relative z-10">
      Thank you for applying! 🎉
    </h2>
    <p className="text-neutral-600 max-w-md mx-auto leading-relaxed relative z-10">
      Your application has been received successfully. Our recruitment team
      will review it and contact shortlisted candidates via email.
    </p>

    <Button size="lg" onClick={onBack} className="mt-8 relative z-10">
      Back to Careers
    </Button>
  </motion.div>
  );
};

export default ApplicationSuccess;
