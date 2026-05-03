import { useState, useEffect } from "react";
import { CheckCircle2, XCircle, Search, UserCog, GraduationCap, BookOpen, Users, Trash2, RefreshCw } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { StatCardSimple } from "../../components/StatCard";
import { EmptyState } from "../../components/EmptyState";
import { adminAPI } from "../../services/api";

type UserRole = "student" | "supervisor" | "jury";
type UserStatus = "pending" | "approved" | "rejected";

type User = {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  rollNumber: string;
  createdAt: string;
  isApproved: boolean;
};

const roleConfig: Record<UserRole, { icon: React.ElementType; color: string; bg: string; label: string }> = {
  student: { icon: GraduationCap, color: "#3b7fe8", bg: "rgba(59,127,232,0.1)", label: "Student" },
  supervisor: { icon: BookOpen, color: "#10b981", bg: "rgba(16,185,129,0.1)", label: "Supervisor" },
  jury: { icon: Users, color: "#8b5cf6", bg: "rgba(139,92,246,0.1)", label: "Jury Member" },
};

function getStatus(user: User): UserStatus {
  return user.isApproved ? "approved" : "pending";
}

const statusConfig: Record<UserStatus, { color: string; bg: string; border: string }> = {
  pending: { color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.25)" },
  approved: { color: "#10b981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.25)" },
  rejected: { color: "#ef4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.25)" },
};

export function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | UserRole>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | UserStatus>("all");
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await adminAPI.getUsers(filter !== "all" ? filter : undefined) as { success: boolean; data: User[] };
      setUsers(res.data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [filter]);

  const filtered = users.filter((u) => {
    const status = getStatus(u);
    if (statusFilter !== "all" && status !== statusFilter) return false;
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleApprove = async (id: string) => {
    try {
      await adminAPI.approveUser(id);
      setUsers((prev) => prev.map((u) => u._id === id ? { ...u, isApproved: true } : u));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to approve user.");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await adminAPI.rejectUser(id);
      setUsers((prev) => prev.map((u) => u._id === id ? { ...u, isApproved: false } : u));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to reject user.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this user permanently?")) return;
    try {
      await adminAPI.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete user.");
    }
  };

  const pendingCount = users.filter((u) => !u.isApproved).length;
  const approvedCount = users.filter((u) => u.isApproved).length;
  const studentCount = users.filter((u) => u.role === "student").length;
  const facultyCount = users.filter((u) => u.role !== "student").length;

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <RefreshCw size={24} className="text-fyp-blue animate-spin mx-auto mb-3" />
          <p className="text-fyp-text-secondary text-sm">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <PageHeader title="User Management" subtitle="Approve or reject faculty and student registrations." />

      {error && (
        <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
          {error}
          <button onClick={fetchUsers} className="ml-auto text-xs underline">Retry</button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCardSimple label="Pending" value={pendingCount} color="#f59e0b" />
        <StatCardSimple label="Approved" value={approvedCount} color="#10b981" />
        <StatCardSimple label="Students" value={studentCount} color="#3b7fe8" />
        <StatCardSimple label="Faculty" value={facultyCount} color="#8b5cf6" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl flex-1 min-w-[200px] bg-fyp-card border border-fyp-border">
          <Search size={14} className="text-fyp-text-muted" />
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="bg-transparent outline-none flex-1 text-fyp-text text-[13px]"
          />
        </div>

        <div className="flex gap-2">
          {(["all", "student", "supervisor", "jury"] as const).map((r) => (
            <button key={r} onClick={() => setFilter(r)} className="px-3 py-2 rounded-xl text-xs transition-all" style={{
              backgroundColor: filter === r ? "#3b7fe8" : "var(--fyp-bg-card)",
              color: filter === r ? "white" : "var(--fyp-text-secondary)",
              border: filter === r ? "none" : "1px solid var(--fyp-border)",
            }}>
              {r === "all" ? "All Roles" : roleConfig[r].label}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          {(["all", "pending", "approved"] as const).map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)} className="px-3 py-2 rounded-xl text-xs transition-all capitalize" style={{
              backgroundColor: statusFilter === s ? "#f59e0b" : "var(--fyp-bg-card)",
              color: statusFilter === s ? "#0d1117" : "var(--fyp-text-secondary)",
              border: statusFilter === s ? "none" : "1px solid var(--fyp-border)",
              fontWeight: statusFilter === s ? 600 : 400,
            }}>
              {s === "all" ? "All Status" : s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {users.length === 0 ? (
        <EmptyState icon={UserCog} title="No user registrations" description="User registration requests will appear here for approval." />
      ) : (
        <div className="rounded-2xl overflow-x-auto bg-fyp-card border border-fyp-border">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-12 px-5 py-3 border-b border-fyp-border bg-fyp-sidebar">
              {["User", "Role", "Dept", "Reg #", "Registered", "Status", "Actions"].map((h, i) => (
                <div key={h} className="text-[11px] text-fyp-text-muted uppercase tracking-wider" style={{
                  gridColumn: i === 0 ? "span 3" : i === 6 ? "span 2" : "span 1",
                }}>
                  {h}
                </div>
              ))}
            </div>

            {filtered.map((user, idx) => {
              const roleKey = (["student", "supervisor", "jury"].includes(user.role) ? user.role : "student") as UserRole;
              const rc = roleConfig[roleKey];
              const status = getStatus(user);
              const sc = statusConfig[status];
              const RoleIcon = rc.icon;

              return (
                <div key={user._id} className="grid grid-cols-12 px-5 py-4 items-center hover:bg-fyp-elevated/50 transition-all" style={{ borderBottom: idx < filtered.length - 1 ? "1px solid #1e2538" : "none" }}>
                  <div className="col-span-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-bold" style={{ backgroundColor: rc.bg, color: rc.color }}>
                      {user.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium text-fyp-text">{user.name}</p>
                      <p className="text-[11px] text-fyp-text-muted">{user.email}</p>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <div className="flex items-center gap-1 w-fit px-2 py-0.5 rounded-lg" style={{ backgroundColor: rc.bg }}>
                      <RoleIcon size={10} color={rc.color} />
                      <span className="text-[10px]" style={{ color: rc.color }}>{rc.label}</span>
                    </div>
                  </div>
                  <div className="col-span-1"><span className="text-xs text-fyp-text-secondary">{user.department || "—"}</span></div>
                  <div className="col-span-2"><span className="text-xs text-fyp-text-secondary">{user.rollNumber || "—"}</span></div>
                  <div className="col-span-2"><span className="text-xs text-fyp-text-muted">{new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span></div>
                  <div className="col-span-1">
                    <span className="px-2 py-0.5 rounded-lg capitalize text-[11px]" style={{ backgroundColor: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>{status}</span>
                  </div>
                  <div className="col-span-2 flex gap-2">
                    {!user.isApproved && (
                      <>
                        <button onClick={() => handleApprove(user._id)} className="p-1.5 rounded-lg transition-all hover:bg-green-950/30" title="Approve">
                          <CheckCircle2 size={15} className="text-fyp-green" />
                        </button>
                      </>
                    )}
                    {user.isApproved && (
                      <button onClick={() => handleReject(user._id)} className="p-1.5 rounded-lg transition-all hover:bg-red-950/30" title="Revoke">
                        <XCircle size={15} className="text-fyp-red" />
                      </button>
                    )}
                    <button onClick={() => handleDelete(user._id)} className="p-1.5 rounded-lg transition-all hover:bg-red-950/30" title="Delete">
                      <Trash2 size={13} className="text-fyp-text-muted hover:text-fyp-red" />
                    </button>
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-sm text-fyp-text-muted">No users found matching your filters.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
