import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const ServiceCard = ({ service, index = 0 }) => {
  const { title, description, features, image, href, category } = service;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      className="group h-full"
    >
      <Link to={href} className="block h-full outline-none">
        <div className="relative h-full flex flex-col rounded-2xl overflow-hidden bg-white border border-neutral-200/80 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.08)] transition-all duration-500 ease-out group-hover:shadow-[0_20px_50px_-12px_rgba(59,130,246,0.25)] group-hover:border-primary-200/60 group-hover:-translate-y-1.5">
          {/* Image */}
          <div className="relative h-56 overflow-hidden shrink-0">
            <img
              src={image}
              alt={title}
              width={640}
              height={224}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/30 to-neutral-950/10 transition-opacity duration-500 group-hover:from-neutral-950/95" />

            {/* Category pill */}
            {category && (
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-white/15 text-white backdrop-blur-md border border-white/20">
                  {category}
                </span>
              </div>
            )}

            {/* Title on image */}
            <div className="absolute bottom-0 left-0 right-0 p-5 pt-12">
              <h3 className="text-xl font-display font-bold text-white leading-snug group-hover:text-primary-100 transition-colors">
                {title}
              </h3>
            </div>

            {/* Hover arrow */}
            <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
              <ArrowUpRight className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Body */}
          <div className="flex flex-col flex-1 p-5 pt-4">
            <p className="text-sm text-neutral-600 leading-relaxed line-clamp-2 mb-4 flex-1">
              {description}
            </p>

            <div className="flex flex-wrap gap-1.5 mb-5">
              {features.slice(0, 3).map((feature) => (
                <span
                  key={feature}
                  className="inline-flex px-2.5 py-1 rounded-md text-xs font-medium bg-neutral-100 text-neutral-600 group-hover:bg-primary-50 group-hover:text-primary-700 transition-colors duration-300"
                >
                  {feature}
                </span>
              ))}
              {features.length > 3 && (
                <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-medium text-neutral-400">
                  +{features.length - 3}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-neutral-100 group-hover:border-primary-100 transition-colors">
              <span className="text-sm font-semibold text-primary-600 group-hover:text-primary-700">
                Explore service
              </span>
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-50 text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:rotate-45" />
              </span>
            </div>
          </div>

          {/* Bottom accent */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 via-emerald-500 to-primary-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
        </div>
      </Link>
    </motion.article>
  );
};

export default ServiceCard;
