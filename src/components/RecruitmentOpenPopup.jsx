import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Briefcase, Sparkles, X } from "lucide-react";
import { fetchPublicSettings } from "../api/public";

const SHOW_DELAY_MS = 1200;
const POPUP_STACK_ORDER = ["jobs", "internships"];

const POPUP_CONFIG = {
  internships: {
    title: "Internships Are Open!",
    message: "Apply now and start your journey with Axiolink Systems.",
    cta: "Apply Now",
    href: "/careers#internships",
    accent: "from-primary-500 via-primary-600 to-emerald-500",
    glow: "shadow-primary-500/30",
    iconBg: "bg-primary-100 text-primary-600",
    badge: "Hiring interns",
    enabledAtKey: "internshipsEnabledAt",
  },
  jobs: {
    title: "Jobs Are Open!",
    message: "Apply now and join our growing team.",
    cta: "Apply Now",
    href: "/careers#jobs",
    accent: "from-navy-500 via-primary-600 to-primary-500",
    glow: "shadow-navy-500/30",
    iconBg: "bg-navy-100 text-navy-600",
    badge: "Now hiring",
    enabledAtKey: "jobsEnabledAt",
  },
};

function dismissStorageKey(type) {
  return `axiolink_popup_dismissed_${type}`;
}

function isPopupDismissed(type, enabledAt) {
  if (!enabledAt) return false;
  return localStorage.getItem(dismissStorageKey(type)) === String(enabledAt);
}

function isPopupEnabled(type, popups) {
  if (popups?.[type] !== true) return false;
  const enabledAt = popups[POPUP_CONFIG[type].enabledAtKey];
  if (!enabledAt) return true;
  return !isPopupDismissed(type, enabledAt);
}

function PopupCard({ type, onDismiss, stackIndex = 0 }) {
  const config = POPUP_CONFIG[type];

  return (
    <motion.div
      role="alertdialog"
      aria-labelledby={`recruitment-popup-${type}-title`}
      layout
      initial={{ opacity: 0, x: 72, y: 24, scale: 0.94 }}
      animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 48, y: 12, scale: 0.96 }}
      transition={{
        type: "spring",
        damping: 22,
        stiffness: 280,
        delay: stackIndex * 0.18,
      }}
      className={`recruitment-popup-card relative w-[min(100vw-2rem,22rem)] shrink-0 overflow-hidden rounded-2xl border border-white/60 bg-white/95 backdrop-blur-md shadow-2xl ${config.glow}`}
    >
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${config.accent}`} />
      <motion.div
        className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${config.accent} opacity-20 blur-2xl`}
        animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.28, 0.15] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      <button
        type="button"
        onClick={onDismiss}
        className="absolute right-3 top-3 z-10 rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="relative p-4 pt-5">
        <div className="mb-3 flex items-center gap-3">
          <motion.div
            className={`flex h-11 w-11 items-center justify-center rounded-xl ${config.iconBg}`}
            animate={{ rotate: [0, -4, 4, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Briefcase className="h-5 w-5" />
          </motion.div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
            <motion.span
              className="h-1.5 w-1.5 rounded-full bg-emerald-500"
              animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
            {config.badge}
          </span>
        </div>

        <h2
          id={`recruitment-popup-${type}-title`}
          className="text-lg font-display font-bold leading-tight text-neutral-900"
        >
          {config.title}
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-neutral-600">{config.message}</p>

        <Link
          to={config.href}
          onClick={onDismiss}
          className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r px-4 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] ${config.accent}`}
        >
          <Sparkles className="h-4 w-4" />
          {config.cta}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </motion.div>
  );
}

const RecruitmentOpenPopup = () => {
  const location = useLocation();
  const [visibleTypes, setVisibleTypes] = useState([]);
  const [mounted, setMounted] = useState(false);

  const { data: settings, isSuccess } = useQuery({
    queryKey: ["public-settings"],
    queryFn: fetchPublicSettings,
    staleTime: 15_000,
    refetchOnWindowFocus: true,
    retry: 2,
  });

  const popups = settings?.recruitment_popups || {};
  const isAdmin = location.pathname.startsWith("/admin");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isSuccess || isAdmin) {
      setVisibleTypes([]);
      return;
    }

    const enabled = POPUP_STACK_ORDER.filter((type) => isPopupEnabled(type, popups));

    if (enabled.length === 0) {
      setVisibleTypes([]);
      return;
    }

    const timer = window.setTimeout(() => setVisibleTypes(enabled), SHOW_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [
    isSuccess,
    isAdmin,
    popups.internships,
    popups.jobs,
    popups.internshipsEnabledAt,
    popups.jobsEnabledAt,
    location.pathname,
  ]);

  const dismiss = (type) => {
    const enabledAt = popups[POPUP_CONFIG[type].enabledAtKey];
    if (enabledAt) {
      localStorage.setItem(dismissStorageKey(type), String(enabledAt));
    }
    setVisibleTypes((prev) => prev.filter((t) => t !== type));
  };

  const stackedTypes = [...visibleTypes].sort(
    (a, b) => POPUP_STACK_ORDER.indexOf(a) - POPUP_STACK_ORDER.indexOf(b)
  );

  if (!mounted) return null;

  return createPortal(
    <div className="pointer-events-none fixed bottom-4 right-4 z-[9999] sm:bottom-6 sm:right-6">
      <div className="flex flex-col-reverse items-end gap-4">
        <AnimatePresence>
          {stackedTypes.map((type, index) => (
            <div key={type} className="pointer-events-auto" style={{ zIndex: index + 1 }}>
              <PopupCard
                type={type}
                stackIndex={index}
                onDismiss={() => dismiss(type)}
              />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </div>,
    document.body
  );
};

export default RecruitmentOpenPopup;
