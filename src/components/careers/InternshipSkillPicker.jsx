import { useState } from "react";
import { Check, Plus, X } from "lucide-react";
import Input from "../ui/Input";

const InternshipSkillPicker = ({
  suggestedSkills = [],
  selected = [],
  onChange,
  error,
  positionSelected = false,
}) => {
  const [customInput, setCustomInput] = useState("");

  const toggle = (skill) => {
    if (selected.includes(skill)) {
      onChange(selected.filter((s) => s !== skill));
    } else {
      onChange([...selected, skill]);
    }
  };

  const addCustom = () => {
    const trimmed = customInput.trim();
    if (!trimmed) return;
    if (!selected.includes(trimmed)) onChange([...selected, trimmed]);
    setCustomInput("");
  };

  const customOnly = selected.filter((s) => !suggestedSkills.includes(s));

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-neutral-700 mb-1">
        Skills *
      </label>
      <p className="text-xs text-neutral-500 mb-3">
        Select skills that match this internship. You can add others below.
      </p>

      {!positionSelected ? (
        <p className="text-sm text-neutral-400 py-3 px-4 rounded-xl border border-dashed border-neutral-200">
          Select an internship position above to see relevant skills.
        </p>
      ) : suggestedSkills.length === 0 ? (
        <p className="text-sm text-neutral-400 py-3 px-4 rounded-xl border border-dashed border-neutral-200 mb-3">
          No preset skills for this role — add your skills below.
        </p>
      ) : (
        <div
          className={`flex flex-wrap gap-2 p-3 rounded-xl border bg-neutral-50/80 mb-3 ${
            error ? "border-red-300" : "border-neutral-200"
          }`}
        >
          {suggestedSkills.map((skill) => {
            const isSelected = selected.includes(skill);
            return (
              <button
                key={skill}
                type="button"
                onClick={() => toggle(skill)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isSelected
                    ? "bg-primary-600 text-white shadow-sm"
                    : "bg-white text-neutral-700 border border-neutral-200 hover:border-primary-300 hover:text-primary-700"
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5" />}
                {skill}
              </button>
            );
          })}
        </div>
      )}

      <div className="space-y-2">
        <p className="text-xs font-medium text-neutral-600">Add other skills</p>
        <div className="flex gap-2">
          <Input
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Type a skill and press Add"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCustom();
              }
            }}
          />
          <button
            type="button"
            onClick={addCustom}
            disabled={!customInput.trim()}
            className="shrink-0 inline-flex items-center justify-center px-4 py-2 rounded-xl border border-neutral-200 bg-white text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-40"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {customOnly.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {customOnly.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary-50 text-primary-800 text-sm border border-primary-100"
            >
              {skill}
              <button
                type="button"
                onClick={() => onChange(selected.filter((s) => s !== skill))}
                className="hover:text-primary-950"
                aria-label={`Remove ${skill}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {selected.length > 0 && (
        <p className="text-xs text-neutral-500 mt-2">
          {selected.length} skill{selected.length !== 1 ? "s" : ""} selected
        </p>
      )}

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default InternshipSkillPicker;
