const StringListField = ({ label, value = [], onChange, placeholder, error, rows = 5 }) => {
  const text = Array.isArray(value) ? value.join("\n") : "";

  const handleChange = (e) => {
    const items = e.target.value
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    onChange(items);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
      <textarea
        value={text}
        onChange={handleChange}
        rows={rows}
        placeholder={placeholder || "One item per line"}
        className={`w-full px-4 py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          error ? "border-red-300" : "border-slate-200"
        }`}
      />
      <p className="mt-1 text-xs text-slate-500">Enter one item per line.</p>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default StringListField;
