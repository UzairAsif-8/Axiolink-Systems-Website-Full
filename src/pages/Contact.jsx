import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, Clock, Send, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import { submitContact } from "../api/contact";
import { SITE_CONTACT } from "../data/siteContact";
import { scrollToRef } from "../utils/scrollTo";
import {
  EMPTY_CONTACT_FORM,
  validateContactForm,
} from "../utils/contactFormValidation";

const SUCCESS_TOAST =
  "Your message has been sent successfully. We'll get back to you soon.";
const ERROR_TOAST = "Something went wrong. Please try again.";

const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(EMPTY_CONTACT_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const formSectionRef = useRef(null);
  const feedbackRef = useRef(null);
  const isSendingRef = useRef(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSendingRef.current || isSubmitting) {
      return;
    }

    const { valid, errors, sanitized } = validateContactForm(formData);

    if (!valid) {
      setFieldErrors(errors);
      scrollToRef(formSectionRef);
      return;
    }

    isSendingRef.current = true;
    setIsSubmitting(true);
    setFieldErrors({});

    try {
      await submitContact(sanitized);
      setFormData(EMPTY_CONTACT_FORM);
      setIsSubmitted(true);
      toast.success(SUCCESS_TOAST);
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    } catch {
      toast.error(ERROR_TOAST);
      scrollToRef(formSectionRef);
    } finally {
      setIsSubmitting(false);
      isSendingRef.current = false;
    }
  };

  useEffect(() => {
    if (isSubmitted) scrollToRef(feedbackRef);
  }, [isSubmitted]);

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      details: SITE_CONTACT.email,
      href: SITE_CONTACT.mailto,
      subtitle: "We'll respond within 24 hours",
    },
    {
      icon: Phone,
      title: "Phone",
      details: SITE_CONTACT.phone,
      href: SITE_CONTACT.tel,
      subtitle: "Mon-Fri 9AM-6PM PKT",
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: "Monday - Friday: 9:00 AM - 6:00 PM",
      subtitle: "Weekend support available",
    },
  ];

  const departments = [
    {
      name: "Sales",
      email: SITE_CONTACT.email,
      description: "Interested in our solutions? Contact our sales team.",
    },
    {
      name: "Support",
      email: SITE_CONTACT.email,
      description:
        "Need technical assistance? Our support team is here to help.",
    },
    {
      name: "Partnerships",
      email: SITE_CONTACT.email,
      description:
        "Want to partner with us? Let's explore opportunities together.",
    },
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
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-neutral-900 mb-6">
                Get in <span className="gradient-text">Touch</span>
              </h1>

              <p className="text-xl md:text-2xl text-neutral-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                Ready to transform your business? Let's discuss how our
                solutions can help you achieve your goals. We're here to help.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="p-4 sm:p-6 md:p-8 scroll-mt-24" ref={formSectionRef}>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-neutral-900 mb-6">
                  Send us a message
                </h2>

                {isSubmitted ? (
                  <div
                    ref={feedbackRef}
                    className="text-center py-8"
                    tabIndex={-1}
                    role="status"
                    aria-live="polite"
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-semibold text-neutral-900 mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-neutral-600">
                      Thank you for reaching out. We'll get back to you within
                      24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <Input
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        error={fieldErrors.name}
                        disabled={isSubmitting}
                      />
                      <Input
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        error={fieldErrors.email}
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <Input
                        label="Company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="Enter your company name"
                        disabled={isSubmitting}
                      />
                      <Input
                        label="Phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number"
                        disabled={isSubmitting}
                      />
                    </div>

                    <Input
                      label="Subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="What's this about?"
                      error={fieldErrors.subject}
                      disabled={isSubmitting}
                    />

                    <Textarea
                      label="Message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us about your project or requirements..."
                      rows={6}
                      error={fieldErrors.message}
                      disabled={isSubmitting}
                    />

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      loading={isSubmitting}
                      className="w-full group"
                      aria-busy={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                      <Send className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </form>
                )}
              </Card>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-display font-bold text-neutral-900 mb-6">
                  Contact Information
                </h2>
                <p className="text-lg text-neutral-600 mb-8">
                  We're here to help you succeed. Reach out to us through any of
                  these channels and we'll get back to you promptly.
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                          <info.icon className="w-6 h-6 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                            {info.title}
                          </h3>
                          <p className="text-neutral-900 font-medium mb-1">
                            {info.href ? (
                              <a
                                href={info.href}
                                className="hover:text-primary-600 transition-colors"
                              >
                                {info.details}
                              </a>
                            ) : (
                              info.details
                            )}
                          </p>
                          <p className="text-sm text-neutral-600">
                            {info.subtitle}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="section-padding bg-neutral-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-neutral-900 mb-6"
            >
              Get in Touch with the Right Team
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-neutral-600 max-w-3xl mx-auto"
            >
              Connect with the right department for faster, more targeted
              assistance.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {departments.map((dept, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card hover className="text-center h-full">
                  <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                    {dept.name}
                  </h3>
                  <p className="text-neutral-600 mb-4">{dept.description}</p>
                  <a
                    href={`mailto:${dept.email}`}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    {dept.email}
                  </a>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-br from-primary-600 to-navy-600">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white mb-6"
            >
              Ready to Get Started?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto"
            >
              Schedule a consultation with our experts and discover how we can
              help transform your business with our technology solutions.
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
                Schedule Consultation
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

export default Contact;


