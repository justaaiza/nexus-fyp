import { useState } from "react";
import { useNavigate } from "react-router";
import { GraduationCap, Eye, EyeOff, BookOpen, Shield, Users, ChevronRight } from "lucide-react";

const roles = [
  {
    id: "student",
    label: "Student",
    icon: GraduationCap,
    description: "Submit proposals & track milestones",
    path: "/app/student/dashboard",
    color: "#3b7fe8",
  },
  {
    id: "supervisor",
    label: "Supervisor",
    icon: BookOpen,
    description: "Manage requests & evaluate projects",
    path: "/app/supervisor/requests",
    color: "#10b981",
  },
  {
    id: "admin",
    label: "Coordinator",
    icon: Shield,
    description: "Assign panels & manage users",
    path: "/app/admin/panels",
    color: "#f59e0b",
  },
  {
    id: "jury",
    label: "Jury Member",
    icon: Users,
    description: "Evaluate assigned project groups",
    path: "/app/jury/projects",
    color: "#8b5cf6",
  },
];

export function LoginPage() {
  const [selectedRole, setSelectedRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const role = roles.find((r) => r.id === selectedRole);
    if (role) navigate(role.path);
  };

  return (
    <div className="min-h-screen flex bg-fyp-base">
      {/* Left Panel — Branding */}
      <div
        className="hidden lg:flex flex-col justify-between w-[480px] p-12 bg-fyp-sidebar"
        style={{ borderRight: "1px solid var(--fyp-border)" }}
      >
        <div>
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-fyp-blue">
              <GraduationCap size={20} color="white" />
            </div>
            <div>
              <p className="text-[15px] font-semibold text-fyp-text">Nexus FYP</p>
              <p className="text-xs text-fyp-text-secondary">FAST NUCES Portal</p>
            </div>
          </div>

          <div className="mb-12">
            <h1 className="text-[32px] font-bold text-fyp-text leading-tight mb-4">
              Streamline your Final Year Project journey
            </h1>
            <p className="text-[15px] text-fyp-text-secondary leading-relaxed">
              A centralized platform for students, supervisors, coordinators, and jury members to manage every phase of the FYP lifecycle.
            </p>
          </div>

          <div className="space-y-4">
            {[
              "Submit & track proposals in real-time",
              "Upload milestone deliverables securely",
              "Digital rubric-based evaluations",
              "Automated panel assignments",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "rgba(59,127,232,0.2)" }}
                >
                  <div className="w-2 h-2 rounded-full bg-fyp-blue" />
                </div>
                <span className="text-sm text-fyp-text-secondary">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="px-4 py-2 rounded-lg text-xs bg-fyp-card text-fyp-text-secondary border border-fyp-border">
            FAST NUCES · FYP Portal
          </div>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-[460px]">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-fyp-blue">
              <GraduationCap size={20} color="white" />
            </div>
            <div>
              <p className="text-[15px] font-semibold text-fyp-text">FAST NUCES</p>
              <p className="text-xs text-fyp-text-secondary">FYP Management System</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-[26px] font-bold text-fyp-text mb-1.5">Welcome back</h2>
            <p className="text-sm text-fyp-text-secondary">Sign in to access your FYP portal</p>
          </div>

          {/* Role Selector */}
          <div className="mb-6">
            <p className="text-[13px] text-fyp-text-secondary mb-2.5">Select your role</p>
            <div className="grid grid-cols-2 gap-3">
              {roles.map((role) => {
                const Icon = role.icon;
                const isSelected = selectedRole === role.id;
                return (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className="p-3 rounded-xl text-left transition-all"
                    style={{
                      backgroundColor: isSelected ? `${role.color}18` : "var(--fyp-bg-card)",
                      border: isSelected ? `1.5px solid ${role.color}` : "1.5px solid var(--fyp-border)",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon size={15} color={isSelected ? role.color : "var(--fyp-text-secondary)"} />
                      <span
                        className="text-[13px] font-medium"
                        style={{ color: isSelected ? "var(--fyp-text-primary)" : "var(--fyp-text-secondary)" }}
                      >
                        {role.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-fyp-text-muted leading-snug">{role.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-[13px] text-fyp-text-secondary block mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@nu.edu.pk"
                className="w-full px-4 py-3 rounded-xl outline-none transition-all bg-fyp-card text-fyp-text text-sm border-[1.5px] border-fyp-border focus:border-fyp-blue"
              />
            </div>
            <div>
              <label className="text-[13px] text-fyp-text-secondary block mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pr-12 rounded-xl outline-none transition-all bg-fyp-card text-fyp-text text-sm border-[1.5px] border-fyp-border focus:border-fyp-blue"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-fyp-text-muted"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded accent-[#3b7fe8]" />
                <span className="text-[13px] text-fyp-text-secondary">Remember me</span>
              </label>
              <button type="button" className="text-[13px] text-fyp-blue hover:underline">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl flex items-center justify-center gap-2 transition-all hover:opacity-90 bg-fyp-blue text-white text-sm font-semibold"
            >
              Sign In
              <ChevronRight size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
