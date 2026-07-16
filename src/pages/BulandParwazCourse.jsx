import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  BookOpen,
  CheckCircle,
  Target,
  GraduationCap,
  ListChecks,
} from "lucide-react";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import EnrollmentForm from "../components/buland-parwaz/EnrollmentForm";
import { scrollToId } from "../utils/scrollTo";
import {
  getCourseById,
  statusLabels,
  statusBadgeVariant,
  isEnrollmentOpen,
} from "../data/bulandParwazCourses";
import { fetchPublicCourseBySlug } from "../api/public";
import { getCourseDisplayImage } from "../utils/courseImages";
import { usePageMeta } from "../hooks/usePageMeta";
import { PAGE_META, courseMeta } from "../seo/pageMeta";

const mapApiCourseDetail = (c) => ({
  id: c.slug || c.id,
  title: c.title,
  image: getCourseDisplayImage(c),
  thumbnailUrl: c.thumbnailUrl,
  bannerUrl: c.bannerUrl,
  category: c.category,
  shortDescription: typeof c.description === "string" ? c.description.slice(0, 220) : "",
  fullDescription: c.description,
  status: c.isCompleted ? "completed" : c.enrollmentOpen !== false ? "live" : "closed",
  duration: c.duration,
  level: c.level,
  outcomes: c.learningOutcomes || [],
  modules: Array.isArray(c.curriculum) ? c.curriculum : [],
  prerequisites: c.requirements || [],
});

const BulandParwazCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  usePageMeta(
    course && courseId
      ? courseMeta(course, courseId)
      : { title: "Course | Buland Parwaz Program" }
  );

  useEffect(() => {
    let cancelled = false;
    fetchPublicCourseBySlug(courseId)
      .then((data) => {
        if (!cancelled) setCourse(mapApiCourseDetail(data));
      })
      .catch(() => {
        if (!cancelled) setCourse(getCourseById(courseId) || null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [courseId]);

  const isOpen = course ? isEnrollmentOpen(course.status) : false;

  useEffect(() => {
    if (window.location.hash === "#enroll") {
      const el = document.getElementById("enroll");
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 100);
      }
    }
  }, [courseId]);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 section-padding text-center text-neutral-500">
        Loading course...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen pt-20 section-padding">
        <div className="container-custom text-center">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">
            Course Not Found
          </h1>
          <p className="text-neutral-600 mb-8">
            The course you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button onClick={() => navigate("/buland-parwaz")}>
            Back to Program
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <section className="section-padding bg-gradient-to-br from-primary-50 to-navy-50">
        <div className="container-custom">
          <Link
            to="/buland-parwaz"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Buland Parwaz
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl"
          >
            <div className="rounded-2xl overflow-hidden shadow-lg mb-8 max-h-72">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-72 object-cover"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge variant={statusBadgeVariant[course.status]}>
                {statusLabels[course.status]}
              </Badge>
              {course.isLatest && <Badge variant="primary">Latest</Badge>}
              <div className="flex items-center gap-1 text-neutral-600 text-sm">
                <Clock className="w-4 h-4" />
                {course.duration}
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-neutral-900 mb-6 break-anywhere">
              {course.title}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-neutral-600 leading-relaxed">
              {course.fullDescription}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto">
            <div className="lg:col-span-2 space-y-8">
              {/* Curriculum */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <Card padding="lg">
                  <div className="flex items-center gap-2 mb-6">
                    <BookOpen className="w-5 h-5 text-primary-600" />
                    <h2 className="text-2xl font-display font-bold text-neutral-900">
                      Curriculum & Data Covered
                    </h2>
                  </div>
                  <div className="space-y-6">
                    {course.modules.map((module, index) => (
                      <div
                        key={module.title}
                        className="p-5 bg-neutral-50 rounded-xl border border-neutral-100"
                      >
                        <div className="flex items-start gap-3 mb-4">
                          <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center text-sm font-semibold shrink-0">
                            {index + 1}
                          </span>
                          <h3 className="text-lg font-semibold text-neutral-900 pt-0.5">
                            {module.title}
                          </h3>
                        </div>
                        <ul className="ml-11 space-y-2">
                          {module.topics.map((topic) => (
                            <li
                              key={topic}
                              className="flex items-start gap-2 text-neutral-700 text-sm leading-relaxed"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-2 shrink-0" />
                              {topic}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>

              {/* Learning Outcomes */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card padding="lg">
                  <div className="flex items-center gap-2 mb-6">
                    <Target className="w-5 h-5 text-primary-600" />
                    <h2 className="text-2xl font-display font-bold text-neutral-900">
                      What You&apos;ll Learn
                    </h2>
                  </div>
                  <ul className="grid sm:grid-cols-2 gap-3">
                    {course.outcomes.map((outcome) => (
                      <li
                        key={outcome}
                        className="flex items-start gap-2 p-3 bg-primary-50/50 rounded-lg"
                      >
                        <CheckCircle className="w-4 h-4 text-primary-600 mt-0.5 shrink-0" />
                        <span className="text-sm text-neutral-700">{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>

              {/* Prerequisites */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <Card padding="lg">
                  <div className="flex items-center gap-2 mb-6">
                    <ListChecks className="w-5 h-5 text-primary-600" />
                    <h2 className="text-2xl font-display font-bold text-neutral-900">
                      Prerequisites
                    </h2>
                  </div>
                  <ul className="space-y-3">
                    {course.prerequisites.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-neutral-700"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-2.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            </div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              <Card padding="lg" className="sticky top-24">
                <div className="flex items-center gap-2 mb-4">
                  <GraduationCap className="w-5 h-5 text-primary-600" />
                  <h3 className="text-lg font-semibold text-neutral-900">
                    Course Details
                  </h3>
                </div>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm text-neutral-500">Duration</dt>
                    <dd className="font-medium text-neutral-900">
                      {course.duration}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-neutral-500">Level</dt>
                    <dd className="font-medium text-neutral-900">
                      {course.level}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-neutral-500">Format</dt>
                    <dd className="font-medium text-neutral-900">
                      {course.format}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-neutral-500">Schedule</dt>
                    <dd className="font-medium text-neutral-900">
                      {course.schedule}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-neutral-500">Status</dt>
                    <dd>
                      <Badge variant={statusBadgeVariant[course.status]}>
                        {statusLabels[course.status]}
                      </Badge>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-neutral-500">Modules</dt>
                    <dd className="font-medium text-neutral-900">
                      {course.modules.length} modules
                    </dd>
                  </div>
                </dl>

                {isOpen ? (
                  <Button
                    className="w-full mt-6"
                    onClick={() => scrollToId("enroll")}
                  >
                    Enroll in This Course
                  </Button>
                ) : (
                  <div className="mt-6 p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                    <p className="flex items-center gap-2 text-neutral-600 text-sm font-medium">
                      <CheckCircle className="w-4 h-4 shrink-0" />
                      Enrollment is currently closed
                    </p>
                    <p className="text-xs text-neutral-500 mt-2">
                      Check back later or contact us to be notified when this
                      course reopens.
                    </p>
                  </div>
                )}
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {isOpen && (
        <section className="section-padding bg-neutral-50">
          <div className="container-custom max-w-xl mx-auto">
            <EnrollmentForm course={course} />
          </div>
        </section>
      )}
    </div>
  );
};

export default BulandParwazCourse;
