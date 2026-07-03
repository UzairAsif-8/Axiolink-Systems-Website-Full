import { Link, useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api/client";
import { useAdminData } from "../hooks/useAdminData";
import PageHeader from "../components/PageHeader";
import StudentBoard from "../components/StudentBoard";
import EnrollmentDetailView from "./EnrollmentDetailView";
import EmptyState from "../components/EmptyState";
import { Users } from "lucide-react";

const allEnrollmentsKey = ["admin-enrollments", "all"];

const StudentsAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [courseFilter, setCourseFilter] = useState("all");

  const { data: courses } = useAdminData(["admin-courses"], async () => {
    const { data: res } = await api.get("/admin/courses", { params: { limit: 100 } });
    return res.data;
  });

  const { data: list, isLoading, isError } = useAdminData(
    allEnrollmentsKey,
    async () => {
      const { data: res } = await api.get("/admin/courses/enrollments/list", { params: { limit: 500 } });
      return res.data;
    },
    { enabled: !id }
  );

  const filteredList =
    courseFilter === "all"
      ? list || []
      : (list || []).filter((e) => e.courseId === courseFilter);

  if (id) {
    return (
      <EnrollmentDetailView
        enrollmentId={id}
        backTo="/admin/students"
        onDeleted={() => navigate("/admin/students")}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Students"
        description="Manage the full student journey — from enrollment and payment to active learning, graduation, and certificates."
      />

      <div className="flex flex-wrap items-center gap-3 bg-white rounded-xl border border-slate-200/80 px-4 py-3">
        <span className="text-sm text-slate-600">Filter by course:</span>
        <select
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          className="flex-1 min-w-[200px] max-w-md px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
        >
          <option value="all">All courses</option>
          {(courses || []).map((c) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
      </div>

      {isError && <p className="text-sm text-red-600">Failed to load students.</p>}

      {isLoading ? (
        <p className="text-slate-400 py-12 text-center">Loading...</p>
      ) : filteredList.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No enrollments yet"
          description="When students register for Buland Parwaz courses, they will appear here."
        />
      ) : (
        <StudentBoard enrollments={filteredList} />
      )}
    </div>
  );
};

export default StudentsAdmin;
