import { forwardRef } from "react";

const selectClass =
  "w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400";

const FormSelect = forwardRef(
  ({ label, error, helperText, children, className = "", ...props }, ref) => (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
      )}
      <select
        ref={ref}
        className={`${selectClass} ${error ? "border-red-300 focus:ring-red-500/20" : ""}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      {helperText && !error && (
        <p className="mt-2 text-sm text-slate-500">{helperText}</p>
      )}
    </div>
  )
);

FormSelect.displayName = "FormSelect";

export default FormSelect;
