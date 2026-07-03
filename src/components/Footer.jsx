import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Phone, Linkedin, Twitter, Github } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import Logo from "../assets/logoTransparent.png";
import { SITE_CONTACT, CEO_LINKEDIN_URL } from "../data/siteContact";
import { COMPANY_LEGAL_NAME } from "../data/company";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    services: [
      { name: "Mobile Development", href: "/services/mobile-development" },
      { name: "Web Development", href: "/services/web-development" },
      { name: "UI/UX Design", href: "/services/ui-ux-design" },
      { name: "All Services", href: "/services" },
    ],
    company: [
      { name: "About Us", href: "/about" },
      { name: "Buland Parwaz Program", href: "/buland-parwaz" },
      { name: "Verify Certificate", href: "/verify-certificate" },
      { name: "Careers", href: "/careers" },
      { name: "Blog", href: "/blog" },
      { name: "Contact", href: "/contact" },
    ],
    resources: [
      { name: "Support", href: "/contact" },
      { name: "Privacy Policy", href: "/legal/privacy" },
      { name: "Terms of Service", href: "/legal/terms" },
    ],
  };

  const socialLinks = [
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: CEO_LINKEDIN_URL,
    },
    {
      name: "Twitter",
      icon: Twitter,
      href: "https://twitter.com/axiolinksystems",
    },
    {
      name: "GitHub",
      icon: Github,
      href: "https://github.com/axiolink-systems",
    },
  ];

  return (
    <footer className="bg-neutral-900 text-white">
      {/* Main Footer */}
      <div className="container-custom py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 text-center sm:text-left">
          {/* Company Info */}
          <div className="sm:col-span-2 flex flex-col items-center sm:items-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="w-full flex flex-col items-center sm:items-start"
            >
              <div className="mb-6">
                <Link to="/" className="inline-flex items-center justify-center sm:justify-start">
                  <img
                    className="h-40 sm:h-44 md:h-48 lg:h-52 w-auto max-w-[min(100%,480px)] object-contain object-center sm:object-left mx-auto sm:mx-0"
                    src={Logo}
                    alt={COMPANY_LEGAL_NAME}
                  />
                </Link>
              </div>

              <p className="text-neutral-300 mb-6 max-w-md mx-auto sm:mx-0">
                Transforming enterprises through innovative technology
                solutions. We help businesses scale, secure, and optimize their
                digital infrastructure.
              </p>

              <div className="space-y-3 w-full max-w-md mx-auto sm:mx-0">
                <a
                  href={SITE_CONTACT.mailto}
                  className="flex items-center justify-center sm:justify-start gap-3 text-neutral-300 hover:text-white transition-colors duration-200"
                >
                  <Mail className="w-4 h-4 shrink-0" />
                  <span className="break-all">{SITE_CONTACT.email}</span>
                </a>
                <a
                  href={SITE_CONTACT.tel}
                  className="flex items-center justify-center sm:justify-start gap-3 text-neutral-300 hover:text-white transition-colors duration-200"
                >
                  <Phone className="w-4 h-4 shrink-0" />
                  <span>{SITE_CONTACT.phone}</span>
                </a>
                <a
                  href={SITE_CONTACT.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center sm:justify-start gap-3 text-neutral-300 hover:text-green-400 transition-colors duration-200 text-sm"
                >
                  <FaWhatsapp className="w-4 h-4 shrink-0" />
                  <span>WhatsApp Community</span>
                </a>
              </div>
            </motion.div>
          </div>

          {/* Links */}
          <div className="flex flex-col items-center sm:items-start">
            <motion.h4
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-lg sm:text-xl font-semibold mb-3 text-white"
            >
              Services
            </motion.h4>
            <motion.ul
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-2"
            >
              {footerLinks.services.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="text-sm text-neutral-300 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </motion.ul>
          </div>

          <div className="flex flex-col items-center sm:items-start">
            <motion.h4
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-lg sm:text-xl font-semibold mb-3 text-white"
            >
              Company
            </motion.h4>
            <motion.ul
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-2"
            >
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="text-sm text-neutral-300 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </motion.ul>
          </div>

          <div className="flex flex-col items-center sm:items-start">
            <motion.h4
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-lg sm:text-xl font-semibold mb-3 text-white"
            >
              Resources
            </motion.h4>
            <motion.ul
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-2"
            >
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="text-sm text-neutral-300 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </motion.ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-800">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-4 text-center md:text-left">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-neutral-400 text-sm max-w-prose"
            >
              © {currentYear} {COMPANY_LEGAL_NAME} All rights reserved.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center justify-center gap-6"
            >
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-white transition-colors duration-200"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
