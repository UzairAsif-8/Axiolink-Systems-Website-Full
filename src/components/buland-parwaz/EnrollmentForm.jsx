import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Send } from "lucide-react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { submitEnrollment } from "../../api/enrollment";
import { SITE_CONTACT } from "../../data/siteContact";
import { scrollToRef } from "../../utils/scrollTo";

const EnrollmentForm = ({ course }) => {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const messageRef = useRef(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await submitEnrollment({
        ...form,
        course_id: course.id,
        course_title: course.title,
      });
      setSubmitted(true);
    } catch {
      setError("Unable to submit enrollment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (submitted || error) scrollToRef(messageRef);
  }, [submitted, error]);

  if (submitted) {
    return (
      <motion.div
        ref={messageRef}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        tabIndex={-1}
        role="status"
        aria-live="polite"
      >
        <Card padding="lg" className="text-center border-green-200 bg-green-50 scroll-mt-24">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-neutral-900 mb-2">
            Enrollment Submitted
          </h3>
          <p className="text-neutral-600">
            Thank you, {form.name}! We&apos;ve received your application for{" "}
            <span className="font-medium">{course.title}</span>. Our team will
            contact you shortly.
          </p>
        </Card>
      </motion.div>
    );
  }

  return (
    <Card padding="lg" id="enroll" className="scroll-mt-24">
      <h3 className="text-2xl font-display font-bold text-neutral-900 mb-2">
        Enroll in This Course
      </h3>
      <p className="text-neutral-600 mb-6">
        Fill in your details to apply for{" "}
        <span className="font-medium text-neutral-900">{course.title}</span>.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Full Name"
          name="name"
          placeholder="Your full name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <Input
          label="Email Address"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          required
        />
        <Input
          label="Phone (optional)"
          name="phone"
          type="tel"
          placeholder={SITE_CONTACT.phone}
          value={form.phone}
          onChange={handleChange}
        />

        {error && (
          <p ref={messageRef} role="alert" className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg border border-red-100">
            {error}
          </p>
        )}

        <Button
          type="submit"
          size="lg"
          className="w-full"
          loading={loading}
          disabled={loading}
        >
          {!loading && <Send className="mr-2 w-5 h-5" />}
          Enroll in This Course
        </Button>
      </form>
    </Card>
  );
};

export default EnrollmentForm;
