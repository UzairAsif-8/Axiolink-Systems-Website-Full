import {
  Scale,
  FileCheck,
  Users,
} from "lucide-react";
import LegalPageLayout from "../components/legal/LegalPageLayout";
import { usePageMeta } from "../hooks/usePageMeta";
import { SITE_CONTACT } from "../data/siteContact";

const LAST_UPDATED = "June 22, 2025";

const Terms = () => {
  usePageMeta({
    title: "Terms of Service | Axiolink Systems (Pvt) Ltd.",
    description:
      "Read the Terms of Service governing your use of Axiolink Systems (Pvt) Ltd. website, enterprise solutions, internships, and Buland Parwaz training programs.",
    canonical: "https://axiolinksystems.com/legal/terms",
  });

  const sections = [
    {
      id: "acceptance",
      title: "Acceptance of Terms",
      content: (
        <>
          <p>
            These Terms of Service (&quot;Terms&quot;) govern your access to and
            use of the Axiolink Systems (Pvt) Ltd. website, products, and services
            (collectively, the &quot;Services&quot;) operated by Axiolink Systems (Pvt) Ltd.
            Pvt Ltd (&quot;Company,&quot; &quot;we,&quot; &quot;us,&quot; or
            &quot;our&quot;).
          </p>
          <p>
            By accessing or using our Services, you agree to be bound by these
            Terms and our{" "}
            <a
              href="/legal/privacy"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Privacy Policy
            </a>
            . If you do not agree, you may not use our Services.
          </p>
        </>
      ),
    },
    {
      id: "services",
      title: "Description of Services",
      content: (
        <>
          <p>Axiolink Systems (Pvt) Ltd. provides, among other offerings:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Enterprise technology solutions including software development,
              cloud infrastructure, UI/UX design, AI integration, and consulting
            </li>
            <li>
              The Buland Parwaz professional training and certification program
            </li>
            <li>Internship and career opportunities</li>
            <li>Certificate verification services</li>
            <li>Informational content via our blog and website</li>
          </ul>
          <p>
            Specific deliverables, timelines, and fees for contracted work are
            governed by separate written agreements or statements of work where
            applicable.
          </p>
        </>
      ),
    },
    {
      id: "eligibility",
      title: "Eligibility & Accounts",
      content: (
        <>
          <p>
            You must be at least 16 years old to use our Services. By using
            our Services, you represent that you meet this requirement and have
            the legal capacity to enter into these Terms.
          </p>
          <p>
            When you submit forms (contact, enrollment, internship applications),
            you agree to provide accurate, current, and complete information.
            You are responsible for maintaining the confidentiality of any
            credentials associated with your account or application and for all
            activity under them.
          </p>
        </>
      ),
    },
    {
      id: "acceptable-use",
      title: "Acceptable Use",
      content: (
        <>
          <p>You agree not to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Violate any applicable law or regulation</li>
            <li>Infringe intellectual property or privacy rights of others</li>
            <li>Upload malicious code, spam, or harmful content</li>
            <li>
              Attempt unauthorized access to our systems, admin panels, or
              other users&apos; data
            </li>
            <li>
              Scrape, crawl, or harvest data from our Services without written
              permission
            </li>
            <li>
              Misrepresent your identity or submit fraudulent applications or
              enrollments
            </li>
            <li>
              Use our Services for any unlawful, abusive, or competitive
              intelligence purpose
            </li>
          </ul>
          <p>
            We reserve the right to suspend or terminate access for violations
            of this section.
          </p>
        </>
      ),
    },
    {
      id: "intellectual-property",
      title: "Intellectual Property",
      content: (
        <>
          <p>
            All content on our website — including text, graphics, logos,
            software, and design — is owned by Axiolink Systems (Pvt) Ltd. or our licensors
            and protected by applicable intellectual property laws.
          </p>
          <p>
            You may not copy, modify, distribute, or create derivative works
            without our prior written consent. Custom deliverables created under
            a client contract are governed by the terms of that specific
            agreement.
          </p>
        </>
      ),
    },
    {
      id: "programs",
      title: "Internships & Buland Parwaz",
      content: (
        <>
          <p>
            Internship applications and Buland Parwaz enrollments are subject to
            review and approval at our discretion. Submission of an application
            does not guarantee acceptance, employment, or certification.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Certificates are issued only upon successful completion of program
              requirements as defined by Axiolink Systems (Pvt) Ltd.
            </li>
            <li>
              Uploaded documents (résumés, portfolios) must be your own and
              accurately represent your qualifications
            </li>
            <li>
              Program schedules, curricula, and fees may change with reasonable
              notice
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "payments",
      title: "Payments & Refunds",
      content: (
        <>
          <p>
            Fees for paid services, training programs, or consulting engagements
            are specified in your proposal, invoice, or enrollment confirmation.
            Payment terms must be met as agreed.
          </p>
          <p>Unless otherwise stated in a written agreement:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Refunds are evaluated on a case-by-case basis</li>
            <li>
              Custom development work, setup fees, and completed deliverables
              are generally non-refundable
            </li>
            <li>
              Late payments may result in suspension of services until accounts
              are settled
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "sla",
      title: "Service Commitments",
      content: (
        <p>
          Uptime, support response times, and service-level commitments apply
          only where explicitly defined in a signed service agreement or SLA
          document. General website availability is provided on a best-effort
          basis and may be interrupted for maintenance or circumstances beyond
          our reasonable control.
        </p>
      ),
    },
    {
      id: "disclaimers",
      title: "Disclaimers",
      content: (
        <>
          <p>
            Our Services are provided &quot;as is&quot; and &quot;as
            available&quot; without warranties of any kind, whether express or
            implied, including merchantability, fitness for a particular purpose,
            or non-infringement.
          </p>
          <p>
            We do not warrant that the Services will be uninterrupted,
            error-free, or completely secure. Information on our website is for
            general purposes and does not constitute professional advice unless
            agreed in writing.
          </p>
        </>
      ),
    },
    {
      id: "liability",
      title: "Limitation of Liability",
      content: (
        <p>
          To the maximum extent permitted by law, Axiolink Systems (Pvt) Ltd. shall not be
          liable for any indirect, incidental, special, consequential, or
          punitive damages, including lost profits, data loss, or business
          interruption, arising from your use of the Services. Our total
          liability for any claim shall not exceed the amount you paid us in the
          twelve (12) months preceding the claim, or PKR 50,000, whichever is
          greater, unless otherwise required by mandatory law.
        </p>
      ),
    },
    {
      id: "indemnification",
      title: "Indemnification",
      content: (
        <p>
          You agree to indemnify and hold harmless Axiolink Systems (Pvt) Ltd., its
          officers, employees, and partners from any claims, damages, losses, or
          expenses (including reasonable legal fees) arising from your use of
          the Services, violation of these Terms, or infringement of any third
          party rights.
        </p>
      ),
    },
    {
      id: "termination",
      title: "Termination",
      content: (
        <p>
          We may suspend or terminate your access to the Services at any time,
          with or without notice, for conduct that we believe violates these
          Terms or is harmful to other users, us, or third parties. Upon
          termination, provisions that by their nature should survive (including
          intellectual property, disclaimers, and limitation of liability) will
          remain in effect.
        </p>
      ),
    },
    {
      id: "governing-law",
      title: "Governing Law & Disputes",
      content: (
        <>
          <p>
            These Terms are governed by the laws of Pakistan, without regard to
            conflict-of-law principles. Any disputes arising from these Terms or
            the Services shall first be addressed through good-faith negotiation.
            If unresolved, disputes shall be subject to the exclusive
            jurisdiction of the courts in Lahore, Pakistan.
          </p>
        </>
      ),
    },
    {
      id: "changes",
      title: "Changes to Terms",
      content: (
        <p>
          We may modify these Terms at any time. Material changes will be posted
          on this page with an updated date. Your continued use of the Services
          after changes become effective constitutes acceptance of the revised
          Terms.
        </p>
      ),
    },
    {
      id: "contact",
      title: "Contact Information",
      content: (
        <>
          <p>For questions about these Terms, contact us:</p>
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
      title="Terms of Service"
      lastUpdated={LAST_UPDATED}
      intro="These terms outline the rules and guidelines for using Axiolink Systems (Pvt) Ltd.' website, enterprise services, training programs, and career opportunities."
      summary={[
        {
          icon: FileCheck,
          title: "Clear expectations",
          text: "Understand your rights and responsibilities when using our services.",
        },
        {
          icon: Users,
          title: "Fair agreements",
          text: "Contract terms for paid work are always defined in writing separately.",
        },
        {
          icon: Scale,
          title: "Pakistan jurisdiction",
          text: "Governed by the laws of Pakistan with disputes resolved in Lahore.",
        },
      ]}
      sections={sections}
      relatedPage={{
        href: "/legal/privacy",
        label: "Privacy Policy",
      }}
    />
  );
};

export default Terms;
