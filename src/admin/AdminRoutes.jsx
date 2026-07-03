import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/Dashboard";
import InternshipsAdmin from "./pages/Internships";
import InternshipForm from "./pages/InternshipForm";
import InternshipApplications from "./pages/InternshipApplications";
import JobsAdmin from "./pages/Jobs";
import JobForm from "./pages/JobForm";
import ApplicationsAdmin from "./pages/Applications";
import MessagesAdmin from "./pages/Messages";
import CoursesAdmin from "./pages/Courses";
import CourseForm from "./pages/CourseForm";
import StudentsAdmin from "./pages/Students";
import CourseStudents from "./pages/CourseStudents";
import CertificatesAdmin from "./pages/Certificates";
import SettingsAdmin from "./pages/Settings";
import BlogsAdmin from "./pages/Blogs";
import BlogForm from "./pages/BlogForm";
import SearchAdmin from "./pages/Search";
import EmployeesAdmin from "./pages/Employees";
import EmployeeForm from "./pages/EmployeeForm";
import RecordsShell from "./components/records/RecordsShell";
import RecordsOverview from "./pages/records/RecordsOverview";
import RecordsListPage from "./pages/records/RecordsListPage";

const AdminRoutes = () => (
  <Routes>
    <Route element={<AdminLayout />}>
      <Route index element={<Dashboard />} />
      <Route path="internships" element={<InternshipsAdmin />} />
      <Route path="internships/new" element={<InternshipForm />} />
      <Route path="internships/:id/edit" element={<InternshipForm />} />
      <Route path="internships/:internshipId/applications/:applicationId" element={<InternshipApplications />} />
      <Route path="internships/:internshipId/applications" element={<InternshipApplications />} />
      <Route path="internships/:internshipId" element={<Navigate to="applications" replace />} />
      <Route path="jobs" element={<JobsAdmin />} />
      <Route path="jobs/new" element={<JobForm />} />
      <Route path="jobs/:id/edit" element={<JobForm />} />
      <Route path="applications" element={<ApplicationsAdmin />} />
      <Route path="applications/:id" element={<ApplicationsAdmin />} />
      <Route path="courses" element={<CoursesAdmin />} />
      <Route path="courses/:courseId/students/:enrollmentId" element={<CourseStudents />} />
      <Route path="courses/:courseId/students" element={<CourseStudents />} />
      <Route path="courses/:id" element={<CourseForm />} />
      <Route path="students" element={<StudentsAdmin />} />
      <Route path="students/:id" element={<StudentsAdmin />} />
      <Route path="certificates" element={<CertificatesAdmin />} />
      <Route path="messages" element={<MessagesAdmin />} />
      <Route path="messages/:id" element={<MessagesAdmin />} />
      <Route path="blogs" element={<BlogsAdmin />} />
      <Route path="blogs/:id" element={<BlogForm />} />
      <Route path="employees" element={<EmployeesAdmin />} />
      <Route path="employees/new" element={<EmployeeForm />} />
      <Route path="employees/:id/edit" element={<EmployeeForm />} />
      <Route path="employees/:id" element={<EmployeesAdmin />} />
      <Route path="records" element={<RecordsShell />}>
        <Route index element={<RecordsOverview />} />
        <Route path=":type" element={<RecordsListPage />} />
      </Route>
      <Route path="settings" element={<SettingsAdmin />} />
      <Route path="search" element={<SearchAdmin />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Route>
  </Routes>
);

export default AdminRoutes;
