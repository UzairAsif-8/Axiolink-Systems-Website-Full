import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Linkedin, Mail, MessageCircle, Quote } from "lucide-react";
import Badge from "./ui/Badge";
import Button from "./ui/Button";
import ceoImage from "../assets/CEO-Profile.png";
import { CEO_CONTACT } from "../data/siteContact";
import { COMPANY_LEGAL_NAME } from "../data/company";

const CEOSection = ({ className = "" }) => {
  const [showAppointmentOptions, setShowAppointmentOptions] = useState(false);
  const [menuStyle, setMenuStyle] = useState(null);
  const appointmentRef = useRef(null);
  const menuRef = useRef(null);

  const updateMenuPosition = useCallback(() => {
    if (!appointmentRef.current) return;

    const rect = appointmentRef.current.getBoundingClientRect();
    const menuWidth = Math.max(rect.width, 288);
    let left = rect.left;

    if (left + menuWidth > window.innerWidth - 16) {
      left = window.innerWidth - menuWidth - 16;
    }

    setMenuStyle({
      top: rect.bottom + 8,
      left: Math.max(16, left),
      width: menuWidth,
    });
  }, []);

  useLayoutEffect(() => {
    if (!showAppointmentOptions) {
      setMenuStyle(null);
      return;
    }

    updateMenuPosition();
    window.addEventListener("resize", updateMenuPosition);
    window.addEventListener("scroll", updateMenuPosition, true);

    return () => {
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("scroll", updateMenuPosition, true);
    };
  }, [showAppointmentOptions, updateMenuPosition]);

  const ceoData = {
    name: "Muhammad Uzair Asif",
    role: "CEO & Founder",
    bio: `Leading ${COMPANY_LEGAL_NAME}' mission to deliver scalable enterprise solutions and professional training through Buland Parwaz.`,
    linkedin: CEO_CONTACT.linkedin,
    quote:
      "Technology should empower businesses to achieve their full potential — meeting today's challenges and anticipating tomorrow's opportunities.",
  };

  useEffect(() => {
    if (!showAppointmentOptions) return;

    const handleClickOutside = (event) => {
      if (
        appointmentRef.current?.contains(event.target) ||
        menuRef.current?.contains(event.target)
      ) {
        return;
      }
      setShowAppointmentOptions(false);
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") setShowAppointmentOptions(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showAppointmentOptions]);

  const appointmentMenu =
    showAppointmentOptions &&
    menuStyle &&
    createPortal(
      <AnimatePresence>
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          transition={{ duration: 0.15 }}
          style={{
            position: "fixed",
            top: menuStyle.top,
            left: menuStyle.left,
            width: menuStyle.width,
            zIndex: 9999,
          }}
          className="rounded-xl border border-white/10 bg-neutral-900 shadow-2xl p-2"
          role="menu"
        >
          <p className="px-3 py-2 text-xs font-medium text-neutral-400 uppercase tracking-wide">
            Choose how to reach out
          </p>

          <a
            href={CEO_CONTACT.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            role="menuitem"
            onClick={() => setShowAppointmentOptions(false)}
            className="flex items-start gap-3 rounded-lg px-3 py-3 text-left hover:bg-white/5 transition-colors group"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-600/20 text-green-400 group-hover:bg-green-600/30">
              <MessageCircle className="w-4 h-4" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-white">
                WhatsApp
              </span>
              <span className="block text-xs text-neutral-400 mt-0.5 break-anywhere">
                {CEO_CONTACT.phone}
              </span>
            </span>
          </a>

          <a
            href={CEO_CONTACT.mailto}
            role="menuitem"
            onClick={() => setShowAppointmentOptions(false)}
            className="flex items-start gap-3 rounded-lg px-3 py-3 text-left hover:bg-white/5 transition-colors group"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-600/20 text-primary-300 group-hover:bg-primary-600/30">
              <Mail className="w-4 h-4" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-white">
                Email
              </span>
              <span className="block text-xs text-neutral-400 mt-0.5 break-anywhere">
                {CEO_CONTACT.email}
              </span>
            </span>
          </a>
        </motion.div>
      </AnimatePresence>,
      document.body
    );

  return (
    <section
      className={`py-10 md:py-12 bg-neutral-950 relative overflow-x-hidden ${className}`}
    >
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-60" />

      <div className="container-custom relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm"
          >
            <div className="flex flex-col sm:flex-row sm:items-stretch">
              {/* Portrait — full height of card */}
              <div className="relative shrink-0 w-full sm:w-52 md:w-56 h-56 sm:h-auto sm:self-stretch overflow-hidden bg-black sm:rounded-l-2xl rounded-t-2xl sm:rounded-tr-none">
                <img
                  src={ceoImage}
                  alt={ceoData.name}
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover object-[center_18%] contrast-[1.06] brightness-[1.04]"
                />
              </div>

              {/* Content */}
              <div className="flex-1 p-6 md:p-8 flex flex-col justify-center min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <Badge
                    variant="primary"
                    size="md"
                    className="bg-primary-600/20 text-primary-300 border-primary-500/30"
                  >
                    Meet Our CEO
                  </Badge>
                </div>

                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5 md:gap-8">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-2xl md:text-3xl font-display font-bold text-white leading-tight">
                      {ceoData.name}
                    </h2>
                    <p className="text-primary-400 text-base font-medium mt-1 mb-2">
                      {ceoData.role}
                    </p>
                    <p className="text-neutral-400 text-sm md:text-base leading-relaxed">
                      {ceoData.bio}
                    </p>
                  </div>

                  <div className="shrink-0 md:max-w-sm lg:max-w-md">
                    <div className="flex gap-2.5 items-start">
                      <Quote className="w-5 h-5 text-primary-400/70 shrink-0 mt-0.5" />
                      <p className="text-neutral-300 text-sm md:text-base italic leading-relaxed line-clamp-4">
                        &ldquo;{ceoData.quote}&rdquo;
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-neutral-500 text-sm hidden sm:block">
                    Leading the vision behind {COMPANY_LEGAL_NAME}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto sm:ml-auto">
                    <div className="relative w-full sm:w-auto" ref={appointmentRef}>
                      <Button
                        variant="primary"
                        size="md"
                        className="w-full sm:w-auto group"
                        onClick={() =>
                          setShowAppointmentOptions((open) => !open)
                        }
                        aria-expanded={showAppointmentOptions}
                        aria-haspopup="true"
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Book an appointment
                      </Button>
                    </div>

                    <Button
                      variant="secondary"
                      size="md"
                      className="w-full sm:w-auto group bg-white text-neutral-900 hover:bg-neutral-100 border-0"
                      onClick={() => window.open(ceoData.linkedin, "_blank")}
                    >
                      <Linkedin className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                      Connect on LinkedIn
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      {appointmentMenu}
    </section>
  );
};

export default CEOSection;
