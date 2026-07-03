import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  GraduationCap,
  Award,
  Mail,
  BookOpen,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ChevronDown,
  HelpCircle,
  Database,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";
import Logo from "../../assets/LogoSimple.png";
import { navItems } from "../utils/permissions";

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const iconMap = {
    Dashboard: LayoutDashboard,
    Records: Database,
    Internships: Briefcase,
    Applications: FileText,
    Courses: GraduationCap,
    Students: Users,
    Certificates: Award,
    Employees: Users,
    Departments: Users,
    Messages: Mail,
    Blogs: BookOpen,
    Settings: Settings,
  };

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  const qc = useQueryClient();

  const { data: notifData } = useQuery({
    queryKey: ["admin-notifications"],
    queryFn: async () => {
      const { data: res } = await api.get("/admin/dashboard/notifications");
      return res.data;
    },
    refetchInterval: 30000,
  });

  const markReadMut = useMutation({
    mutationFn: (notifId) => api.patch(`/admin/dashboard/notifications/${notifId}/read`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-notifications"] }),
  });

  const markAllReadMut = useMutation({
    mutationFn: () => api.patch("/admin/dashboard/notifications/read-all"),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-notifications"] }),
  });

  const unreadCount = notifData?.unreadCount ?? 0;
  const mockNotifications = notifData?.notifications ?? [];
  const initials = (user?.name || "A")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen flex bg-slate-50 overflow-x-hidden">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-[260px] flex flex-col bg-white border-r border-slate-200 transition-transform duration-200 ease-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-100">
          <img src={Logo} alt="Axiolink" className="h-8 w-auto object-contain" />
          <div className="min-w-0">
            <p className="font-semibold text-sm text-slate-900 truncate">Axiolink Systems (Pvt) Ltd.</p>
            <p className="text-[11px] text-slate-400 font-medium tracking-wide uppercase">Admin Portal</p>
          </div>
          <button
            type="button"
            className="lg:hidden ml-auto p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {navItems.map((section) => (
            <div key={section.section}>
              <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {section.section}
              </p>
              <div className="space-y-0.5">
                {section.items.map(({ to, label, end }) => {
                  const Icon = iconMap[label] || LayoutDashboard;
                  return (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                        isActive
                          ? "bg-blue-50 text-blue-700"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`
                    }
                  >
                    <Icon className="w-[18px] h-[18px] shrink-0 opacity-80" />
                    {label}
                  </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-semibold">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{user?.name}</p>
              <p className="text-xs text-slate-400 truncate">{user?.role?.replace(/_/g, " ")}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-2 w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 w-full">
        <header className="sticky top-0 z-30 h-14 sm:h-16 flex items-center gap-2 sm:gap-4 px-3 sm:px-4 lg:px-8 bg-white/95 backdrop-blur-md border-b border-slate-200">
          <button
            type="button"
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1 min-w-0 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="search"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 placeholder:text-slate-400 transition-shadow min-w-0"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    navigate(`/admin/search?q=${encodeURIComponent(e.target.value)}`);
                  }
                }}
              />
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hidden sm:flex"
              title="Help"
            >
              <HelpCircle className="w-[18px] h-[18px]" />
            </button>

            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <Bell className="w-[18px] h-[18px]" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900">Notifications</p>
                    <span className="text-xs text-blue-600 font-medium">{unreadCount} new</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {mockNotifications.length === 0 ? (
                      <p className="px-4 py-6 text-sm text-slate-500 text-center">No notifications</p>
                    ) : (
                      mockNotifications.map((n) => (
                        <button
                          key={n.id}
                          type="button"
                          onClick={() => {
                            if (!n.isRead) markReadMut.mutate(n.id);
                            if (n.link) navigate(n.link);
                            setNotifOpen(false);
                          }}
                          className={`w-full text-left px-4 py-3 border-b border-slate-50 hover:bg-slate-50 ${
                            !n.isRead ? "bg-blue-50/30" : ""
                          }`}
                        >
                          <p className="text-sm font-medium text-slate-900">{n.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.message}</p>
                          <p className="text-[11px] text-slate-400 mt-1">
                            {n.createdAt ? new Date(n.createdAt).toLocaleString() : ""}
                          </p>
                        </button>
                      ))
                    )}
                  </div>
                  {mockNotifications.length > 0 && unreadCount > 0 && (
                    <div className="px-4 py-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => markAllReadMut.mutate()}
                        className="text-xs font-medium text-blue-600 hover:text-blue-700"
                      >
                        Mark all as read
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="relative ml-1" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-lg hover:bg-slate-100"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-semibold">
                  {initials}
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-slate-200 shadow-lg py-1">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden overflow-y-auto min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
