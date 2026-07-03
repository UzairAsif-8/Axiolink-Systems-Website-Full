import { NavLink, Outlet } from "react-router-dom";
import { Database } from "lucide-react";
import PageHeader from "../PageHeader";
import { RECORD_NAV } from "../../constants/recordsConfig";

const RecordsShell = () => (
  <div className="space-y-6">
    <PageHeader
      title="Records"
      description="Central registry of every student, employee, intern, course, internship, and more."
    />

    <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 min-w-0">
      <aside className="lg:w-56 shrink-0">
        <nav className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2 text-slate-700">
            <Database className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-semibold uppercase tracking-wide">Registries</span>
          </div>
          <ul className="py-1">
            {RECORD_NAV.map(({ id, label, icon: Icon, end }) => (
              <li key={id}>
                <NavLink
                  to={id === "overview" ? "/admin/records" : `/admin/records/${id}`}
                  end={end}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0 opacity-80" />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  </div>
);

export default RecordsShell;
