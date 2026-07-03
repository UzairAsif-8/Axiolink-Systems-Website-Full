import {
  INTERNSHIP_TITLE_OPTIONS,
  getTechStackForTitle,
  ALL_TECHNOLOGY_OPTIONS,
} from "../admin/constants/internshipForm";

/** Suggested checkboxes for the application form based on selected internship */
export function getSuggestedSkillsForInternship(internship) {
  if (!internship) return [];

  if (Array.isArray(internship.technologies) && internship.technologies.length > 0) {
    return internship.technologies;
  }

  const title = internship.title || "";
  const stack = getTechStackForTitle(title);
  if (stack.options?.length) return stack.options;

  const preset = INTERNSHIP_TITLE_OPTIONS.find((o) => o.title === title);
  if (preset?.techKey && stack.defaults?.length) return stack.defaults;

  return [];
}

export function getFallbackSkillOptions() {
  return ALL_TECHNOLOGY_OPTIONS.slice(0, 24);
}
