import { useEffect, useMemo } from "react";

/** Inject JSON-LD structured data; removes on unmount */
export const useJsonLd = (schemas) => {
  const schemaKey = useMemo(
    () => JSON.stringify(Array.isArray(schemas) ? schemas : [schemas]),
    [schemas]
  );

  useEffect(() => {
    const list = JSON.parse(schemaKey).filter(Boolean);
    if (!list.length) return undefined;

    const scripts = list.map((data, i) => {
      const el = document.createElement("script");
      el.type = "application/ld+json";
      el.setAttribute("data-seo-schema", String(i));
      el.textContent = JSON.stringify(data);
      document.head.appendChild(el);
      return el;
    });

    return () => {
      scripts.forEach((el) => el.remove());
    };
  }, [schemaKey]);
};
