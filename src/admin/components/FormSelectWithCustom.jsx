import { useEffect, useMemo, useState } from "react";
import FormSelect from "./FormSelect";
import Input from "../../components/ui/Input";

export const CUSTOM_SELECT_VALUE = "__custom__";

const normalizeOptions = (options) =>
  (options || []).map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt
  );

/**
 * Dropdown with preset options plus "Custom…" that reveals a text/number input.
 */
const FormSelectWithCustom = ({
  label,
  value,
  onChange,
  onBlur,
  name,
  options = [],
  error,
  helperText,
  customPlaceholder = "Enter custom value",
  customInputType = "text",
  customMin,
  customMax,
  emptyLabel = "Select…",
  allowEmpty = false,
}) => {
  const presetOptions = useMemo(() => normalizeOptions(options), [options]);
  const presetValues = useMemo(
    () => new Set(presetOptions.map((o) => String(o.value))),
    [presetOptions]
  );

  const valueStr = value == null ? "" : String(value);
  const isPreset = presetValues.has(valueStr);
  const [customMode, setCustomMode] = useState(Boolean(valueStr) && !isPreset);

  useEffect(() => {
    if (valueStr && !presetValues.has(valueStr)) setCustomMode(true);
    if (!valueStr && !customMode) setCustomMode(false);
  }, [valueStr, presetValues, customMode]);

  const selectValue = customMode ? CUSTOM_SELECT_VALUE : valueStr;

  const handleSelectChange = (e) => {
    const next = e.target.value;
    if (next === CUSTOM_SELECT_VALUE) {
      setCustomMode(true);
      onChange?.({ target: { name, value: "" } });
      return;
    }
    setCustomMode(false);
    onChange?.({ target: { name, value: next } });
  };

  return (
    <div className="w-full">
      <FormSelect
        label={label}
        name={name}
        value={selectValue}
        onChange={handleSelectChange}
        onBlur={onBlur}
        error={error}
        helperText={helperText}
      >
        {allowEmpty && <option value="">{emptyLabel}</option>}
        {presetOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
        <option value={CUSTOM_SELECT_VALUE}>Custom…</option>
      </FormSelect>

      {customMode && (
        <div className="mt-2">
          <Input
            type={customInputType}
            min={customMin}
            max={customMax}
            value={valueStr}
            onChange={(e) => onChange?.({ target: { name, value: e.target.value } })}
            onBlur={onBlur}
            placeholder={customPlaceholder}
          />
        </div>
      )}
    </div>
  );
};

export default FormSelectWithCustom;
