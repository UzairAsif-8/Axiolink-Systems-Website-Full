import { Plus, Trash2 } from "lucide-react";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import Button from "../../components/ui/Button";
import { emptyModule } from "../utils/courseCurriculum";

/**
 * Editable list of course modules (title + topics, one topic per line).
 */
const CourseModulesField = ({ modules = [], onChange }) => {
  const updateModule = (index, patch) => {
    onChange(modules.map((m, i) => (i === index ? { ...m, ...patch } : m)));
  };

  const addModule = () => {
    onChange([...modules, emptyModule()]);
  };

  const removeModule = (index) => {
    if (modules.length <= 1) {
      onChange([emptyModule()]);
      return;
    }
    onChange(modules.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <label className="block text-sm font-medium text-slate-900">Course modules</label>
          <p className="text-xs text-slate-500 mt-0.5">
            Add each module with a title and topics (one topic per line). Shown on the public course page.
          </p>
        </div>
        <Button type="button" variant="secondary" onClick={addModule} className="shrink-0">
          <Plus className="w-4 h-4 mr-1" />
          Add module
        </Button>
      </div>

      <div className="space-y-4">
        {modules.map((mod, index) => (
          <div
            key={index}
            className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-3"
          >
            <div className="flex items-start gap-3">
              <span className="mt-2.5 w-7 h-7 rounded-lg bg-blue-100 text-blue-700 text-xs font-semibold flex items-center justify-center shrink-0">
                {index + 1}
              </span>
              <div className="flex-1 space-y-3 min-w-0">
                <Input
                  label={`Module ${index + 1} title`}
                  value={mod.title}
                  onChange={(e) => updateModule(index, { title: e.target.value })}
                  placeholder="e.g. Web Foundations & HTML5"
                />
                <Textarea
                  label="Topics (one per line)"
                  rows={4}
                  value={mod.topicsText}
                  onChange={(e) => updateModule(index, { topicsText: e.target.value })}
                  placeholder={"e.g. How the web works (HTTP, browsers, DNS)\nSemantic HTML5 structure and best practices\nForms, inputs, and validation basics"}
                  helperText="Each line becomes a bullet on the course curriculum section."
                />
              </div>
              <button
                type="button"
                onClick={() => removeModule(index)}
                className="mt-8 p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                title="Remove module"
                aria-label={`Remove module ${index + 1}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseModulesField;
