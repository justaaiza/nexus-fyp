import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import {
  GraduationCap, LayoutDashboard, Upload, MessageSquare,
  UserCheck, CalendarPlus, ClipboardCheck, Users2,
  UserCog, Megaphone, FolderOpen, FileText, Star,
  ChevronDown, Bell, Search, LogOut, Menu, X,
  BookOpen, Shield, Users, ChevronRight
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

type Role = "student" | "supervisor" | "admin" | "jury";

const roleConfig: Record<Role, {
  label: string;
  icon: React.ElementType;
  color: string;
  nav: { label: string; icon: React.ElementType; path: string }[];
}> = {
  student: {
    label: "Student",
    icon: GraduationCap,
    color: "#3b7fe8",
    nav: [
      { label: "Proposal Dashboard", icon: LayoutDashboard, path: "/app/student/dashboard" },
      { label: "Milestone Submission", icon: Upload, path: "/app/student/milestones" },
      { label: "Feedback & Grades", icon: MessageSquare, path: "/app/student/feedback" },
    ],
  },
  supervisor: {
    label: "Supervisor",
    icon: BookOpen,
    color: "#10b981",
    nav: [
      { label: "Request Management", icon: UserCheck, path: "/app/supervisor/requests" },
      { label: "Milestone Creation", icon: CalendarPlus, path: "/app/supervisor/milestones" },
      { label: "Evaluation", icon: ClipboardCheck, path: "/app/supervisor/evaluation" },
    ],
  },
  admin: {
    label: "Coordinator",
    icon: Shield,
    color: "#f59e0b",
    nav: [
      { label: "Panel Assignment", icon: Users2, path: "/app/admin/panels" },
      { label: "User Management", icon: UserCog, path: "/app/admin/users" },
      { label: "Announcements", icon: Megaphone, path: "/app/admin/announcements" },
    ],
  },
  jury: {
    label: "Jury Member",
    icon: Users,
    color: "#8b5cf6",
    nav: [
      { label: "Assigned Projects", icon: FolderOpen, path: "/app/jury/projects" },
      { label: "View Deliverables", icon: FileText, path: "/app/jury/deliverables" },
      { label: "Input Scores", icon: Star, path: "/app/jury/scores" },
    ],
  },
};

const roleFirstPaths: Record<Role, string> = {
  student: "/app/student/dashboard",
  supervisor: "/app/supervisor/requests",
  admin: "/app/admin/panels",
  jury: "/app/jury/projects",
};

function detectRole(pathname: string): Role {
  if (pathname.includes("/student")) return "student";
  if (pathname.includes("/supervisor")) return "supervisor";
  if (pathname.includes("/admin")) return "admin";
  if (pathname.includes("/jury")) return "jury";
  return "student";
}

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [roleDropdown, setRoleDropdown] = useState(false);
  const { logout } = useAuth();

  const currentRole = detectRole(location.pathname);
  const config = roleConfig[currentRole];
  const RoleIcon = config.icon;

  const handleRoleSwitch = (role: Role) => {
    setRoleDropdown(false);
    navigate(roleFirstPaths[role]);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-fyp-base">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col transition-transform duration-300 lg:static lg:translate-x-0 bg-fyp-sidebar border-r border-fyp-border ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="p-5 flex items-center gap-3 border-b border-fyp-border">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-fyp-blue">
            <GraduationCap size={18} color="white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-fyp-text">Nexus FYP</p>
            <p className="text-[11px] text-fyp-text-muted">FAST NUCES</p>
          </div>
          <button
            className="lg:hidden text-fyp-text-muted"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Role Switcher */}
        <div className="p-4 border-b border-fyp-border">
          <p className="text-[11px] text-fyp-text-muted uppercase tracking-wider mb-2">Active Role</p>
          <div className="relative">
            <button
              onClick={() => setRoleDropdown(!roleDropdown)}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all bg-fyp-card border border-fyp-border"
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${config.color}20` }}
              >
                <RoleIcon size={14} color={config.color} />
              </div>
              <span className="text-[13px] font-medium text-fyp-text flex-1 text-left">
                {config.label}
              </span>
              <ChevronDown size={14} className="text-fyp-text-muted" />
            </button>

            {roleDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden z-50 bg-fyp-card border border-fyp-border shadow-xl shadow-black/40">
                {(Object.keys(roleConfig) as Role[]).map((role) => {
                  const rc = roleConfig[role];
                  const Ic = rc.icon;
                  return (
                    <button
                      key={role}
                      onClick={() => handleRoleSwitch(role)}
                      className="w-full flex items-center gap-2 px-3 py-2.5 transition-all hover:bg-fyp-elevated"
                    >
                      <div
                        className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${rc.color}20` }}
                      >
                        <Ic size={12} color={rc.color} />
                      </div>
                      <span
                        className="text-[13px]"
                        style={{ color: currentRole === role ? "var(--fyp-text-primary)" : "var(--fyp-text-secondary)" }}
                      >
                        {rc.label}
                      </span>
                      {currentRole === role && (
                        <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ backgroundColor: rc.color }} />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <p className="text-[11px] text-fyp-text-muted uppercase tracking-wider mb-2.5">Navigation</p>
          <div className="space-y-1">
            {config.nav.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => { navigate(item.path); setSidebarOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left"
                  style={{
                    backgroundColor: isActive ? `${config.color}15` : "transparent",
                    color: isActive ? "var(--fyp-text-primary)" : "var(--fyp-text-secondary)",
                    borderLeft: isActive ? `2px solid ${config.color}` : "2px solid transparent",
                  }}
                >
                  <Icon size={16} color={isActive ? config.color : "var(--fyp-text-muted)"} />
                  <span className={`text-[13px] ${isActive ? "font-medium" : ""}`}>{item.label}</span>
                  {isActive && <ChevronRight size={12} style={{ marginLeft: "auto", color: config.color }} />}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Bottom — Sign Out */}
        <div className="p-4 border-t border-fyp-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl transition-all hover:bg-fyp-card text-[13px] text-fyp-text-secondary"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-black/60"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex items-center gap-4 px-6 py-4 flex-shrink-0 bg-fyp-sidebar border-b border-fyp-border">
          <button
            className="lg:hidden text-fyp-text-secondary"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-2 flex-1 max-w-sm px-3 py-2 rounded-xl bg-fyp-card border border-fyp-border">
            <Search size={14} className="text-fyp-text-muted" />
            <input
              placeholder="Search..."
              className="bg-transparent outline-none flex-1 text-fyp-text text-[13px]"
            />
          </div>

          <div className="ml-auto flex items-center gap-3">
            {/* Notifications */}
            <button className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-fyp-card border border-fyp-border">
              <Bell size={16} className="text-fyp-text-secondary" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-fyp-red" />
            </button>

            {/* Role indicator pill */}
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
              style={{ backgroundColor: `${config.color}15`, border: `1px solid ${config.color}30` }}
            >
              <RoleIcon size={13} color={config.color} />
              <span className="text-xs font-medium" style={{ color: config.color }}>{config.label}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
