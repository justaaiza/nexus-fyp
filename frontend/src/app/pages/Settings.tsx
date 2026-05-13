import { useSettings } from "../context/SettingsContext";
import { useAuth } from "../context/AuthContext";
import { PageHeader } from "../components/PageHeader";
import { Card } from "../components/Card";
import { Moon, Sun, Monitor, Type, User, Lock, CheckCircle2, RefreshCw } from "lucide-react";
import { useState } from "react";
import { studentAPI, supervisorAPI, juryAPI } from "../services/api";

type TextSize = "small" | "medium" | "large";

export function SettingsPage() {
  const { theme, setTheme, textSize, setTextSize, showToast } = useSettings();
  const { user, updateUser } = useAuth();

  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    rollNumber: user?.rollNumber || "",
    department: user?.department || "",
  });
  const [saving, setSaving] = useState(false);
  const [profileError, setProfileError] = useState("");

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError("");
    if (!profileForm.name.trim()) {
      setProfileError("Name cannot be empty.");
      return;
    }
    setSaving(true);
    try {
      const role = user?.role;
      const body = { name: profileForm.name, rollNumber: profileForm.rollNumber, department: profileForm.department };

      if (role === "student") {
        await studentAPI.updateProfile(body);
      } else if (role === "supervisor") {
        await supervisorAPI.updateProfile(body);
      } else if (role === "jury") {
        await juryAPI.updateProfile(body);
      }
      // Update local auth state so header/sidebar instantly reflects new name
      updateUser({ name: profileForm.name.trim() });
      showToast("Profile updated successfully!", "success");
    } catch (err: any) {
      setProfileError(err.message || "Failed to update profile.");
      showToast("Failed to update profile.", "error");
    } finally {
      setSaving(false);
    }
  };

  const activeThemeBtn = "ring-2 ring-offset-1 ring-fyp-blue font-semibold";

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <PageHeader title="Settings" subtitle="Manage your profile, appearance, and preferences." />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ── Profile Card ──────────────────────────────────────── */}
        <Card className="space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-fyp-border">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-base flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #3b7fe8, #8b5cf6)" }}
            >
              {user?.name?.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="text-base font-semibold text-fyp-text">Profile Information</h3>
              <p className="text-xs text-fyp-text-muted capitalize">Role: {user?.role}</p>
            </div>
          </div>

          {profileError && (
            <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/30 text-red-400 text-[13px]">
              {profileError}
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="text-[13px] text-fyp-text-secondary block mb-1.5 flex items-center gap-1.5">
                <User size={12} /> Full Name *
              </label>
              <input
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                placeholder="Your full name"
                className="w-full px-4 py-2.5 rounded-xl outline-none bg-fyp-elevated border border-fyp-border text-fyp-text text-[13px] focus:border-fyp-blue transition-colors"
              />
            </div>

            <div>
              <label className="text-[13px] text-fyp-text-secondary block mb-1.5 flex items-center gap-1.5">
                <Lock size={12} /> Email Address
              </label>
              <input
                value={user?.email || ""}
                disabled
                className="w-full px-4 py-2.5 rounded-xl outline-none bg-fyp-base border border-fyp-border text-fyp-text-muted text-[13px] cursor-not-allowed"
              />
              <p className="text-xs text-fyp-text-muted mt-1">Email cannot be changed.</p>
            </div>

            {user?.role === "student" && (
              <>
                <div>
                  <label className="text-[13px] text-fyp-text-secondary block mb-1.5">Roll Number</label>
                  <input
                    value={profileForm.rollNumber}
                    onChange={(e) => setProfileForm({ ...profileForm, rollNumber: e.target.value })}
                    placeholder="e.g. 21K-3456"
                    className="w-full px-4 py-2.5 rounded-xl outline-none bg-fyp-elevated border border-fyp-border text-fyp-text text-[13px] focus:border-fyp-blue transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[13px] text-fyp-text-secondary block mb-1.5">Department</label>
                  <input
                    value={profileForm.department}
                    onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
                    placeholder="e.g. Computer Science"
                    className="w-full px-4 py-2.5 rounded-xl outline-none bg-fyp-elevated border border-fyp-border text-fyp-text text-[13px] focus:border-fyp-blue transition-colors"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm bg-fyp-blue text-white font-medium hover:opacity-90 transition-all disabled:opacity-60"
            >
              {saving ? (
                <><RefreshCw size={14} className="animate-spin" /> Saving...</>
              ) : (
                <><CheckCircle2 size={14} /> Save Changes</>
              )}
            </button>
          </form>
        </Card>

        {/* ── Appearance Card ───────────────────────────────────── */}
        <Card className="space-y-6 h-fit">
          <div className="pb-4 border-b border-fyp-border">
            <h3 className="text-base font-semibold text-fyp-text">Appearance</h3>
            <p className="text-xs text-fyp-text-muted mt-0.5">Changes apply instantly and are saved.</p>
          </div>

          {/* Theme */}
          <div>
            <label className="text-[13px] text-fyp-text-secondary mb-3 flex items-center gap-2">
              <Monitor size={14} /> Theme
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => { setTheme("light"); showToast("Switched to Light Mode"); }}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${theme === "light" ? "border-fyp-blue bg-fyp-blue/10" : "border-fyp-border bg-fyp-elevated hover:border-fyp-text-muted"}`}
              >
                <Sun size={20} className={theme === "light" ? "text-fyp-amber" : "text-fyp-text-muted"} />
                <span className={`text-[12px] font-medium ${theme === "light" ? "text-fyp-text" : "text-fyp-text-secondary"}`}>Light</span>
                {theme === "light" && <CheckCircle2 size={12} className="text-fyp-blue" />}
              </button>
              <button
                type="button"
                onClick={() => { setTheme("dark"); showToast("Switched to Dark Mode"); }}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${theme === "dark" ? "border-fyp-blue bg-fyp-blue/10" : "border-fyp-border bg-fyp-elevated hover:border-fyp-text-muted"}`}
              >
                <Moon size={20} className={theme === "dark" ? "text-fyp-purple" : "text-fyp-text-muted"} />
                <span className={`text-[12px] font-medium ${theme === "dark" ? "text-fyp-text" : "text-fyp-text-secondary"}`}>Dark</span>
                {theme === "dark" && <CheckCircle2 size={12} className="text-fyp-blue" />}
              </button>
            </div>
          </div>

          {/* Text Size */}
          <div>
            <label className="text-[13px] text-fyp-text-secondary mb-3 flex items-center gap-2">
              <Type size={14} /> Text Size
            </label>
            <div className="flex bg-fyp-elevated rounded-xl p-1 border border-fyp-border">
              {(["small", "medium", "large"] as TextSize[]).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => { setTextSize(size); showToast(`Text size set to ${size}`); }}
                  className={`flex-1 py-2 rounded-lg text-[13px] font-medium transition-all capitalize ${
                    textSize === size
                      ? "bg-fyp-blue text-white shadow-sm"
                      : "text-fyp-text-secondary hover:text-fyp-text"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-fyp-text-muted mt-2 text-center">
              Preview: <span style={{ fontSize: textSize === "small" ? "13px" : textSize === "large" ? "17px" : "15px" }}>The quick brown fox</span>
            </p>
          </div>

          {/* Account Info Block */}
          <div className="pt-2 border-t border-fyp-border space-y-2">
            <p className="text-[11px] text-fyp-text-muted uppercase tracking-wider">Account</p>
            <div className="flex justify-between items-center p-3 rounded-xl bg-fyp-elevated border border-fyp-border">
              <span className="text-[12px] text-fyp-text-secondary">Status</span>
              <span className="text-[12px] font-medium text-fyp-green flex items-center gap-1">
                <CheckCircle2 size={12} /> Active
              </span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-fyp-elevated border border-fyp-border">
              <span className="text-[12px] text-fyp-text-secondary">Role</span>
              <span className="text-[12px] font-medium text-fyp-text capitalize">{user?.role}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
