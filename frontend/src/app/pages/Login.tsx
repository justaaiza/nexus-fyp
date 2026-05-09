import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Eye, EyeOff, BookOpen, Shield, Users, ChevronRight, RefreshCw } from "lucide-react";
import fastLogo from "../assets/fast-logo.png";
import { useAuth } from "../context/AuthContext";

const roleFirstPaths: Record<string, string> = {
  student: "/app/student/dashboard",
  supervisor: "/app/supervisor/requests",
  admin: "/app/admin/panels",
  jury: "/app/jury/projects",
};

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const user = await login(email, password);
      const targetPath = roleFirstPaths[user.role] || "/app/student/dashboard";
      navigate(targetPath);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed. Please check your credentials.");
    }
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
            <div className="bg-fyp-sidebar w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden">
              <img src={fastLogo} alt="FAST Logo" className="w-full h-full object-contain" />
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
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white overflow-hidden border border-fyp-border">
              <img src={fastLogo} alt="FAST Logo" className="w-full h-full object-contain p-1" />
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

          {error && (
            <div className="mb-6 p-3 rounded-xl bg-red-950/30 border border-red-500/30 text-red-400 text-[13px] flex items-center gap-2">
              <Shield size={14} className="flex-shrink-0" />
              {error}
            </div>
          )}

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
              disabled={isLoading}
              className="w-full py-3 rounded-xl flex items-center justify-center gap-2 transition-all hover:opacity-90 bg-fyp-blue text-white text-sm font-semibold disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                  <ChevronRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[13px] text-fyp-text-secondary">
              Don't have an account?{" "}
              <Link to="/signup" className="text-fyp-blue font-medium hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
