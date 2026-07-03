/** Site-wide contact details — import from here instead of hardcoding. */
export const SITE_EMAIL = "contact.axiolink@gmail.com";
export const SITE_PHONE = "+92 370 5834161";
export const SITE_PHONE_TEL = "+923705834161";
export const SITE_WHATSAPP_URL = "https://wa.me/923705834161";

/** CEO direct contact for appointment booking */
export const CEO_EMAIL = "uzair.asif.dev@gmail.com";
export const CEO_LINKEDIN_URL =
  "https://www.linkedin.com/in/muhammad-uzair-asif-760539369/";
export const CEO_APPOINTMENT_WHATSAPP_URL = `https://wa.me/923705834161?text=${encodeURIComponent(
  "Hi, I would like to book an appointment with Muhammad Uzair Asif."
)}`;

export const SITE_CONTACT = {
  email: SITE_EMAIL,
  phone: SITE_PHONE,
  phoneTel: SITE_PHONE_TEL,
  whatsappUrl: SITE_WHATSAPP_URL,
  mailto: `mailto:${SITE_EMAIL}`,
  tel: `tel:${SITE_PHONE_TEL}`,
};

export const CEO_CONTACT = {
  email: CEO_EMAIL,
  phone: SITE_PHONE,
  phoneTel: SITE_PHONE_TEL,
  linkedin: CEO_LINKEDIN_URL,
  whatsappUrl: CEO_APPOINTMENT_WHATSAPP_URL,
  mailto: `mailto:${CEO_EMAIL}?subject=${encodeURIComponent("Appointment Request")}`,
  tel: `tel:${SITE_PHONE_TEL}`,
};
