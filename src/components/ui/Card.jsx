import { forwardRef } from "react";
import { motion } from "framer-motion";
import { usePrefersHover } from "../../hooks/usePrefersHover";

const Card = forwardRef(function Card(
  {
    children,
    className = "",
    hover = false,
    padding = "default",
    ...props
  },
  ref
) {
  const prefersHover = usePrefersHover();
  const baseClasses =
    "bg-white rounded-2xl shadow-lg border border-neutral-200/50 overflow-hidden";

  const hoverClasses = hover
    ? "transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary-200/50"
    : "";

  const paddingClasses = {
    none: "",
    sm: "p-4",
    default: "p-6",
    lg: "p-8",
    xl: "p-10",
  };

  const classes = `${baseClasses} ${hoverClasses} ${paddingClasses[padding]} ${className}`;

  return (
    <motion.div
      ref={ref}
      className={classes}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hover && prefersHover ? { scale: 1.02 } : undefined}
      {...props}
    >
      {children}
    </motion.div>
  );
});

export default Card;
