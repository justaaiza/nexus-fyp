import { useState, useEffect } from "react";
import { useOutletContext } from "react-router";
import { CheckCircle2, XCircle, Users, ChevronRight, Mail, RefreshCw } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { StatCardSimple } from "../../components/StatCard";
import { Modal } from "../../components/Modal";
import { EmptyState } from "../../components/EmptyState";
import { supervisorAPI } from "../../services/api";

type RequestStatus = "pending" | "approved" | "rejected";

type Proposal = {
  _id: string;
  title: string;
  description: string;
  groupNo?: string;
  status: RequestStatus;
  techStack?: string[];
  submittedBy?: { name: string; email: string };
  teamMembers?: any[];
  createdAt: string;
};

const statusCfg: Record<RequestStatus, { label: string; color: string; bg: string; border: string }> = {
  pending: { label: "Pending Review", color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.25)" },
  approved: { label: "Accepted", color: "#10b981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.25)" },
  rejected: { label: "Rejected", color: "#ef4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.25)" },
};

export function SupervisorRequests() {
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [requests, setRequests] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rejectConfirmId, setRejectConfirmId] = useState<string | null>(null);
  const { searchQuery } = useOutletContext<{ searchQuery: string }>();

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await supervisorAPI.getRequests() as { success: boolean; data: Proposal[] };
      setRequests(res.data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const filtered = filter === "all" ? requests : requests.filter((r) => r.status === filter);
  const searchFiltered = filtered.filter((r) => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (r.groupNo && r.groupNo.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAction = async (id: string, action: "accept" | "reject") => {
    try {
      if (action === "accept") await supervisorAPI.acceptRequest(id);
      else await supervisorAPI.rejectRequest(id);
      
      setRequests((prev) => prev.map((r) => (r._id === id ? { ...r, status: action === "accept" ? "approved" : "rejected" } : r)));
      setExpanded(null);
      if (action === "reject") setRejectConfirmId(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : `Failed to ${action} request.`);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <RefreshCw size={24} className="text-fyp-blue animate-spin mx-auto mb-3" />
          <p className="text-fyp-text-secondary text-sm">Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="Request Management"
        subtitle="Review and respond to student supervision requests."
        action={
          <div className="flex gap-2">
            {[
              { key: "all", label: "All" },
              { key: "pending", label: "Pending" },
              { key: "approved", label: "Accepted" },
              { key: "rejected", label: "Rejected" },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className="px-3 py-1.5 rounded-xl text-xs transition-all"
                style={{
                  backgroundColor: filter === f.key ? "#3b7fe8" : "var(--fyp-bg-card)",
                  color: filter === f.key ? "white" : "var(--fyp-text-secondary)",
                  border: filter === f.key ? "none" : "1px solid var(--fyp-border)",
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        }
      />

      {error && (
        <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/30 text-red-400 text-sm flex gap-2 items-center">
          {error}
          <button onClick={fetchRequests} className="ml-auto text-xs underline">Retry</button>
        </div>
      )}

      {/* Summary Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <StatCardSimple label="Pending" value={requests.filter((r) => r.status === "pending").length} color="#f59e0b" />
        <StatCardSimple label="Accepted Groups" value={requests.filter((r) => r.status === "approved").length} color="#10b981" />
        <StatCardSimple label="Rejected" value={requests.filter((r) => r.status === "rejected").length} color="#ef4444" />
      </div>

      {/* Request Cards */}
      {searchFiltered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No supervision requests"
          description="Student supervision requests will appear here when groups submit proposals."
        />
      ) : (
        <div className="space-y-4">
          {searchFiltered.map((req) => {
            const cfg = statusCfg[req.status];
            const isExpanded = expanded === req._id;

            return (
              <div
                key={req._id}
                className="rounded-2xl overflow-hidden transition-all bg-fyp-card"
                style={{ border: `1px solid ${req.status === "pending" ? cfg.border : "var(--fyp-border)"}` }}
              >
                <div
                  className="p-5 flex items-start gap-4 cursor-pointer"
                  onClick={() => setExpanded(isExpanded ? null : req._id)}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-fyp-elevated">
                    <span className="text-fyp-blue text-xs font-bold">{req.groupNo || "—"}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-[15px] font-semibold text-fyp-text">{req.title}</h3>
                      <span
                        className="px-2 py-0.5 rounded-lg text-[11px]"
                        style={{ backgroundColor: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
                      >
                        {cfg.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 flex-wrap">
                      <div className="flex items-center gap-1">
                        <Users size={11} className="text-fyp-text-muted" />
                        <span className="text-xs text-fyp-text-muted">{req.submittedBy?.name || "Unknown"} · {req.teamMembers?.length || 1} members</span>
                      </div>
                      <span className="text-xs text-fyp-text-muted">{req.techStack?.join(", ") || "General"}</span>
                      <span className="text-xs text-fyp-text-muted">Requested {new Date(req.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <ChevronRight
                    size={16}
                    className="text-fyp-text-muted transition-transform flex-shrink-0"
                    style={{ transform: isExpanded ? "rotate(90deg)" : "none" }}
                  />
                </div>

                {isExpanded && (
                  <div className="border-t border-fyp-border">
                    <div className="p-5 space-y-4">
                      <div className="p-4 rounded-xl bg-fyp-elevated">
                        <p className="text-[13px] text-fyp-text-secondary leading-relaxed">{req.description}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-fyp-elevated border border-fyp-border">
                          <Mail size={13} className="text-fyp-text-muted" />
                          <span className="text-[13px] text-fyp-text-secondary">{req.submittedBy?.email || "No email"}</span>
                        </div>
                      </div>

                      {req.status === "pending" && (
                        <div className="flex gap-3">
                          <button
                            onClick={() => setRejectConfirmId(req._id)}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm transition-all hover:opacity-80 bg-fyp-red/10 text-fyp-red border border-fyp-red/25"
                          >
                            <XCircle size={15} />
                            Reject Request
                          </button>
                          <button
                            onClick={() => handleAction(req._id, "accept")}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm transition-all hover:opacity-90 bg-fyp-green text-white"
                          >
                            <CheckCircle2 size={15} />
                            Accept Supervision
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Reject Confirmation Modal */}
      <Modal
        open={rejectConfirmId !== null}
        onClose={() => setRejectConfirmId(null)}
        title="Reject Supervision Request"
        subtitle="Are you sure you want to reject this proposal?"
        footer={<>
          <button onClick={() => setRejectConfirmId(null)} className="flex-1 py-2.5 rounded-xl text-sm bg-fyp-elevated text-fyp-text-secondary border border-fyp-border">Cancel</button>
          <button onClick={() => { if (rejectConfirmId) handleAction(rejectConfirmId, "reject"); }} className="flex-1 py-2.5 rounded-xl text-sm hover:opacity-90 bg-fyp-red text-white font-semibold">Reject Request</button>
        </>}
      >
        <p className="text-[13px] text-fyp-text-secondary mb-4">The student group will be notified and can resubmit their proposal to another supervisor.</p>
      </Modal>
    </div>
  );
}
