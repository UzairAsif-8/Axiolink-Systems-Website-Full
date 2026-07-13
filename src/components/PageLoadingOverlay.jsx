import { motion } from "framer-motion";
import Logo from "../assets/Logo.png";
import { COMPANY_LEGAL_NAME } from "../data/company";

const PageLoadingOverlay = ({ exiting = false }) => {
  return (
    <motion.div
      role="status"
      aria-live="polite"
      aria-busy={!exiting}
      initial={{ opacity: 1 }}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: 0.32, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white"
    >
      <div className="flex flex-col items-center gap-6 px-6 text-center">
        <img
          src={Logo}
          alt={COMPANY_LEGAL_NAME}
          className="h-12 sm:h-14 w-auto object-contain"
          width={260}
          height={64}
          decoding="async"
        />

        <div className="relative flex h-12 w-12 items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-primary-100" />
          <div className="absolute inset-0 rounded-full border-2 border-primary-600 border-t-transparent animate-spin" />
        </div>

        <p className="text-sm font-medium text-neutral-500 tracking-wide">Loading page…</p>
      </div>
      <span className="sr-only">Loading page content</span>
    </motion.div>
  );
};

export default PageLoadingOverlay;
