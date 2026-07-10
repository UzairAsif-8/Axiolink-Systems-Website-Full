import {
  Eye,
  Lock,
  Users,
} from "lucide-react";
import LegalPageLayout from "../components/legal/LegalPageLayout";
import { usePageMeta } from "../hooks/usePageMeta";
import { PAGE_META } from "../seo/pageMeta";
import { SITE_CONTACT } from "../data/siteContact";

const LAST_UPDATED = "June 22, 2025";

const Privacy = () => {
  usePageMeta(PAGE_META.privacy);

  const sections = [
    {
      id: "overview",
      title: "Overview",
      content: (
        <>
          <p>
            Axiolink Systems (Pvt) Ltd. (&quot;we,&quot; &quot;us,&quot; or
            &quot;our&quot;) respects your privacy. This Privacy Policy
            explains how we handle personal information when you visit our
            website, use our enterprise services, apply for internships,
            enroll in the Buland Parwaz training program, subscribe to our
            newsletter, or contact us.
          </p>
          <p>
            By using our website or services, you agree to the practices
            described in this policy. If you do not agree, please discontinue
            use of our services.
          </p>
        </>
      ),
    },
    {
      id: "information-we-collect",
      title: "Information We Collect",
      content: (
        <>
          <p>We collect information in the following ways:</p>
          <h3 className="text-base font-semibold text-neutral-900 pt-2">
            Information you provide directly
          </h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Contact details (name, email, phone number, company) submitted
              through our contact form
            </li>
            <li>
              Internship application data including résumé/CV uploads, skills,
              education, and cover letters
            </li>
            <li>
              Buland Parwaz enrollment and certificate verification requests
            </li>
            <li>Newsletter subscription email addresses</li>
            <li>
              Any other information you choose to share when communicating with
              us
            </li>
          </ul>
          <h3 className="text-base font-semibold text-neutral-900 pt-2">
            Information collected automatically
          </h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Device type, browser, and operating system</li>
            <li>IP address and approximate location (country/region level)</li>
            <li>Pages visited, time spent, and referral sources</li>
            <li>Cookies and similar technologies (see Cookies section)</li>
          </ul>
        </>
      ),
    },
    {
      id: "how-we-use",
      title: "How We Use Your Information",
      content: (
        <>
          <p>We use collected information to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Respond to inquiries and provide customer support</li>
            <li>Process internship applications and training enrollments</li>
            <li>Issue and verify Buland Parwaz certificates</li>
            <li>Deliver contracted enterprise software and consulting services</li>
            <li>Send service updates, newsletters, and marketing (with consent)</li>
            <li>Improve our website, products, and user experience</li>
            <li>Detect fraud, abuse, and security incidents</li>
            <li>Comply with applicable legal and regulatory obligations</li>
          </ul>
        </>
      ),
    },
    {
      id: "legal-basis",
      title: "Legal Basis for Processing",
      content: (
        <>
          <p>Depending on your interaction with us, we process data based on:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-neutral-800">Consent</strong> — e.g.
              newsletter signup or optional marketing communications
            </li>
            <li>
              <strong className="text-neutral-800">Contract</strong> — to
              perform services you have requested or enrolled in
            </li>
            <li>
              <strong className="text-neutral-800">Legitimate interests</strong>{" "}
              — to operate and improve our business, provided your rights are
              not overridden
            </li>
            <li>
              <strong className="text-neutral-800">Legal obligation</strong> —
              where required by applicable law
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "sharing",
      title: "How We Share Information",
      content: (
        <>
          <p>
            We do not sell your personal information. We may share data only in
            these circumstances:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-neutral-800">Service providers</strong> —
              trusted vendors who assist with hosting, email delivery, file
              storage (e.g. Cloudinary for document uploads), analytics, and
              payment processing, bound by confidentiality agreements
            </li>
            <li>
              <strong className="text-neutral-800">Legal requirements</strong> —
              when required by law, court order, or government request
            </li>
            <li>
              <strong className="text-neutral-800">Business transfers</strong> —
              in connection with a merger, acquisition, or asset sale, with
              notice where required
            </li>
            <li>
              <strong className="text-neutral-800">With your consent</strong> —
              for any other purpose you explicitly authorize
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "retention",
      title: "Data Retention",
      content: (
        <>
          <p>
            We retain personal information only as long as necessary for the
            purposes described in this policy, unless a longer period is required
            by law. Application records, enrollment data, and contact messages
            are kept for the duration of our relationship and a reasonable period
            afterward for legal, audit, and dispute-resolution purposes.
          </p>
          <p>
            You may request deletion of your data subject to legal retention
            requirements — see Your Rights below.
          </p>
        </>
      ),
    },
    {
      id: "security",
      title: "Data Security",
      content: (
        <>
          <p>
            We implement administrative, technical, and organizational measures
            to protect your information, including encrypted connections (HTTPS),
            access controls, secure authentication for admin systems, and
            regular review of our security practices.
          </p>
          <p>
            No method of transmission or storage is 100% secure. While we strive
            to protect your data, we cannot guarantee absolute security.
          </p>
        </>
      ),
    },
    {
      id: "your-rights",
      title: "Your Rights",
      content: (
        <>
          <p>Depending on applicable law, you may have the right to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Access the personal information we hold about you</li>
            <li>Request correction of inaccurate or incomplete data</li>
            <li>Request deletion of your personal information</li>
            <li>Object to or restrict certain processing activities</li>
            <li>Withdraw consent where processing is consent-based</li>
            <li>Request a portable copy of your data</li>
          </ul>
          <p>
            To exercise these rights, contact us at{" "}
            <a
              href={SITE_CONTACT.mailto}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              {SITE_CONTACT.email}
            </a>
            . We will respond within a reasonable timeframe.
          </p>
        </>
      ),
    },
    {
      id: "cookies",
      title: "Cookies & Tracking",
      content: (
        <>
          <p>
            We use cookies and similar technologies to remember preferences,
            analyze traffic, and improve site performance. You can control
            cookies through your browser settings. Disabling cookies may affect
            certain site functionality.
          </p>
          <p>
            We may use analytics tools to understand aggregate usage patterns.
            These tools may collect anonymized or pseudonymized data.
          </p>
        </>
      ),
    },
    {
      id: "third-party",
      title: "Third-Party Links",
      content: (
        <p>
          Our website may link to external sites (social media, partner tools,
          etc.). We are not responsible for the privacy practices of those
          third parties. We encourage you to review their policies before
          providing personal information.
        </p>
      ),
    },
    {
      id: "children",
      title: "Children's Privacy",
      content: (
        <p>
          Our services are not directed at individuals under 16 years of age. We
          do not knowingly collect personal information from children. If you
          believe a child has provided us data, please contact us and we will
          promptly delete it.
        </p>
      ),
    },
    {
      id: "changes",
      title: "Changes to This Policy",
      content: (
        <p>
          We may update this Privacy Policy from time to time. Material changes
          will be posted on this page with an updated &quot;Last updated&quot;
          date. Continued use of our services after changes constitutes
          acceptance of the revised policy.
        </p>
      ),
    },
    {
      id: "contact",
      title: "Contact Us",
      content: (
        <>
          <p>
            For privacy-related questions, requests, or complaints, contact:
          </p>
          <ul className="list-none space-y-2 pt-2">
            <li>
              <strong className="text-neutral-800">Axiolink Systems (Pvt) Ltd.</strong>
            </li>
            <li>Lahore, Pakistan</li>
            <li>
              Email:{" "}
              <a
                href={SITE_CONTACT.mailto}
                className="text-primary-600 hover:text-primary-700"
              >
                {SITE_CONTACT.email}
              </a>
            </li>
            <li>
              Phone:{" "}
              <a
                href={SITE_CONTACT.tel}
                className="text-primary-600 hover:text-primary-700"
              >
                {SITE_CONTACT.phone}
              </a>
            </li>
          </ul>
        </>
      ),
    },
  ];

  return (
    <LegalPageLayout
      title="Privacy Policy"
      lastUpdated={LAST_UPDATED}
      intro="We are committed to protecting your personal information and being transparent about how we collect, use, and safeguard it across our website and services."
      summary={[
        {
          icon: Eye,
          title: "Transparency",
          text: "We clearly explain what data we collect and why — no hidden practices.",
        },
        {
          icon: Lock,
          title: "Security first",
          text: "Industry-standard safeguards protect your information at rest and in transit.",
        },
        {
          icon: Users,
          title: "Your control",
          text: "Request access, correction, or deletion of your personal data anytime.",
        },
      ]}
      sections={sections}
      relatedPage={{
        href: "/legal/terms",
        label: "Terms of Service",
      }}
    />
  );
};

export default Privacy;
