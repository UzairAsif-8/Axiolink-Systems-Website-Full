import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowLeft, Award } from "lucide-react";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import CertificateVerification from "../components/buland-parwaz/CertificateVerification";
import BulandParwazLogo from "../assets/BulandParwazLogo.png";
import { usePageMeta } from "../hooks/usePageMeta";
import { PAGE_META } from "../seo/pageMeta";
import { siteUrl } from "../seo/siteConfig";

const VerifyCertificate = () => {
  const { code: urlCode } = useParams();
  const navigate = useNavigate();

  usePageMeta({
    ...PAGE_META.verifyCertificate,
    canonical: urlCode
      ? siteUrl(`/verify-certificate/${encodeURIComponent(urlCode)}`)
      : PAGE_META.verifyCertificate.canonical,
    noindex: Boolean(urlCode),
  });

  const handleVerifyWithNavigation = (certificateCode) => {
    navigate(
      `/verify-certificate/${encodeURIComponent(certificateCode.trim())}`
    );
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="section-padding bg-gradient-to-br from-primary-50 via-white to-navy-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%233B82F6%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-80" />

        <div className="container-custom relative z-10">
          <Link
            to="/buland-parwaz"
            className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-primary-600 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Buland Parwaz Program
          </Link>

          <div className="max-w-3xl mx-auto text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="w-52 sm:w-48 md:w-52 mx-auto mb-6">
                <img
                  src={BulandParwazLogo}
                  alt="Buland Parwaz Program"
                  className="w-full h-auto object-contain"
                />
              </div>

              <Badge variant="primary" size="lg" className="mb-6 gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                Official Verification Portal
              </Badge>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-neutral-900 mb-6">
                Certificate Verification
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-neutral-600 leading-relaxed max-w-2xl mx-auto">
                Confirm the authenticity of a Buland Parwaz credential. Enter
                the certificate code from your certificate to view verified
                details.
              </p>
            </motion.div>
          </div>

          <CertificateVerification
            initialCode={urlCode || ""}
            onSubmitNavigate={handleVerifyWithNavigation}
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center text-sm text-neutral-500 mt-8 max-w-xl mx-auto"
          >
            Direct verification links are supported, e.g.{" "}
            <span className="font-mono text-primary-600">
              /verify-certificate/BP-FEDB-2026-001
            </span>
          </motion.p>
        </div>
      </section>

      {/* Trust info */}
      <section className="py-12 bg-white border-t border-neutral-100">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto grid sm:grid-cols-3 gap-6 text-center">
            {[
              {
                title: "Official Records",
                text: "Matched against Buland Parwaz program certificates issued by Axiolink Systems (Pvt) Ltd.",
              },
              {
                title: "Secure Lookup",
                text: "Verification is performed instantly against our published certificate registry.",
              },
              {
                title: "Need Help?",
                text: "Contact us if your code is not found or details appear incorrect.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-5 rounded-xl bg-neutral-50 border border-neutral-100"
              >
                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center mx-auto mb-3">
                  <Award className="w-5 h-5 text-primary-600" />
                </div>
                <h3 className="font-semibold text-neutral-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button variant="secondary" onClick={() => navigate("/contact")}>
              Contact Support
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VerifyCertificate;
