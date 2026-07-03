import { Link } from "react-router-dom";
import { Briefcase, FileText, GraduationCap, Mail, ArrowUpRight, Database, UserCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useAdminData } from "../hooks/useAdminData";
import api from "../api/client";
import StatCard from "../components/StatCard";
import Panel from "../components/Panel";
import StatusBadge from "../components/StatusBadge";
import QuickAddDropdown from "../components/QuickAddDropdown";

const emptyStats = {
  openInternships: 0,
  openJobs: 0,
  totalApplications: 0,
  totalEnrollments: 0,
  unreadMessages: 0,
};

const AdminDashboard = () => {
  const { user } = useAuth();

  const { data, isLoading, isError } = useAdminData(["dashboard-stats"], async () => {
    const { data: res } = await api.get("/admin/dashboard/stats");
    return res.data;
  });

  const s = data?.stats || emptyStats;
  const recentApps = data?.recentApplications || [];

  if (isLoading) {
    return (
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 rounded-xl bg-slate-200" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {isError && (
        <div className="px-4 py-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-800">
          Could not load dashboard data. Ensure the backend is running.
        </div>
      )}

      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight text-slate-900">
            Welcome back, {user?.name?.split(" ")[0] || "Admin"}
          </h1>
          <p className="mt-1 text-slate-500 text-sm">Manage your site content and applications.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/applications"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-colors"
          >
            Review Applications
            <ArrowUpRight className="w-4 h-4" />
          </Link>
          <QuickAddDropdown label="Quick Add" variant="primary" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Link to="/admin/applications">
          <StatCard label="Applications" value={s.totalApplications} icon={FileText} accent="blue" />
        </Link>
        <Link to="/admin/internships">
          <StatCard label="Open Internships" value={s.openInternships} icon={Briefcase} accent="indigo" />
        </Link>
        <Link to="/admin/jobs">
          <StatCard label="Open Jobs" value={s.openJobs} icon={Briefcase} accent="violet" />
        </Link>
        <Link to="/admin/students">
          <StatCard label="Enrollments" value={s.totalEnrollments} icon={GraduationCap} accent="emerald" />
        </Link>
        <Link to="/admin/messages">
          <StatCard label="Unread Messages" value={s.unreadMessages} icon={Mail} accent="amber" />
        </Link>
      </div>

      <Panel
        title="Records hub"
        action={
          <Link to="/admin/records" className="text-sm font-medium text-blue-600 hover:text-blue-700">
            Open all records
          </Link>
        }
      >
        <p className="text-sm text-slate-500 mb-4">
          Browse every student, employee, intern, course, and internship in one place.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { to: "/admin/records/internships", label: "Internships", icon: Briefcase },
            { to: "/admin/records/applications", label: "Applications", icon: FileText },
            { to: "/admin/records/interns?status=COMPLETED", label: "Completed interns", icon: UserCheck },
            { to: "/admin/records/enrollments", label: "Students", icon: GraduationCap },
            { to: "/admin/records/employees", label: "Employees", icon: Database },
            { to: "/admin/records/messages", label: "Messages", icon: Mail },
          ].map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-3 px-4 py-3 rounded-lg border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-blue-200 transition-colors text-sm font-medium text-slate-700"
            >
              <Icon className="w-4 h-4 text-blue-600 shrink-0" />
              {label}
            </Link>
          ))}
        </div>
      </Panel>

      <Panel
        title="Recent Applications"
        action={
          <Link to="/admin/applications" className="text-sm font-medium text-blue-600 hover:text-blue-700">
            View all
          </Link>
        }
      >
        {recentApps.length === 0 ? (
          <p className="text-sm text-slate-400 py-4 text-center">No applications yet</p>
        ) : (
          <div className="table-scroll -mx-4 sm:-mx-6 -mb-6">
            <table className="w-full text-sm table-min-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Applicant</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase hidden md:table-cell">
                    Position
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/80">
                    <td className="px-6 py-3.5">
                      <Link to={`/admin/applications/${app.id}`}>
                        <p className="font-medium text-slate-900 hover:text-blue-600">{app.fullName}</p>
                        <p className="text-xs text-slate-400">{app.email}</p>
                      </Link>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell text-slate-600 text-xs truncate max-w-[180px]">
                      {app.internshipTitle}
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={app.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
};

export default AdminDashboard;
