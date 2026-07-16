/**
 * Course curriculum helpers — stored in Course.curriculum (Json).
 * Shape: { format?, schedule?, modules: [{ title, topics: string[] }] }
 */

export function emptyModule() {
  return { title: "", topicsText: "" };
}

export function parseCurriculum(raw) {
  if (!raw) {
    return { format: "", schedule: "", modules: [] };
  }

  if (Array.isArray(raw)) {
    return {
      format: "",
      schedule: "",
      modules: raw.map(normalizeModule),
    };
  }

  if (typeof raw === "object") {
    const modules = Array.isArray(raw.modules) ? raw.modules : [];
    return {
      format: typeof raw.format === "string" ? raw.format : "",
      schedule: typeof raw.schedule === "string" ? raw.schedule : "",
      modules: modules.map(normalizeModule),
    };
  }

  return { format: "", schedule: "", modules: [] };
}

function normalizeModule(mod, index = 0) {
  if (!mod || typeof mod !== "object") {
    return { title: `Module ${index + 1}`, topics: [] };
  }
  const topics = Array.isArray(mod.topics)
    ? mod.topics.filter((t) => typeof t === "string" && t.trim()).map((t) => t.trim())
    : [];
  return {
    title: typeof mod.title === "string" && mod.title.trim() ? mod.title.trim() : `Module ${index + 1}`,
    topics,
  };
}

/** Convert form module rows (title + topicsText) into API curriculum payload. */
export function buildCurriculumPayload({ format, schedule, modules = [] }) {
  const cleanedModules = modules
    .map((m) => {
      const title = (m.title || "").trim();
      const topics = String(m.topicsText ?? "")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
      if (!title && topics.length === 0) return null;
      return { title: title || "Untitled module", topics };
    })
    .filter(Boolean);

  const fmt = (format || "").trim();
  const sched = (schedule || "").trim();

  if (!fmt && !sched && cleanedModules.length === 0) return null;

  return {
    ...(fmt ? { format: fmt } : {}),
    ...(sched ? { schedule: sched } : {}),
    modules: cleanedModules,
  };
}

/** Load curriculum into form-friendly module rows. */
export function curriculumToFormState(raw) {
  const parsed = parseCurriculum(raw);
  return {
    format: parsed.format,
    schedule: parsed.schedule,
    modules:
      parsed.modules.length > 0
        ? parsed.modules.map((m) => ({
            title: m.title,
            topicsText: (m.topics || []).join("\n"),
          }))
        : [emptyModule()],
  };
}
