import { useState } from "react";
import { CheckCircle2, XCircle, Clock, Users, ChevronRight, Mail } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { StatCardSimple } from "../../components/StatCard";
import { EmptyState } from "../../components/EmptyState";
import { supervisorRequestsDemo } from "../../data/demoData";

type RequestStatus = "pending" | "accepted" | "rejected";

type Request = {
  id: number;
  groupNo: string;
  title: string;
  lead: string;
  roll: string;
  email: string;
  members: number;
  stack: string;
  abstract: string;
  status: RequestStatus;
  requestedDate: string;
};

const statusCfg: Record<RequestStatus, { label: string; color: string; bg: string; border: string }> = {
  pending: { label: "Pending Review", color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.25)" },
  accepted: { label: "Accepted", color: "#10b981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.25)" },
  rejected: { label: "Rejected", color: "#ef4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.25)" },
};

const initialRequests: Request[] = supervisorRequestsDemo as Request[];

export function SupervisorRequests() {
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [localReqs, setLocalReqs] = useState(initialRequests);

  const filtered = filter === "all" ? localReqs : localReqs.filter((r) => r.status === filter);

  const handleAction = (id: number, action: RequestStatus) => {
    setLocalReqs((prev) => prev.map((r) => (r.id === id ? { ...r, status: action } : r)));
    setExpanded(null);
  };

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
              { key: "accepted", label: "Accepted" },
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

      {/* Summary Row */}
      <div className="grid grid-cols-3 gap-4">
        <StatCardSimple label="Pending" value={localReqs.filter((r) => r.status === "pending").length} color="#f59e0b" />
        <StatCardSimple label="Accepted Groups" value={localReqs.filter((r) => r.status === "accepted").length} color="#10b981" />
        <StatCardSimple label="Rejected" value={localReqs.filter((r) => r.status === "rejected").length} color="#ef4444" />
      </div>

      {/* Request Cards */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No supervision requests"
          description="Student supervision requests will appear here when groups submit proposals."
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((req) => {
            const cfg = statusCfg[req.status];
            const isExpanded = expanded === req.id;

            return (
              <div
                key={req.id}
                className="rounded-2xl overflow-hidden transition-all bg-fyp-card"
                style={{ border: `1px solid ${req.status === "pending" ? cfg.border : "var(--fyp-border)"}` }}
              >
                <div
                  className="p-5 flex items-start gap-4 cursor-pointer"
                  onClick={() => setExpanded(isExpanded ? null : req.id)}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-fyp-elevated">
                    <span className="text-fyp-blue text-xs font-bold">{req.groupNo}</span>
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
                        <span className="text-xs text-fyp-text-muted">{req.lead} · {req.members} members</span>
                      </div>
                      <span className="text-xs text-fyp-text-muted">{req.stack}</span>
                      <span className="text-xs text-fyp-text-muted">Requested {req.requestedDate}</span>
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
                        <p className="text-[13px] text-fyp-text-secondary leading-relaxed">{req.abstract}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-fyp-elevated border border-fyp-border">
                          <Mail size={13} className="text-fyp-text-muted" />
                          <span className="text-[13px] text-fyp-text-secondary">{req.email}</span>
                        </div>
                      </div>

                      {req.status === "pending" && (
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleAction(req.id, "rejected")}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm transition-all hover:opacity-80 bg-fyp-red/10 text-fyp-red border border-fyp-red/25"
                          >
                            <XCircle size={15} />
                            Reject Request
                          </button>
                          <button
                            onClick={() => handleAction(req.id, "accepted")}
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
    </div>
  );
}
