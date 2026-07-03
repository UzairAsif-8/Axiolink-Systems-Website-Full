const Badge = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
}) => {
  const baseClasses =
    "inline-flex items-center font-semibold rounded-full shadow-sm";

  const variants = {
    primary: "bg-primary-100 text-primary-800 border border-primary-200/50",
    secondary: "bg-neutral-100 text-neutral-800 border border-neutral-200/50",
    success: "bg-green-100 text-green-800 border border-green-200/50",
    warning: "bg-yellow-100 text-yellow-800 border border-yellow-200/50",
    danger: "bg-red-100 text-red-800 border border-red-200/50",
    info: "bg-blue-100 text-blue-800 border border-blue-200/50",
  };

  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-xs",
    lg: "px-4 py-2 text-sm",
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  return <span className={classes}>{children}</span>;
};

export default Badge;
