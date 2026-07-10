import { useState, useEffect, useId } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Logo from "../assets/Logo.png";
import { COMPANY_LEGAL_NAME } from "../data/company";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const mobileNavId = useId();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Blog", href: "/blog" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (href) => location.pathname === href;

  return (
    <motion.nav
      aria-label="Main navigation"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-md border-b border-neutral-200/30"
          : "bg-transparent"
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 gap-3 min-w-0">
          <Link
            to="/"
            className="shrink-0 flex items-center h-full py-3"
            aria-label={`${COMPANY_LEGAL_NAME} home`}
          >
            <img
              className="h-full w-auto max-w-[min(50vw,220px)] sm:max-w-[240px] lg:max-w-[260px] object-contain object-left"
              src={Logo}
              alt={COMPANY_LEGAL_NAME}
              width={260}
              height={64}
              decoding="async"
              fetchPriority="high"
            />
          </Link>

          <ul className="hidden lg:flex items-center flex-wrap justify-end gap-x-6 xl:gap-x-8 list-none m-0 p-0">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                    isActive(item.href)
                      ? "text-primary-600"
                      : "text-neutral-600 hover:text-primary-600"
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <Link
              to="/contact"
              className="hidden sm:inline-flex backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium bg-primary-600 text-white border border-primary-600 hover:bg-primary-700 hover:border-primary-700 whitespace-nowrap"
            >
              Get in Touch
            </Link>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-lg text-neutral-600 hover:bg-neutral-100 transition-colors"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls={mobileNavId}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav
            id={mobileNavId}
            aria-label="Mobile navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden backdrop-blur-lg border-t shadow-lg max-h-[calc(100dvh-4rem)] overflow-y-auto bg-white/95 border-neutral-200/50"
          >
            <div className="container-custom py-4 pb-6">
              <ul className="flex flex-col space-y-1 list-none m-0 p-0">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className={`block py-3 px-2 rounded-lg text-base font-medium transition-colors duration-200 ${
                        isActive(item.href)
                          ? "text-primary-600 bg-primary-50"
                          : "text-neutral-600 hover:text-primary-600 hover:bg-neutral-50"
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    to="/contact"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full justify-center mt-3 inline-flex items-center px-4 py-3 rounded-lg text-sm font-medium bg-primary-600 text-white border border-primary-600 hover:bg-primary-700"
                  >
                    Get in Touch
                  </Link>
                </li>
              </ul>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
