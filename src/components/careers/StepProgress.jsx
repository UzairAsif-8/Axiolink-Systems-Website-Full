import { motion } from "framer-motion";

const StepProgress = ({ steps, currentStep }) => (
  <div className="flex items-center gap-2" role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={steps.length}>
    {steps.map((s, index) => {
      const done = currentStep > s.id;
      const active = currentStep === s.id;
      return (
        <div key={s.id} className="flex items-center flex-1 last:flex-none">
          <div className="flex items-center gap-2 min-w-0">
            <motion.div
              animate={{
                scale: active ? 1.05 : 1,
                backgroundColor: done || active ? "#2563eb" : "#e5e7eb",
              }}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                done || active ? "text-white" : "text-neutral-500"
              }`}
            >
              {done ? "✓" : s.id}
            </motion.div>
            <span
              className={`text-xs font-medium hidden sm:block truncate ${
                active ? "text-primary-700" : done ? "text-neutral-700" : "text-neutral-400"
              }`}
            >
              {s.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className="flex-1 h-0.5 mx-2 bg-neutral-200 rounded-full overflow-hidden min-w-[24px]">
              <motion.div
                className="h-full bg-primary-500"
                initial={{ width: "0%" }}
                animate={{ width: done ? "100%" : active ? "50%" : "0%" }}
                transition={{ duration: 0.3 }}
              />
            </div>
          )}
        </div>
      );
    })}
  </div>
);

export default StepProgress;
