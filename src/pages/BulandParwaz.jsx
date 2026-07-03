import { motion } from "framer-motion";
import { ArrowRight, GraduationCap, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import Button from "../components/ui/Button";
import CourseCard from "../components/buland-parwaz/CourseCard";
import BulandParwazHero from "../components/buland-parwaz/BulandParwazHero";
import BulandParwazPillars from "../components/buland-parwaz/BulandParwazPillars";
import { fetchPublicCourses } from "../api/public";
import { getCourseDisplayImage } from "../utils/courseImages";
import { usePageMeta } from "../hooks/usePageMeta";

const mapApiCourse = (c) => ({
  id: c.slug || c.id,
  title: c.title,
  image: getCourseDisplayImage(c),
  thumbnailUrl: c.thumbnailUrl,
  bannerUrl: c.bannerUrl,
  category: c.category,
  shortDescription: typeof c.description === "string" ? c.description.slice(0, 220) : "",
  fullDescription: c.description,
  status: c.enrollmentOpen !== false ? "live" : "closed",
  duration: c.duration,
  level: c.level,
});

const BulandParwaz = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  usePageMeta({
    title: "Buland Parwaz Program | Axiolink Systems (Pvt) Ltd.",
    description:
      "Professional training bootcamps, courses, and mentorship through the Buland Parwaz Program by Axiolink Systems.",
    canonical: "https://axiolinksystems.com/buland-parwaz",
  });

  useEffect(() => {
    fetchPublicCourses()
      .then((data) => setCourses((Array.isArray(data) ? data : []).map(mapApiCourse)))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);

  const scrollToCourses = useCallback(() => {
    document.getElementById("courses")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <BulandParwazHero
        onExploreCourses={scrollToCourses}
        onVerifyCertificate={() => navigate("/verify-certificate")}
      />

      <BulandParwazPillars />

      <section id="courses" className="section-padding bg-white scroll-mt-24">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-14">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-widest text-primary-600 mb-3">
                  Programs
                </p>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">
                  Available Courses
                </h2>
                <p className="text-lg text-neutral-600 leading-relaxed">
                  Browse our current offerings and enroll in programs aligned with
                  your career goals.
                </p>
              </div>
              {!loading && courses.length > 0 && (
                <p className="text-sm font-medium text-neutral-500 shrink-0">
                  {courses.length} program{courses.length !== 1 ? "s" : ""} available
                </p>
              )}
            </div>

            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-[420px] rounded-xl bg-neutral-100 animate-pulse border border-neutral-200/60"
                  />
                ))}
              </div>
            ) : courses.length === 0 ? (
              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-12 md:p-16 text-center max-w-2xl mx-auto">
                <div className="w-14 h-14 rounded-full bg-neutral-200/80 flex items-center justify-center mx-auto mb-5">
                  <GraduationCap className="w-7 h-7 text-neutral-400" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                  Programs coming soon
                </h3>
                <p className="text-neutral-600">
                  New courses and bootcamps will be announced here. Check back
                  shortly or contact us for upcoming schedules.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course, index) => (
                  <CourseCard key={course.id} course={course} index={index} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section-padding bg-gradient-to-br from-primary-600 via-primary-700 to-navy-700">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="w-14 h-14 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Certificate Verification
            </h2>
            <p className="text-lg text-primary-100 mb-8 leading-relaxed">
              Graduates and employers can instantly verify Buland Parwaz
              credentials using the unique code on the certificate.
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/verify-certificate")}
              className="group !bg-white !text-primary-700 hover:!bg-primary-50 border-0 shadow-xl"
            >
              Verify a Certificate
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default BulandParwaz;
