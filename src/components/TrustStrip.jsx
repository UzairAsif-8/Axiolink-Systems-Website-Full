import { useMemo } from "react";
import { motion } from "framer-motion";
import Badge from "../components/ui/Badge";

const TECHNOLOGIES = [
  {
    name: "React Ecosystem",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  },
  {
    name: "Next.js",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original-wordmark.svg",
  },
  {
    name: "Node.js & Express",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  },
  {
    name: "Python & AI",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  },
  {
    name: "Cloud (AWS)",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg",
  },
  {
    name: "Docker",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
  },
  {
    name: "MongoDB",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
  },
  {
    name: "PostgreSQL",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
  },
  {
    name: "Firebase",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg",
  },
  {
    name: "Git & GitHub",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
  },
  {
    name: "Linux Servers",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg",
  },
];

const TechLogo = ({ tech }) => (
  <div className="group flex flex-col items-center shrink-0 px-8 md:px-10 cursor-default">
    <img
      src={tech.logo}
      alt={tech.name}
      loading="lazy"
      draggable={false}
      className="h-9 md:h-11 w-auto max-w-[130px] object-contain transition-transform duration-300 group-hover:scale-110"
    />
    <span className="mt-2 text-xs font-medium text-neutral-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
      {tech.name}
    </span>
  </div>
);

const TrustStrip = () => {
  const marqueeItems = useMemo(
    () => [...TECHNOLOGIES, ...TECHNOLOGIES],
    []
  );

  return (
    <section className="py-12 bg-white border-b border-neutral-100 overflow-hidden">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <Badge variant="secondary" size="lg" className="mb-4">
            Built with modern technologies
          </Badge>
        </motion.div>
      </div>

      {/* Infinite auto-scroll marquee */}
      <div
        className="tech-marquee relative w-full overflow-hidden"
        aria-label="Technologies we use"
      >
        <div className="tech-marquee-track flex items-center">
          {marqueeItems.map((tech, index) => (
            <TechLogo key={`${tech.name}-${index}`} tech={tech} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustStrip;
