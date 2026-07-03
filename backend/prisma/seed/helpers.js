/** Shared utilities for demo seed data */

export const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const daysAgo = (days) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(10 + (days % 8), (days * 7) % 60, 0, 0);
  return d;
};

export const monthsAgo = (months, day = 15) => {
  const d = new Date();
  d.setMonth(d.getMonth() - months);
  d.setDate(day);
  d.setHours(9, 30, 0, 0);
  return d;
};

export const dateInMonth = (year, month, day, hour = 11) => {
  const d = new Date(year, month, day, hour, 0, 0, 0);
  return d;
};

export const pick = (arr, index = 0) => arr[index % arr.length];

export const distribute = (total, buckets) => {
  const base = Math.floor(total / buckets.length);
  const remainder = total % buckets.length;
  return buckets.map((_, i) => base + (i < remainder ? 1 : 0));
};

/** Configurable placeholder assets — replace URLs in production */
export const ASSETS = {
  avatar: (seed) => `https://i.pravatar.cc/300?u=axiolink-${seed}`,
  courseThumb: (seed) => `https://picsum.photos/seed/axiolink-${seed}-thumb/640/360`,
  courseBanner: (seed) => `https://picsum.photos/seed/axiolink-${seed}-banner/1200/400`,
  internshipImage: (seed) => `https://picsum.photos/seed/axiolink-${seed}-intern/1200/600`,
  blogImage: (seed) => `https://picsum.photos/seed/axiolink-${seed}-blog/1200/630`,
  resume: (name) =>
    `https://placehold.co/800x1100/1e40af/ffffff?text=${encodeURIComponent(name.replace(/\s+/g, "+"))}+Resume`,
};

export const PAKISTANI_NAMES = {
  male: [
    "Ahmed Khan", "Usman Ali", "Hassan Raza", "Bilal Ahmed", "Omar Farooq",
    "Zain Malik", "Hamza Sheikh", "Saad Hussain", "Fahad Iqbal", "Tariq Mehmood",
    "Imran Siddiqui", "Waqas Butt", "Asad Javed", "Nabeel Qureshi", "Shahzaib Mir",
  ],
  female: [
    "Fatima Ali", "Ayesha Khan", "Sana Malik", "Hira Ahmed", "Zara Hussain",
    "Maryam Raza", "Nida Sheikh", "Amna Farooq", "Rabia Iqbal", "Sadia Qureshi",
    "Khadija Mir", "Laiba Butt", "Mahnoor Siddiqui", "Anum Javed", "Hania Mehmood",
  ],
};

export const UNIVERSITIES = [
  "LUMS", "NUST", "FAST-NUCES", "COMSATS", "UET Lahore",
  "IBA Karachi", "GIKI", "Air University", "PU Lahore", "NED University",
];

export const DEGREES = [
  "BS Computer Science", "BS Software Engineering", "BS IT",
  "BS Cyber Security", "BS AI", "BS Data Science", "BS Design",
  "BBA", "MBA", "MS Computer Science",
];

export const SKILLS_POOL = [
  "JavaScript", "React", "Node.js", "Python", "TypeScript", "SQL",
  "Figma", "UI Design", "Docker", "AWS", "Machine Learning",
  "Cybersecurity", "Content Writing", "SEO", "Digital Marketing",
  "Java", "C++", "Flutter", "GraphQL", "MongoDB",
];
