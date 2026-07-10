import { useState, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  Rocket,
  Shield,
  TrendingUp,
  Target,
  Wrench,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import ProductCard from "../components/ProductCard";
import TrustStrip from "../components/TrustStrip";
import CEOSection from "../components/CEOSection";
import { COMPANY_NAME } from "../data/company";
import { getHomeServices, toProductCard } from "../data/services";
import { usePageMeta } from "../hooks/usePageMeta";
import { PAGE_META } from "../seo/pageMeta";
import { useJsonLd } from "../hooks/useJsonLd";
import { buildWebPageSchema } from "../seo/schemas";

const Antigravity = lazy(() => import("../components/Antigravity/Antigravity"));

const Home = () => {
  usePageMeta(PAGE_META.home);
  useJsonLd(
    buildWebPageSchema({
      name: PAGE_META.home.title,
      description: PAGE_META.home.description,
      url: PAGE_META.home.canonical,
    })
  );

  const navigate = useNavigate();
  const [heroEl, setHeroEl] = useState(null);
  const services = getHomeServices().map(toProductCard);

  const features = [
    {
      icon: Rocket,
      title: "Rapid Deployment",
      description: "Get your solutions up and running in days, not months",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security with SOC 2 compliance and encryption",
    },
    {
      icon: TrendingUp,
      title: "Scalable Growth",
      description: "Solutions that grow with your business needs",
    },
    {
      icon: Target,
      title: "Expert Support",
      description: "24/7 support from our team of certified professionals",
    },
  ];

  const stats = [
    { number: "500+", label: "Enterprise Clients" },
    { number: "99.9%", label: "Uptime SLA" },
    { number: "24/7", label: "Expert Support" },
    { number: "15+", label: "Years Experience" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        ref={setHeroEl}
        className="relative min-h-[85dvh] sm:min-h-screen flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 z-0 h-full w-full pointer-events-none" aria-hidden="true">
          {heroEl && (
            <Suspense fallback={null}>
              <Antigravity
                eventSource={heroEl}
                autoAnimate
                color="#93c5fd"
              />
            </Suspense>
          )}
        </div>

        <div className="container-custom relative z-10 pt-24 pb-12 sm:pt-28 sm:pb-16 lg:pt-32 lg:pb-20">
          <div className="text-center max-w-4xl mx-auto">
              {/* Company Slogan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="mb-6"
            >
              <div className="inline-block">
                <div className="text-lg md:text-xl font-light text-neutral-600 tracking-[0.15em] mb-1">
                  SCALABLE SOLUTIONS
                </div>
                <div className="text-sm md:text-base font-thin text-primary-600 italic tracking-wide">
                  Infinite Possibilities
                </div>
                <div className="w-20 h-0.5 bg-gradient-to-r from-primary-400 to-emerald-400 mx-auto mt-3" />
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6 leading-tight"
            >
              Transform Your Business with{" "}
              <motion.span
                className="bg-gradient-to-r from-primary-500 via-primary-600 to-emerald-500 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  backgroundSize: "200% 200%",
                }}
              >
                Intelligent
              </motion.span>{" "}
              Technology
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg text-neutral-600 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              We deliver cutting-edge enterprise solutions that drive growth,
              enhance security, and streamline operations for modern businesses.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  onClick={() => navigate("/contact")}
                  className="group bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800 shadow-xl hover:shadow-2xl transition-all duration-300 px-8 py-4 text-lg font-semibold rounded-xl border-0"
                >
                  Get Started
                  <motion.div
                    className="ml-2"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => navigate("/about")}
                  className="group border-2 border-primary-200 text-primary-700 bg-white/80 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-800 shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-4 text-lg font-semibold rounded-xl backdrop-blur-sm"
                >
                  Learn More
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap justify-center items-center gap-6 text-neutral-500 mb-16"
            >
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium">
                  Enterprise-Grade Security
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium">24/7 Support</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium">
                  Scalable Infrastructure
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <TrustStrip />

     {/* Stats Section */}
<section className="pt-20  bg-neutral-50">
  <div className="container-custom">

    {/* Heading */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-8"
    >
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-neutral-900 mb-6">
        Our <span className="gradient-text bg-gradient-to-r from-primary-600 to-navy-600 bg-clip-text text-transparent">
                Impact
              </span>
      </h2>

      <p className="text-neutral-600 max-w-2xl mx-auto">
        We focus on measurable outcomes that reflect real-world growth, performance, and success.
      </p>
    </motion.div>

    {/* Stats Grid */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="text-center"
        >
          <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-600 mb-2">
            {stat.number}
          </div>
          <div className="text-sm md:text-base text-neutral-600">
            {stat.label}
          </div>
        </motion.div>
      ))}
    </div>

  </div>
</section>

      {/* Features Section */}
      <section className="section-padding bg-gradient-to-br from-neutral-50 to-primary-50/30">
        <div className="container-custom">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Badge variant="secondary" size="lg" className="mb-4">
               Our Advantages
              </Badge>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-neutral-900 mb-8"
            >
              Why Choose{" "}
              <span className="gradient-text bg-gradient-to-r from-primary-600 to-navy-600 bg-clip-text text-transparent">
                {COMPANY_NAME}?
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl text-neutral-600 max-w-4xl mx-auto leading-relaxed"
            >
              We combine deep technical expertise with business acumen to
              deliver solutions that drive real results for your organization.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <Card
                  hover
                  className="h-full p-8 text-center border-2 border-transparent hover:border-primary-200 transition-all duration-300"
                >
                  <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-7 h-7 text-primary-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-4 group-hover:text-primary-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-600 leading-relaxed text-lg">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="section-padding bg-gradient-to-br from-white to-neutral-50">
        <div className="container-custom">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Badge variant="primary" size="lg" className="mb-4 gap-1.5">
                <Wrench className="w-4 h-4" />
                Our Services
              </Badge>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-neutral-900 mb-8"
            >
              Professional{" "}
              <span className="gradient-text bg-gradient-to-r from-navy-600 to-primary-600 bg-clip-text text-transparent">
                Development Services
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl text-neutral-600 max-w-4xl mx-auto mb-12 leading-relaxed"
            >
              From mobile apps to web platforms, we deliver comprehensive
              development and design services to bring your ideas to life.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate("/services")}
                className="shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                View All Services
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ProductCard key={service.id} product={service} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CEO Section */}
      <CEOSection />

      {/* CTA Section */}
      <section className="relative section-padding bg-gradient-to-br from-primary-600 via-primary-700 to-navy-600 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40" />
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-bounce-subtle" />
        <div
          className="absolute bottom-10 right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl animate-bounce-subtle"
          style={{ animationDelay: "1s" }}
        />

        <div className="container-custom relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <Badge
                variant="secondary"
                size="lg"
                className="mb-6 gap-1.5 bg-white/20 text-white border-white/30"
              >
                <Target className="w-4 h-4" />
                Get Started Today
              </Badge>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-white mb-8 leading-tight"
            >
              Ready to Transform Your{" "}
              <span className="bg-gradient-to-r from-white to-primary-100 bg-clip-text text-transparent">
                Business?
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl text-primary-100 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Let's discuss how our solutions can help you achieve your business
              goals. Schedule a consultation with our experts today.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-6 justify-center"
            >
              <Button
                size="xl"
                variant="secondary"
                onClick={() => navigate("/contact")}
                className="bg-white text-primary-600 hover:bg-primary-50 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
              >
                Schedule Consultation
                <ArrowRight className="ml-3 w-6 h-6" />
              </Button>
              <Button
                size="xl"
                variant="ghost"
                onClick={() => navigate("/blog")}
                className="!text-white hover:!text-white border-2 border-white/30 hover:bg-white/10 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                View Case Studies
                <ArrowRight className="ml-3 w-6 h-6 text-white" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
