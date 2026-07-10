import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  Star,
  Download,
  Rocket,
  Smartphone,
  TrendingUp,
  Shield,
  Target,
  Award,
  Wrench,
  ArrowLeft,
} from "lucide-react";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import ProcessSection from "../components/ProcessSection";
import { getServiceBySlug, categoryLabels } from "../data/services";
import { COMPANY_NAME } from "../data/company";
import { usePageMeta } from "../hooks/usePageMeta";
import { PAGE_META, serviceMeta } from "../seo/pageMeta";
import { useJsonLd } from "../hooks/useJsonLd";
import {
  buildServiceSchema,
  buildServiceFaqSchema,
  buildBreadcrumbSchema,
} from "../seo/schemas";

const benefitIcons = {
  rocket: Rocket,
  smartphone: Smartphone,
  trending: TrendingUp,
  shield: Shield,
  target: Target,
  award: Award,
};

const ServiceDetail = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const service = getServiceBySlug(slug);

  usePageMeta(service ? serviceMeta(service) : { title: `Service | ${COMPANY_NAME}` });

  useJsonLd(
    service
      ? [
          buildServiceSchema(service),
          buildServiceFaqSchema(service),
          buildBreadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Services", href: "/services" },
            { name: service.title, href: `/services/${service.slug}` },
          ]),
        ]
      : []
  );

  if (!service) {
    return (
      <div className="min-h-screen pt-20 section-padding">
        <div className="container-custom text-center">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">
            Service Not Found
          </h1>
          <p className="text-neutral-600 mb-8">
            The service you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button onClick={() => navigate("/services")}>View All Services</Button>
        </div>
      </div>
    );
  }

  const categoryLabel = categoryLabels[service.category] || service.category;

  return (
    <div className="min-h-screen pt-20">
      <section className="section-padding bg-gradient-to-br from-neutral-50 to-primary-50/30">
        <div className="container-custom">
          <Link
            to="/services"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Services
          </Link>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge variant="primary" size="lg" className="gap-1.5">
                  <Wrench className="w-4 h-4" />
                  {categoryLabel} Service
                </Badge>
                {service.isLatest && (
                  <Badge variant="success" size="sm">
                    Latest
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-neutral-900 mb-6">
                {service.title}
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-neutral-600 mb-8 leading-relaxed">
                {service.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate("/contact")}
                  className="group"
                >
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate("/contact")}
                >
                  Schedule Consultation
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="relative rounded-2xl overflow-hidden shadow-2xl"
            >
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-80 lg:h-96 object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-6">
                What&apos;s Included
              </h2>
              <p className="text-xl text-neutral-600">
                Comprehensive capabilities to ensure your project&apos;s success
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {service.features.map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-4 p-4 bg-neutral-50 rounded-xl"
                >
                  <CheckCircle className="w-6 h-6 text-primary-600 mt-0.5 shrink-0" />
                  <span className="font-medium text-neutral-800">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding bg-gradient-to-br from-primary-50/50 to-neutral-50">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-6">
                Why Choose This Service
              </h2>
              <p className="text-xl text-neutral-600">
                The value you get from working with {COMPANY_NAME}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {service.benefits.map((benefit, index) => {
                const Icon = benefitIcons[benefit.icon] || Rocket;
                return (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full text-center p-8">
                      <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-6 h-6 text-primary-600" />
                      </div>
                      <h3 className="text-xl font-bold text-neutral-900 mb-4">
                        {benefit.title}
                      </h3>
                      <p className="text-neutral-600 leading-relaxed">
                        {benefit.description}
                      </p>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <ProcessSection
        steps={service.process}
        subtitle={`Our ${service.title.toLowerCase()} engagements follow the same transparent, milestone-driven framework — tailored to your stack, priorities, and compliance requirements.`}
      />

      {/* Testimonials */}
      <section className="section-padding bg-neutral-50">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-6">
                What Our Clients Say
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {service.testimonials.map((testimonial) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                >
                  <Card className="p-8 h-full">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                    <p className="text-neutral-600 mb-6 leading-relaxed">
                      &ldquo;{testimonial.content}&rdquo;
                    </p>
                    <div className="flex items-center">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full mr-4 object-cover"
                      />
                      <div>
                        <h4 className="font-semibold text-neutral-900">
                          {testimonial.name}
                        </h4>
                        <p className="text-neutral-600 text-sm">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
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
                Ready to Get Started?
              </h2>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Let&apos;s discuss your {service.title.toLowerCase()} requirements
                and build something great together.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate("/contact")}
                  className="bg-white text-primary-600 hover:bg-neutral-100"
                >
                  Start Your Project
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate("/services")}
                  className="border-2 border-white text-white hover:bg-white hover:text-primary-600"
                >
                  Explore More Services
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetail;
