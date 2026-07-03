import { useState } from "react";
import { X } from "lucide-react";

const SkillTagInput = ({ tags, onChange, error }) => {
  const [input, setInput] = useState("");

  const addTag = (raw) => {
    const tag = raw.trim();
    if (!tag || tags.includes(tag) || tags.length >= 12) return;
    onChange([...tags, tag]);
    setInput("");
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && !input && tags.length) {
      onChange(tags.slice(0, -1));
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-2">
        Skills *
      </label>
      <div
        className={`flex flex-wrap gap-2 p-3 min-h-[48px] rounded-xl border bg-white/80 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent transition-all ${
          error ? "border-red-300" : "border-neutral-200"
        }`}
      >
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary-50 text-primary-800 text-sm border border-primary-100"
          >
            {tag}
            <button
              type="button"
              onClick={() => onChange(tags.filter((t) => t !== tag))}
              className="hover:text-primary-950"
              aria-label={`Remove ${tag}`}
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => input && addTag(input)}
          placeholder={tags.length ? "Add another..." : "Type a skill and press Enter"}
          className="flex-1 min-w-[120px] bg-transparent text-sm outline-none placeholder:text-neutral-400"
        />
      </div>
      <p className="text-xs text-neutral-400 mt-1.5">
        Press Enter to add — e.g. React, Python, Figma
      </p>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default SkillTagInput;
