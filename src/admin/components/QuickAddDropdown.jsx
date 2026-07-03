import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Plus } from "lucide-react";
import { getQuickAddSections } from "../constants/quickAdd";

const variantClasses = {
  primary:
    "text-white bg-blue-600 hover:bg-blue-700 shadow-sm border border-transparent",
  outline:
    "text-slate-700 bg-white border border-slate-200 hover:bg-slate-50",
  ghost:
    "text-slate-700 bg-slate-50 border border-slate-200 hover:bg-white",
};

const QuickAddDropdown = ({
  label = "Quick Add",
  sectionIds,
  variant = "outline",
  align = "right",
  showIcon = true,
  fullWidth = false,
  className = "",
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const sections = getQuickAddSections(sectionIds);

  useEffect(() => {
    const handler = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
          fullWidth ? "w-full justify-between" : ""
        } ${variantClasses[variant]}`}
      >
        {showIcon && <Plus className="w-4 h-4" />}
        {label}
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          className={`absolute z-50 mt-2 w-64 bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          <div className="max-h-[min(24rem,70vh)] overflow-y-auto py-1">
            {sections.map((section, sectionIndex) => (
              <div key={section.id}>
                {sectionIndex > 0 && <div className="my-1 border-t border-slate-100" />}
                <p className="px-4 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  {section.title}
                </p>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                    >
                      <Icon className="w-4 h-4 shrink-0 opacity-70" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickAddDropdown;
