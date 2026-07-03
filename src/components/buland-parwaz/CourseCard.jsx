import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import {
  statusLabels,
  statusBadgeVariant,
  isEnrollmentOpen,
} from "../../data/bulandParwazCourses";
import { getCourseDisplayImage } from "../../utils/courseImages";

const CourseCard = ({ course, index = 0 }) => {
  const navigate = useNavigate();
  const isOpen = isEnrollmentOpen(course.status);
  const imageSrc = getCourseDisplayImage(course);

  const handleAction = () => {
    navigate(
      isOpen
        ? `/buland-parwaz/course/${course.id}#enroll`
        : `/buland-parwaz/course/${course.id}`
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      className="group h-full"
    >
      <Card
        hover
        className="h-full flex flex-col overflow-hidden p-0 border border-neutral-200/80 shadow-sm"
      >
        <div className="relative h-48 overflow-hidden bg-neutral-100">
          <img
            src={imageSrc}
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />
          {course.category && (
            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-xs font-semibold bg-white text-neutral-800 shadow-sm">
              {course.category}
            </span>
          )}
        </div>

        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center justify-between gap-3 mb-3">
            <Badge variant={statusBadgeVariant[course.status]} size="sm">
              {statusLabels[course.status]}
            </Badge>
            {course.duration && (
              <div className="flex items-center gap-1 text-xs text-neutral-500 shrink-0">
                <Clock className="w-3.5 h-3.5" />
                {course.duration}
              </div>
            )}
          </div>

          <h3 className="text-lg font-semibold text-neutral-900 mb-2 leading-snug group-hover:text-primary-700 transition-colors">
            {course.title}
          </h3>
          <p className="text-sm text-neutral-600 mb-5 leading-relaxed flex-1 line-clamp-3">
            {course.shortDescription}
          </p>

          <Button
            variant={isOpen ? "primary" : "outline"}
            size="sm"
            className="w-full group/btn mt-auto"
            onClick={handleAction}
          >
            {isOpen ? "Enroll Now" : "View Details"}
            <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default CourseCard;
