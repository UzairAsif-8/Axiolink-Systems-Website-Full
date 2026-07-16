import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  CheckCircle,
  XCircle,
  Calendar,
  User,
  BookOpen,
  ShieldCheck,
  Award,
  Loader2,
} from "lucide-react";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { verifyCertificate } from "../../api/certificate";
import { scrollToRef } from "../../utils/scrollTo";
import {
  CERT_CODE_PLACEHOLDER,
  displayCertificateCode,
  formatCertificateCode,
} from "../../utils/certificateCode";

const formatIssueDate = (dateStr) => {
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const CertificateVerification = ({
  initialCode = "",
  inline = false,
  onSubmitNavigate,
}) => {
  const [code, setCode] = useState(() => formatCertificateCode(initialCode));
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const resultRef = useRef(null);

  const handleVerify = useCallback(async (certificateCode) => {
    const formatted = formatCertificateCode(certificateCode);
    if (!formatted) return;

    setLoading(true);
    try {
      const res = await verifyCertificate(formatted);
      setResult(
        res.valid
          ? {
              valid: true,
              certificate: {
                ...res.certificate,
                certificateCode: displayCertificateCode(
                  res.certificate.certificateCode || formatted
                ),
              },
            }
          : { valid: false }
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialCode) {
      const formatted = formatCertificateCode(initialCode);
      setCode(formatted);
      handleVerify(formatted);
    }
  }, [initialCode, handleVerify]);

  useEffect(() => {
    if (result) scrollToRef(resultRef);
  }, [result]);

  const onSubmit = (e) => {
    e.preventDefault();
    const formatted = formatCertificateCode(code);
    if (!formatted) return;

    if (onSubmitNavigate) {
      onSubmitNavigate(formatted);
    } else {
      handleVerify(formatted);
    }
  };

  const displayName =
    result?.certificate?.studentName === "ADD_NAME_HERE"
      ? null
      : result?.certificate?.studentName;

  return (
    <div className={inline ? "max-w-xl mx-auto" : "max-w-2xl mx-auto"}>
      <Card padding="lg">
        <form onSubmit={onSubmit} className="space-y-6">
          <Input
            label="Enter Certificate Code"
            placeholder={CERT_CODE_PLACEHOLDER}
            value={code}
            onChange={(e) => setCode(formatCertificateCode(e.target.value))}
            className="font-mono tracking-wide"
            autoComplete="off"
            spellCheck={false}
            inputMode="text"
          />

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={!code.trim() || loading}
            loading={loading}
          >
            {loading ? (
              <Loader2 className="mr-2 w-5 h-5 animate-spin" />
            ) : (
              <Search className="mr-2 w-5 h-5" />
            )}
            Verify
          </Button>
        </form>
      </Card>

      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            ref={resultRef}
            key={result.valid ? "valid" : "invalid"}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="mt-8 scroll-mt-24"
            tabIndex={-1}
            role="status"
            aria-live="polite"
          >
            {result.valid ? (
              <Card
                padding="lg"
                className="border-green-200 bg-gradient-to-br from-green-50 via-white to-emerald-50/30 overflow-hidden relative"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-200/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 15,
                    delay: 0.05,
                  }}
                  className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5 relative"
                >
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </motion.div>

                <div className="text-center mb-6 relative">
                  <Badge variant="success" size="lg" className="gap-1.5 mb-4">
                    <CheckCircle className="w-4 h-4" />
                    Certificate Verified
                  </Badge>
                  <h3 className="text-xl md:text-2xl font-display font-bold text-neutral-900 mb-2">
                    {displayName
                      ? `Congratulations, ${displayName}!`
                      : "Congratulations!"}
                  </h3>
                  <p className="text-neutral-600">
                    This certificate has been successfully verified.
                  </p>
                </div>

                <div className="space-y-3 relative">
                  <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-green-100 shadow-sm">
                    <User className="w-5 h-5 text-primary-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm text-neutral-500">Student Name</p>
                      <p className="font-semibold text-neutral-900">
                        {result.certificate.studentName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-green-100 shadow-sm">
                    <BookOpen className="w-5 h-5 text-primary-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm text-neutral-500">Course</p>
                      <p className="font-semibold text-neutral-900">
                        {result.certificate.courseName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-green-100 shadow-sm">
                    <ShieldCheck className="w-5 h-5 text-primary-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm text-neutral-500">Certificate ID</p>
                      <p className="font-mono font-semibold text-neutral-900 tracking-wide">
                        {displayCertificateCode(result.certificate.certificateCode)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-green-100 shadow-sm">
                    <Calendar className="w-5 h-5 text-primary-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm text-neutral-500">Issue Date</p>
                      <p className="font-semibold text-neutral-900">
                        {formatIssueDate(result.certificate.issueDate)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-green-100 text-center relative">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary-50 mb-3">
                    <Award className="w-5 h-5 text-primary-600" />
                  </div>
                  <p className="text-sm font-medium text-neutral-500 mb-1">
                    Issued By
                  </p>
                  <p className="font-semibold text-neutral-900">
                    Buland Parwaz Program
                  </p>
                  <p className="text-neutral-600">Axiolink Systems (Pvt) Ltd.</p>
                </div>
              </Card>
            ) : (
              <Card
                padding="lg"
                className="border-red-200 bg-gradient-to-br from-red-50 to-white text-center"
              >
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
                <Badge variant="danger" size="lg" className="gap-1.5 mb-4">
                  <XCircle className="w-4 h-4" />
                  Certificate Not Found
                </Badge>
                <p className="text-neutral-600 max-w-md mx-auto leading-relaxed">
                  The certificate code entered does not match any record in our
                  system.
                </p>
                <p className="text-neutral-500 text-sm mt-3">
                  Please check the code and try again.
                </p>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CertificateVerification;
