import { useEffect } from "react";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "../seo/siteConfig.js";

const META_DEFAULTS = {
  description: "",
  robots: "index, follow",
  "og:site_name": SITE_NAME,
  "og:locale": "en_US",
};

/** Updates document title and meta tags for SEO */
export const usePageMeta = ({
  title,
  description,
  ogTitle,
  ogDescription,
  ogImage,
  ogType = "website",
  canonical,
  noindex = false,
}) => {
  useEffect(() => {
    if (title) document.title = title;

    const image = ogImage || DEFAULT_OG_IMAGE;

    const setMeta = (name, content, attr = "name") => {
      if (content === undefined || content === null) return;
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("description", description || META_DEFAULTS.description);
    setMeta("robots", noindex ? "noindex, nofollow" : META_DEFAULTS.robots);
    setMeta("og:title", ogTitle || title, "property");
    setMeta("og:description", ogDescription || description, "property");
    setMeta("og:type", ogType, "property");
    setMeta("og:image", image, "property");
    setMeta("og:site_name", META_DEFAULTS["og:site_name"], "property");
    setMeta("og:locale", META_DEFAULTS["og:locale"], "property");
    setMeta("og:url", canonical || SITE_URL, "property");
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:url", canonical || SITE_URL);
    setMeta("twitter:title", ogTitle || title);
    setMeta("twitter:description", ogDescription || description);
    setMeta("twitter:image", image);

    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = canonical || SITE_URL;
  }, [
    title,
    description,
    ogTitle,
    ogDescription,
    ogImage,
    ogType,
    canonical,
    noindex,
  ]);
};
