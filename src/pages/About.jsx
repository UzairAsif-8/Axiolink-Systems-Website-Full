import { motion } from "framer-motion";
import { useEffect } from "react";
import { Users, Target, Award, TrendingUp } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import CEOSection from "../components/CEOSection";
import BulandParwazCard from "../components/buland-parwaz/BulandParwazCard";
import Logo from "../assets/LogoSimple.png";
import { stockImages } from "../data/stockImages";
import { COMPANY_NAME } from "../data/company";
const About = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);
  const values = [
    {
      icon: Target,
      title: "Mission-Driven",
      description:
        "We are committed to delivering solutions that drive real business value and measurable outcomes for our clients.",
    },
    {
      icon: Users,
      title: "Client-Focused",
      description:
        "Our success is measured by our clients' success. We build lasting partnerships based on trust and results.",
    },
    {
      icon: Award,
      title: "Excellence",
      description:
        "We maintain the highest standards in everything we do, from code quality to customer service.",
    },
    {
      icon: TrendingUp,
      title: "Innovation",
      description:
        "We stay at the forefront of technology, continuously learning and adapting to deliver cutting-edge solutions.",
    },
  ];

  const stats = [
    { number: "500+", label: "Enterprise Clients" },
    { number: "15+", label: "Years Experience" },
    { number: "99.9%", label: "Client Satisfaction" },
    { number: "24/7", label: "Support Coverage" },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-primary-50 to-navy-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge variant="primary" size="lg" className="mb-6">
                About {COMPANY_NAME}
              </Badge>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-neutral-900 mb-6">
                Building the Future of{" "}
                <span className="gradient-text">Enterprise Technology</span>
              </h1>

              <p className="text-xl md:text-2xl text-neutral-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                For over 15 years, we've been helping enterprises transform
                their digital infrastructure with innovative solutions that
                drive growth, enhance security, and streamline operations.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
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

      {/* Mission & Vision */}
      <section className="section-padding bg-neutral-50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-neutral-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-neutral-600 mb-6">
                To empower enterprises with cutting-edge technology solutions
                that drive innovation, enhance security, and accelerate growth.
                We believe that technology should be an enabler, not a barrier,
                to business success.
              </p>
              <p className="text-lg text-neutral-600">
                Our vision is to be the trusted partner that enterprises turn to
                when they need to transform their digital infrastructure and
                stay ahead of the competition in an ever-evolving technological
                landscape.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative space-y-6"
            >
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={stockImages.techWorkspace}
                  alt="Modern technology workspace"
                  className="w-full h-56 md:h-64 object-cover"
                />
              </div>
              <div className="rounded-2xl flex items-center justify-center bg-neutral-50 p-6">
                <img src={Logo} alt={COMPANY_NAME} className="h-32 sm:h-28 md:h-24 w-auto" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-neutral-900 mb-6"
            >
              Our Values
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-neutral-600 max-w-3xl mx-auto"
            >
              These core values guide everything we do and shape how we work
              with our clients.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="text-center h-full">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-neutral-600">{value.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CEO Section */}
      <CEOSection />

      {/* Buland Parwaz Program */}
      <BulandParwazCard />

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-br from-primary-600 to-navy-600">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white mb-6"
            >
              Ready to Work With Us?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto"
            >
              Let's discuss how we can help transform your business with our
              innovative technology solutions.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate("/contact")}
                className="bg-white text-primary-600 hover:bg-primary-50"
              >
                Get in Touch
              </Button>
              <Button
                size="lg"
                variant="ghost"
                onClick={() => navigate("/services")}
                className="text-white border-white hover:bg-white/10"
              >
                View Our Solutions
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
