import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { GraduationCap, Eye, EyeOff, AlertCircle, ChevronRight } from "lucide-react";
import { fetchApi } from "../utils/api";

export function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [rollNumber, setRollNumber] = useState("");
  const [department, setDepartment] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const payload: any = {
        name,
        email,
        password,
        role,
      };

      if (role === "student" && rollNumber) {
        payload.rollNumber = rollNumber;
      } else if (role !== "student" && department) {
        payload.department = department;
      }

      // No need to pass URL prefix because fetchApi uses full URL from env
      await fetchApi('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      // Once registered, user can log in
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
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
              Join the Nexus FYP platform
            </h1>
            <p className="text-[15px] text-fyp-text-secondary leading-relaxed">
              Create an account to manage your final year project, supervise groups, or evaluate as a jury member.
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

      {/* Right Panel — Signup Form */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-[460px] my-auto">
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
            <h2 className="text-[26px] font-bold text-fyp-text mb-1.5">Create an account</h2>
            <p className="text-sm text-fyp-text-secondary">Sign up to get started</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-fyp-red/10 border border-fyp-red/20 flex items-start gap-2">
                <AlertCircle size={16} className="text-fyp-red mt-0.5 flex-shrink-0" />
                <p className="text-[13px] text-fyp-red">{error}</p>
              </div>
            )}
            
            <div>
              <label className="text-[13px] text-fyp-text-secondary block mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-xl outline-none transition-all bg-fyp-card text-fyp-text text-sm border-[1.5px] border-fyp-border focus:border-fyp-blue"
              />
            </div>

            <div>
              <label className="text-[13px] text-fyp-text-secondary block mb-1.5">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@nu.edu.pk"
                className="w-full px-4 py-3 rounded-xl outline-none transition-all bg-fyp-card text-fyp-text text-sm border-[1.5px] border-fyp-border focus:border-fyp-blue"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[13px] text-fyp-text-secondary block mb-1.5">
                  Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all bg-fyp-card text-fyp-text text-sm border-[1.5px] border-fyp-border focus:border-fyp-blue"
                >
                  <option value="student">Student</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="admin">Coordinator</option>
                  <option value="jury">Jury Member</option>
                </select>
              </div>

              {role === "student" ? (
                <div>
                  <label className="text-[13px] text-fyp-text-secondary block mb-1.5">
                    Roll Number
                  </label>
                  <input
                    type="text"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    placeholder="22K-4543"
                    className="w-full px-4 py-3 rounded-xl outline-none transition-all bg-fyp-card text-fyp-text text-sm border-[1.5px] border-fyp-border focus:border-fyp-blue"
                  />
                </div>
              ) : (
                <div>
                  <label className="text-[13px] text-fyp-text-secondary block mb-1.5">
                    Department
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. CS"
                    className="w-full px-4 py-3 rounded-xl outline-none transition-all bg-fyp-card text-fyp-text text-sm border-[1.5px] border-fyp-border focus:border-fyp-blue"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="text-[13px] text-fyp-text-secondary block mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 mt-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:opacity-90 bg-fyp-blue text-white text-sm font-semibold disabled:opacity-50"
            >
              {isLoading ? "Creating account..." : "Sign Up"}
              {!isLoading && <ChevronRight size={16} />}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-[13px] text-fyp-text-secondary">
              Already have an account?{" "}
              <Link to="/" className="text-fyp-blue font-medium hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
