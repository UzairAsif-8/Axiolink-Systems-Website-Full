/** Canonical production site URL (with www). */
export const SITE_URL =
  import.meta.env.VITE_SITE_URL?.replace(/\/$/, "") ||
  "https://www.axiolinksystems.com";

export const SITE_NAME = "Axiolink Systems (Pvt) Ltd.";
export const SITE_SHORT_NAME = "Axiolink Systems";
export const SITE_LEGAL_NAME = "Axiolink Systems Pvt Ltd";

export const SITE_DESCRIPTION =
  "Axiolink Systems builds AI solutions, SaaS platforms, websites, mobile apps, cloud applications, game development, cybersecurity solutions, and enterprise software for startups and businesses.";

export const SITE_EMAIL = "contact.axiolink@gmail.com";
export const SITE_PHONE = "+92-370-5834161";
export const SITE_PHONE_DISPLAY = "+92 370 5834161";

export const FOUNDER_NAME = "Muhammad Uzair Asif";
export const FOUNDER_TITLE = "Chief Executive Officer";

export const SITE_ADDRESS = {
  streetAddress: "Lahore",
  addressLocality: "Lahore",
  addressRegion: "Punjab",
  postalCode: "54000",
  addressCountry: "PK",
};

export const SOCIAL_PROFILES = [
  "https://www.linkedin.com/in/muhammad-uzair-asif-760539369/",
  "https://twitter.com/axiolinksystems",
  "https://github.com/axiolink-systems",
];

/** Build an absolute URL for a path on this site. */
export const siteUrl = (path = "") => {
  if (!path) return SITE_URL;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
};

export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;
export const SITE_LOGO = `${SITE_URL}/logoTransparent.png`;
export const THEME_COLOR = "#2563eb";
