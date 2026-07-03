/** Smooth scroll with offset for fixed site header (~96px) */
const DEFAULT_OFFSET = 96;

export function scrollToElement(
  element,
  { offset = DEFAULT_OFFSET, behavior = "smooth", block = "start" } = {}
) {
  if (!element || typeof window === "undefined") return;

  requestAnimationFrame(() => {
    setTimeout(() => {
      if (block === "center") {
        element.scrollIntoView({ behavior, block: "center" });
        return;
      }

      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: Math.max(0, top), behavior });
    }, 80);
  });
}

export function scrollToRef(ref, options) {
  scrollToElement(ref?.current, options);
}

export function scrollToId(id, options) {
  const el = typeof document !== "undefined" ? document.getElementById(id) : null;
  scrollToElement(el, options);
}
