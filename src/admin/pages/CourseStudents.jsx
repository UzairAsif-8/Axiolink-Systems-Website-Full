import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil, Users } from "lucide-react";
import api from "../api/client";
import { useAdminData } from "../hooks/useAdminData";
import StudentBoard from "../components/StudentBoard";
import EnrollmentDetailView from "./EnrollmentDetailView";
import StatusBadge from "../components/StatusBadge";
import Button from "../../components/ui/Button";
import {
  filterActiveStudents,
  filterNewEnrollments,
  filterGraduates,
} from "../constants/enrollments";

const enrollmentsQueryKey = (courseId) => ["admin-enrollments", "course", courseId];

const CourseStudents = () => {
  const { courseId, enrollmentId } = useParams();
  const navigate = useNavigate();
  const listPath = `/admin/courses/${courseId}/students`;

  const { data: course } = useAdminData(
    ["course", courseId],
    async () => {
      const { data: res } = await api.get(`/admin/courses/${courseId}`);
      return res.data;
    },
    { enabled: !!courseId }
  );

  const { data: enrollments, isLoading, isError } = useAdminData(
    enrollmentsQueryKey(courseId),
    async () => {
      const { data: res } = await api.get("/admin/courses/enrollments/list", {
        params: { courseId, limit: 500 },
      });
      return res.data;
    },
    { enabled: !!courseId && !enrollmentId }
  );

  if (enrollmentId) {
    return (
      <EnrollmentDetailView
        enrollmentId={enrollmentId}
        backTo={listPath}
        onDeleted={() => navigate(listPath)}
      />
    );
  }

  const list = enrollments || [];
  const active = filterActiveStudents(list).length;
  const graduates = filterGraduates(list).length;
  const pending = filterNewEnrollments(list).length;

  return (
    <div className="space-y-6">
      <Link to="/admin/courses" className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700">
        <ArrowLeft className="w-4 h-4" />Back to courses
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{course?.title || "Students"}</h1>
          <p className="text-slate-500 mt-1">
            {course?.category && `${course.category} · `}
            {list.length} enrollment{list.length !== 1 ? "s" : ""}
            {active > 0 && ` · ${active} active`}
            {graduates > 0 && ` · ${graduates} graduated`}
            {pending > 0 && ` · ${pending} pending`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {course && <StatusBadge status={course.status} />}
          <Link to={`/admin/courses/${courseId}`}>
            <Button variant="secondary" size="sm"><Pencil className="w-4 h-4 mr-1" />Edit course</Button>
          </Link>
        </div>
      </div>

      {isError && <p className="text-sm text-red-600">Could not load students.</p>}

      {isLoading ? (
        <p className="text-slate-400 py-12 text-center">Loading...</p>
      ) : list.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200/80">
          <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No students enrolled in this course yet.</p>
        </div>
      ) : (
        <StudentBoard enrollments={list} courseId={courseId} />
      )}
    </div>
  );
};

export default CourseStudents;
