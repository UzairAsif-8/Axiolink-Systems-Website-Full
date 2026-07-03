import { useState } from "react";
import { Check, Plus } from "lucide-react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

const TechStackMultiSelect = ({
  label,
  stackLabel,
  options = [],
  value = [],
  onChange,
  error,
  helperText,
  disabled = false,
}) => {
  const selected = Array.isArray(value) ? value : [];
  const [customTech, setCustomTech] = useState("");

  const toggle = (tech) => {
    if (disabled) return;
    if (selected.includes(tech)) {
      onChange(selected.filter((item) => item !== tech));
    } else {
      onChange([...selected, tech]);
    }
  };

  const addCustom = () => {
    const trimmed = customTech.trim();
    if (!trimmed || disabled) return;
    if (!selected.includes(trimmed)) onChange([...selected, trimmed]);
    setCustomTech("");
  };

  const displayOptions = [
    ...options,
    ...selected.filter((tech) => !options.includes(tech)),
  ];

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      )}
      {stackLabel && (
        <p className="text-xs text-slate-500 mb-3">
          Suggested for <span className="font-medium text-slate-700">{stackLabel}</span>
          {helperText ? ` · ${helperText}` : " · click to select multiple"}
        </p>
      )}

      {displayOptions.length === 0 ? (
        <p className="text-sm text-slate-400 py-3 px-4 rounded-lg border border-dashed border-slate-200">
          Select an internship title or add custom technologies below.
        </p>
      ) : (
        <div
          className={`flex flex-wrap gap-2 p-3 rounded-lg border bg-slate-50/50 ${
            error ? "border-red-300" : "border-slate-200"
          } ${disabled ? "opacity-60 pointer-events-none" : ""}`}
        >
          {displayOptions.map((tech) => {
            const isSelected = selected.includes(tech);
            return (
              <button
                key={tech}
                type="button"
                onClick={() => toggle(tech)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white text-slate-700 border border-slate-200 hover:border-blue-300 hover:text-blue-700"
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5" />}
                {tech}
              </button>
            );
          })}
        </div>
      )}

      {!disabled && (
        <div className="mt-3 flex gap-2">
          <Input
            value={customTech}
            onChange={(e) => setCustomTech(e.target.value)}
            placeholder="Custom technology…"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCustom();
              }
            }}
          />
          <Button type="button" variant="secondary" onClick={addCustom} disabled={!customTech.trim()}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      )}

      {selected.length > 0 && (
        <p className="mt-2 text-xs text-slate-500">
          {selected.length} selected: {selected.join(", ")}
        </p>
      )}

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default TechStackMultiSelect;
