import { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
import { notificationAPI, studentAPI } from "../services/api";
import { Chatbot } from "./Chatbot";
import {
  GraduationCap, LayoutDashboard, Upload, MessageSquare,
  UserCheck, CalendarPlus, ClipboardCheck, Users2,
  UserCog, Megaphone, FolderOpen, FileText, Star,
  ChevronDown, Bell, Search, LogOut, Menu, X,
  BookOpen, Shield, Users, ChevronRight
} from "lucide-react";
import logo from "../assets/fast-logo.png";

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
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const currentRole = (user?.role as Role) || detectRole(location.pathname);
  const config = roleConfig[currentRole] || roleConfig.student;
  const RoleIcon = config.icon;

  const [proposal, setProposal] = useState<any>(null);

  const fetchNotifications = async () => {
    try {
      const res = await notificationAPI.getNotifications() as { data: any[] };
      setNotifications(res.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (user) fetchNotifications();
    if (currentRole === "student") {
      studentAPI.getMyProposal().then((res: any) => setProposal(res.data)).catch(() => { });
    }
  }, [user, currentRole]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications((prev) => prev.map(n => ({ ...n, isRead: true })));
    } catch (e) {
      console.error(e);
    }
  };

  const handleNotificationClick = async (notif: any) => {
    if (!notif.isRead) {
      try {
        await notificationAPI.markAsRead(notif._id);
        setNotifications((prev) => prev.map(n => n._id === notif._id ? { ...n, isRead: true } : n));
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-fyp-base">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col transition-transform duration-300 lg:static lg:translate-x-0 bg-fyp-sidebar border-r border-fyp-border ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Logo */}
        <div className="p-5 flex items-center gap-3 border-b border-fyp-border">
          <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0 bg-white border border-fyp-border">
            <img src={logo} alt="Nexus Logo" className="bg-black w-full h-full object-cover" />
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

        {/* Role Display */}
        <div className="p-4 border-b border-fyp-border">
          <p className="text-[11px] text-fyp-text-muted uppercase tracking-wider mb-2">Active Role</p>
          <div className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-fyp-card border border-fyp-border cursor-default">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${config.color}20` }}
            >
              <RoleIcon size={14} color={config.color} />
            </div>
            <span className="text-[13px] font-medium text-fyp-text flex-1 text-left">
              {config.label}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <p className="text-[11px] text-fyp-text-muted uppercase tracking-wider mb-2.5">Navigation</p>
          <div className="space-y-1">
            {config.nav.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              const isDashboard = item.path === "/app/student/dashboard";
              const isDisabled = currentRole === "student" && !isDashboard && (!proposal || proposal.status !== "approved");

              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left`}
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

          {/* <div className="flex items-center gap-2 flex-1 max-w-sm px-3 py-2 rounded-xl bg-fyp-card border border-fyp-border">
            <Search size={14} className="text-fyp-text-muted" />
            <input
              placeholder="Search..."
              className="bg-transparent outline-none flex-1 text-fyp-text text-[13px]"
            />
          </div> */}

          <div className="ml-auto flex items-center gap-3">
            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-fyp-card border border-fyp-border"
              >
                <Bell size={16} className="text-fyp-text-secondary" />
                {notifications.some(n => !n.isRead) && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-fyp-red" />
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 max-h-[400px] overflow-hidden flex flex-col z-50 bg-fyp-card border border-fyp-border shadow-xl shadow-black/40 rounded-xl">
                  <div className="p-3 border-b border-fyp-border flex items-center justify-between">
                    <h3 className="text-[13px] font-semibold text-fyp-text">Notifications</h3>
                    <button onClick={handleMarkAllRead} className="text-[11px] text-fyp-blue hover:underline">
                      Mark all as read
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-[13px] text-fyp-text-muted text-center py-6">No notifications</p>
                    ) : (
                      <div className="divide-y divide-fyp-border">
                        {notifications.map(n => (
                          <div
                            key={n._id}
                            onClick={() => handleNotificationClick(n)}
                            className={`p-3 cursor-pointer transition-all hover:bg-fyp-elevated ${!n.isRead ? 'bg-fyp-blue/5' : ''}`}
                          >
                            <div className="flex items-start gap-2">
                              {!n.isRead && <div className="mt-1.5 w-2 h-2 rounded-full bg-fyp-blue flex-shrink-0" />}
                              <div>
                                <p className={`text-[13px] ${!n.isRead ? 'font-semibold text-fyp-text' : 'text-fyp-text-secondary'}`}>
                                  {n.title}
                                </p>
                                <p className="text-[11px] text-fyp-text-muted mt-0.5 line-clamp-2">{n.content}</p>
                                <p className="text-[10px] text-fyp-text-muted mt-1">
                                  {new Date(n.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-xl transition-all hover:bg-fyp-card border border-transparent hover:border-fyp-border"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-[13px] font-medium text-fyp-text leading-none">{user?.name || "User"}</p>
                  <p className="text-[11px] text-fyp-text-muted mt-1">{config.label}</p>
                </div>
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-xs"
                  style={{ backgroundColor: `${config.color}20`, color: config.color }}
                >
                  {user?.name?.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "U"}
                </div>
              </button>

              {profileOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 z-50 bg-fyp-card border border-fyp-border shadow-xl shadow-black/40 rounded-xl overflow-hidden">
                  <div className="p-4 border-b border-fyp-border">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${config.color}20` }}
                      >
                        <RoleIcon size={20} color={config.color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-semibold text-fyp-text truncate">{user?.name}</p>
                        <p className="text-[12px] text-fyp-text-muted truncate">{user?.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[12px] text-fyp-text-secondary">Role</span>
                      <span className="text-[12px] font-medium" style={{ color: config.color }}>{config.label}</span>
                    </div>
                    {user?.rollNumber && (
                      <div className="flex justify-between items-center">
                        <span className="text-[12px] text-fyp-text-secondary">Roll Number</span>
                        <span className="text-[12px] font-medium text-fyp-text">{user.rollNumber}</span>
                      </div>
                    )}
                    {user?.department && (
                      <div className="flex justify-between items-center">
                        <span className="text-[12px] text-fyp-text-secondary">Department</span>
                        <span className="text-[12px] font-medium text-fyp-text">{user.department}</span>
                      </div>
                    )}
                  </div>

                  <div className="p-2 border-t border-fyp-border">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all hover:bg-fyp-elevated text-[13px] text-fyp-red font-medium"
                    >
                      <LogOut size={14} />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>

        {/* Chatbot (Student only) */}
        {currentRole === "student" && <Chatbot />}
      </div>
    </div>
  );
}
