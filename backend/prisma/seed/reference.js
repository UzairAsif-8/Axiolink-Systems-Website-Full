const defaultSettings = [
  {
    key: "company",
    value: {
      name: "Axiolink Systems (Pvt) Ltd.",
      email: "contact.axiolink@gmail.com",
      phone: "+92 370 5834161",
      address: "Lahore, Pakistan",
    },
  },
  {
    key: "seo",
    value: {
      defaultTitle: "Axiolink Systems (Pvt) Ltd.",
      defaultDescription: "Enterprise software solutions, internships, and the Buland Parwaz training program",
    },
  },
  {
    key: "assets",
    value: {
      avatarBase: "https://i.pravatar.cc/300",
      imageBase: "https://picsum.photos/seed",
      note: "Replace placeholder URLs in production",
    },
  },
  {
    key: "recruitment_popups",
    value: {
      internships: false,
      jobs: false,
      courses: false,
    },
  },
];

const DEPT_LABELS = {
  management: "Management",
  hr: "Operations",
  frontend: "Engineering",
  backend: "Engineering",
  ai: "AI & Data",
  cybersecurity: "Security",
  "ui-ux": "Design",
  marketing: "Marketing",
  sales: "Business",
  operations: "Operations",
};

export { DEPT_LABELS };

export async function seedReference(prisma) {
  console.log("\n📦 Reference data");

  for (const setting of defaultSettings) {
    const update =
      setting.key === "recruitment_popups"
        ? {}
        : { value: setting.value };

    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update,
      create: setting,
    });
  }
  console.log(`  ✓ ${defaultSettings.length} site settings`);

  return {};
}
