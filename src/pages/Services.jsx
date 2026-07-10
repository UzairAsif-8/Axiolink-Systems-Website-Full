import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Filter, ArrowRight, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import ServiceCard from "../components/ServiceCard";
import {
  getServicesByPopularity,
  serviceCategories,
  toProductCard,
} from "../data/services";
import { usePageMeta } from "../hooks/usePageMeta";
import { PAGE_META } from "../seo/pageMeta";
import { useJsonLd } from "../hooks/useJsonLd";
import { buildBreadcrumbSchema, buildWebPageSchema } from "../seo/schemas";

const Services = () => {
  usePageMeta(PAGE_META.services);
  useJsonLd([
    buildWebPageSchema({
      name: PAGE_META.services.title,
      description: PAGE_META.services.description,
      url: PAGE_META.services.canonical,
    }),
    buildBreadcrumbSchema([
      { name: "Home", href: "/" },
      { name: "Services", href: "/services" },
    ]),
  ]);

  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredServices = useMemo(() => {
    return getServicesByPopularity().filter((service) => {
      const matchesSearch =
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || service.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="section-padding bg-gradient-to-br from-neutral-50 via-white to-primary-50/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%233B82F6%22%20fill-opacity%3D%220.04%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-80" />
        <div className="container-custom relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Badge variant="primary" size="lg" className="mb-4 gap-1.5">
                <Wrench className="w-4 h-4" />
                Our Services
              </Badge>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-neutral-900 mb-6"
            >
              Professional{" "}
              <span className="bg-gradient-to-r from-navy-600 via-primary-600 to-emerald-600 bg-clip-text text-transparent">
                Technology Services
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg md:text-xl text-neutral-600 leading-relaxed"
            >
              From web and mobile to AI and gaming — sorted by what teams request
              most, so you find the right fit faster.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Search & Filter — sticky on scroll */}
      <section className="sticky top-16 md:top-20 z-30 py-4 bg-white/90 backdrop-blur-lg border-b border-neutral-100 shadow-sm">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
            <div className="flex-1 relative max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
              <Input
                label="Search services"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 bg-neutral-50 border-neutral-200 focus:border-primary-500 rounded-xl"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {serviceCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category.id
                      ? "bg-primary-600 text-white shadow-md shadow-primary-500/25"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-gradient-to-b from-neutral-50 to-white">
        <div className="container-custom">
          <div className="flex items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-neutral-900">
                {selectedCategory === "all"
                  ? "All Services"
                  : serviceCategories.find((c) => c.id === selectedCategory)
                      ?.name}
              </h2>
              <p className="text-neutral-500 mt-1 text-sm">
                {selectedCategory === "all"
                  ? "Ordered by most commonly requested"
                  : `${filteredServices.length} service${filteredServices.length !== 1 ? "s" : ""} available`}
              </p>
            </div>
            <span className="text-sm font-medium text-neutral-400 tabular-nums">
              {filteredServices.length} results
            </span>
          </div>

          {filteredServices.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredServices.map((service, index) => (
                <ServiceCard
                  key={service.slug}
                  service={toProductCard(service)}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 rounded-2xl bg-white border border-neutral-200"
            >
              <Filter className="w-14 h-14 mx-auto text-neutral-300 mb-4" />
              <h3 className="text-xl font-semibold text-neutral-700 mb-2">
                No services found
              </h3>
              <p className="text-neutral-500 mb-6">
                Try adjusting your search or category filter.
              </p>
              <Button
                variant="secondary"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}
              >
                Clear Filters
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-br from-primary-600 via-primary-700 to-navy-600">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white mb-6">
                Ready to Start Your Project?
              </h2>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Tell us about your goals — we&apos;ll recommend the right service
                and build a plan together.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate("/contact")}
                  className="bg-white text-primary-600 hover:bg-neutral-100"
                >
                  Get a Quote
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate("/contact")}
                  className="border-2 border-white text-white hover:bg-white hover:text-primary-600"
                >
                  Schedule Consultation
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
