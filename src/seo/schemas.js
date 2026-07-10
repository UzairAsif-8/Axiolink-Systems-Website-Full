import {
  SITE_URL,
  SITE_NAME,
  SITE_SHORT_NAME,
  SITE_DESCRIPTION,
  SITE_EMAIL,
  SITE_PHONE,
  SITE_ADDRESS,
  SITE_LOGO,
  SOCIAL_PROFILES,
  FOUNDER_NAME,
  FOUNDER_TITLE,
  siteUrl,
} from "./siteConfig.js";

export const buildOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  alternateName: SITE_SHORT_NAME,
  url: SITE_URL,
  logo: SITE_LOGO,
  email: SITE_EMAIL,
  telephone: SITE_PHONE,
  description: SITE_DESCRIPTION,
  sameAs: SOCIAL_PROFILES,
  founder: {
    "@type": "Person",
    name: FOUNDER_NAME,
    jobTitle: FOUNDER_TITLE,
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    email: SITE_EMAIL,
    telephone: SITE_PHONE,
    availableLanguage: ["English", "Urdu"],
  },
});

export const buildSoftwareCompanySchema = () => ({
  "@context": "https://schema.org",
  "@type": "SoftwareCompany",
  name: SITE_NAME,
  alternateName: SITE_SHORT_NAME,
  url: SITE_URL,
  logo: SITE_LOGO,
  description: SITE_DESCRIPTION,
  email: SITE_EMAIL,
  telephone: SITE_PHONE,
  sameAs: SOCIAL_PROFILES,
  address: {
    "@type": "PostalAddress",
    addressLocality: SITE_ADDRESS.addressLocality,
    addressRegion: SITE_ADDRESS.addressRegion,
    addressCountry: SITE_ADDRESS.addressCountry,
  },
  areaServed: ["PK", "Worldwide"],
  knowsAbout: [
    "Software Development",
    "Artificial Intelligence",
    "Web Development",
    "Mobile App Development",
    "Cloud Computing",
    "Cybersecurity",
    "Game Development",
    "Digital Transformation",
  ],
});

export const buildLocalBusinessSchema = () => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/#localbusiness`,
  name: SITE_NAME,
  image: SITE_LOGO,
  url: SITE_URL,
  telephone: SITE_PHONE,
  email: SITE_EMAIL,
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    addressLocality: SITE_ADDRESS.addressLocality,
    addressRegion: SITE_ADDRESS.addressRegion,
    postalCode: SITE_ADDRESS.postalCode,
    addressCountry: SITE_ADDRESS.addressCountry,
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 31.5204,
    longitude: 74.3587,
  },
  sameAs: SOCIAL_PROFILES,
});

export const buildWebSiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  publisher: { "@id": `${SITE_URL}/#organization` },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/blog?search={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
});

export const buildWebPageSchema = ({ name, description, url }) => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  name,
  description,
  url,
  isPartOf: { "@id": `${SITE_URL}/#website` },
  about: { "@id": `${SITE_URL}/#organization` },
});

export const buildAboutPageSchema = () => ({
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: `About ${SITE_SHORT_NAME}`,
  description:
    "Company background, leadership, mission, and expertise of Axiolink Systems — a software company in Lahore, Pakistan.",
  url: siteUrl("/about"),
  mainEntity: buildOrganizationSchema(),
});

export const buildContactPageSchema = () => ({
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: `Contact ${SITE_SHORT_NAME}`,
  description: "Contact Axiolink Systems for software development and IT consulting inquiries.",
  url: siteUrl("/contact"),
});

export const buildBreadcrumbSchema = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.href.startsWith("http") ? item.href : siteUrl(item.href),
  })),
});

export const buildServiceSchema = (service) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: service.title,
  description: service.description,
  url: siteUrl(`/services/${service.slug}`),
  provider: {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
  },
  areaServed: "Worldwide",
  serviceType: service.title,
  offers: {
    "@type": "Offer",
    availability: "https://schema.org/InStock",
    url: siteUrl("/contact"),
  },
});

export const buildServiceFaqSchema = (service) => {
  const faqs = [
    {
      q: `What does ${service.title} include?`,
      a: service.description,
    },
    {
      q: `How long does a typical ${service.title.toLowerCase()} project take?`,
      a: "Project timelines vary by scope. After discovery, we provide a milestone roadmap with clear deliverables and sprint-based delivery.",
    },
    {
      q: `Why choose Axiolink Systems for ${service.title.toLowerCase()}?`,
      a: "We combine enterprise-grade engineering, agile delivery, security best practices, and ongoing partnership support tailored to your business goals.",
    },
  ];

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
};

export const buildHomeSchemas = () => [
  { ...buildOrganizationSchema(), "@id": `${SITE_URL}/#organization` },
  buildSoftwareCompanySchema(),
  buildLocalBusinessSchema(),
  buildWebSiteSchema(),
  buildWebPageSchema({
    name: "Axiolink Systems — Enterprise Technology Solutions",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  }),
];
