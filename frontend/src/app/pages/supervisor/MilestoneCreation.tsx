import { useState, useEffect, useMemo } from "react";
import { CalendarPlus, Trash2, Plus, Clock, RefreshCw, Users } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { StatCardSimple } from "../../components/StatCard";
import { Modal } from "../../components/Modal";
import { EmptyState } from "../../components/EmptyState";
import { supervisorAPI } from "../../services/api";

type MilestonePhase = "FYP-1" | "FYP-2";
type MilestoneType = "document" | "defence" | "code";

type Milestone = {
  _id: string;
  title: string;
  description: string;
  deadline: string;
  phase: string;
  type: string;
  assignedTo?: { _id: string; name: string; email?: string; rollNumber?: string }[];
};

type SuperviseeProposal = {
  _id: string;
  title: string;
  status: "pending" | "approved" | "rejected";
  submittedBy?: { _id: string; name: string; email?: string };
  teamMembers?: { _id: string; name: string }[];
};

type AssignableProposal = {
  _id: string;
  title: string;
  studentIds: string[];
  studentNames: string[];
};

const typeColors: Record<MilestoneType, { color: string; bg: string }> = {
  document: { color: "#3b7fe8", bg: "rgba(59,127,232,0.1)" },
  defence: { color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
  code: { color: "#8b5cf6", bg: "rgba(139,92,246,0.1)" },
};

function collectApprovedProposals(proposals: SuperviseeProposal[]): AssignableProposal[] {
  return proposals
    .filter((p) => p.status === "approved")
    .map((p) => {
      const studentIds: string[] = [];
      const studentNames: string[] = [];
      if (p.submittedBy?._id) {
        studentIds.push(p.submittedBy._id);
        studentNames.push(p.submittedBy.name);
      }
      for (const m of p.teamMembers || []) {
        if (m._id) {
          studentIds.push(m._id);
          studentNames.push(m.name);
        }
      }
      return {
        _id: p._id,
        title: p.title.length > 48 ? `${p.title.slice(0, 48)}…` : p.title,
        studentIds,
        studentNames,
      };
    });
}

export function SupervisorMilestones() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [proposals, setProposals] = useState<SuperviseeProposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    deadline: "",
    phase: "FYP-1" as MilestonePhase,
    type: "document" as MilestoneType,
    selectedProposals: [] as string[],
  });

  const approvedProposals = useMemo(() => collectApprovedProposals(proposals), [proposals]);
  
  // Compute assignedTo (all students from selected proposals)
  const assignedTo = useMemo(() => {
    const studentIds: string[] = [];
    for (const propId of form.selectedProposals) {
      const prop = approvedProposals.find((p) => p._id === propId);
      if (prop) {
        studentIds.push(...prop.studentIds);
      }
    }
    return studentIds;
  }, [form.selectedProposals, approvedProposals]);

  const fetchAll = async () => {
    try {
      setLoading(true);
      setError("");
      const [milestonesRes, requestsRes] = await Promise.all([
        supervisorAPI.getMilestones() as { success: boolean; data: Milestone[] },
        supervisorAPI.getRequests() as { success: boolean; data: SuperviseeProposal[] },
      ]);
      setMilestones(milestonesRes.data || []);
      setProposals(requestsRes.data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const toggleProposal = (propId: string) => {
    setForm((f) => ({
      ...f,
      selectedProposals: f.selectedProposals.includes(propId)
        ? f.selectedProposals.filter((x) => x !== propId)
        : [...f.selectedProposals, propId],
    }));
  };

  const handleCreate = async () => {
    const title = form.title.trim();
    const description = form.description.trim();
    if (!title || !form.deadline) {
      alert("Title and deadline are required.");
      return;
    }
    if (description.length < 5) {
      alert("Description must be at least 5 characters (required by the server).");
      return;
    }
    if (form.selectedProposals.length === 0) {
      alert("Select at least one proposal to assign this milestone to.");
      return;
    }
    if (approvedProposals.length === 0) {
      alert("You have no accepted supervision requests yet. Accept a proposal under Request Management first.");
      return;
    }
    const deadlineIso = form.deadline.includes("T")
      ? new Date(form.deadline).toISOString()
      : new Date(`${form.deadline}T12:00:00`).toISOString();

    try {
      setSubmitting(true);
      const res = (await supervisorAPI.createMilestone({
        title,
        description,
        deadline: deadlineIso,
        phase: form.phase,
        type: form.type,
        assignedTo,
      })) as { success: boolean; data: Milestone };
      setMilestones((prev) => [...prev, res.data]);
      setForm({ title: "", description: "", deadline: "", phase: "FYP-1", type: "document", selectedProposals: [] });
      setShowForm(false);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to create milestone.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this milestone?")) return;
    try {
      await supervisorAPI.deleteMilestone(id);
      setMilestones((prev) => prev.filter((m) => m._id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete milestone.");
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <RefreshCw size={24} className="text-fyp-blue animate-spin mx-auto mb-3" />
          <p className="text-fyp-text-secondary text-sm">Loading milestones...</p>
        </div>
      </div>
    );
  }

  const activeMilestones = milestones.filter((m) => new Date(m.deadline) >= new Date());

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="Milestone Creation"
        subtitle="Set deadlines and tasks for students on proposals you have accepted."
        action={
          <button
            onClick={() => {
              setForm({ title: "", description: "", deadline: "", phase: "FYP-1", type: "document", selectedProposals: [] });
              setShowForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all hover:opacity-90 bg-fyp-green text-white text-sm"
          >
            <Plus size={15} />
            New Milestone
          </button>
        }
      />

      {error && (
        <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/30 text-red-400 text-sm flex gap-2 items-center">
          {error}
          <button type="button" onClick={fetchAll} className="ml-auto text-xs underline">
            Retry
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <StatCardSimple label="Total Milestones" value={milestones.length} color="#3b7fe8" />
        <StatCardSimple label="Active Now" value={activeMilestones.length} color="#f59e0b" />
        <StatCardSimple label="Accepted Groups" value={approvedProposals.length} color="#10b981" />
      </div>

      {milestones.length === 0 ? (
        <EmptyState
          icon={CalendarPlus}
          title="No milestones created"
          description="Create a milestone for students you supervise. Select a phase (Document, Defence, or Code) and assign at least one proposal."
        />
      ) : (
        <div className="space-y-4">
          {milestones.map((m) => {
            const tc = typeColors[m.type as MilestoneType] || typeColors.document;
            const daysLeft = Math.ceil((new Date(m.deadline).getTime() - Date.now()) / 86400000);
            const isPast = daysLeft < 0;
            const assignees = m.assignedTo || [];

            return (
              <div key={m._id} className="p-5 rounded-2xl bg-fyp-card border border-fyp-border">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: tc.bg }}>
                    <CalendarPlus size={17} color={tc.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-[15px] font-semibold text-fyp-text">{m.title}</h3>
                      <span className="px-2 py-0.5 rounded-lg text-[11px] bg-fyp-elevated text-fyp-text-muted border border-fyp-border">
                        {m.phase}
                      </span>
                      <span className="px-2 py-0.5 rounded-lg text-[11px]" style={{ backgroundColor: tc.bg, color: tc.color }}>
                        {m.type}
                      </span>
                      {isPast ? (
                        <span className="px-2 py-0.5 rounded-lg text-[11px] bg-fyp-elevated text-fyp-text-muted border border-fyp-border">Past</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-lg text-[11px] bg-fyp-amber/10 text-fyp-amber">Active</span>
                      )}
                    </div>
                    <p className="text-[13px] text-fyp-text-secondary mt-1.5 leading-relaxed">{m.description}</p>
                    {assignees.length > 0 && (
                      <p className="text-[12px] text-fyp-text-muted mt-2 flex items-center gap-1.5">
                        <Users size={12} />
                        Assigned: {assignees.map((a) => a.name).join(", ")}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-3 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} className="text-fyp-text-muted" />
                        <span className="text-xs text-fyp-text-muted">
                          {new Date(m.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                          {daysLeft > 0 && (
                            <span style={{ color: daysLeft < 7 ? "#f59e0b" : "inherit", marginLeft: "6px" }}>({daysLeft}d left)</span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => handleDelete(m._id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-red-950/30 border border-fyp-border"
                    >
                      <Trash2 size={13} className="text-fyp-red" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        title="Create New Milestone"
        maxWidth="max-w-lg"
        footer={
          <>
            <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl text-sm bg-fyp-elevated text-fyp-text-secondary border border-fyp-border">
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreate}
              disabled={submitting || approvedProposals.length === 0}
              className="flex-1 py-2.5 rounded-xl text-sm hover:opacity-90 bg-fyp-green text-white disabled:opacity-60"
            >
              {submitting ? "Creating..." : "Create Milestone"}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          {approvedProposals.length === 0 ? (
            <p className="text-[13px] text-fyp-text-secondary">
              No proposals available yet. Accept at least one supervision request under{" "}
              <strong className="text-fyp-text">Request Management</strong>, then return here to create milestones.
            </p>
          ) : (
            <>
              <div>
                <label className="text-[13px] text-fyp-text-secondary block mb-1.5">Title *</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. SDS submission"
                  className="w-full px-4 py-3 rounded-xl outline-none bg-fyp-elevated border border-fyp-border text-fyp-text text-[13px]"
                />
              </div>
              <div>
                <label className="text-[13px] text-fyp-text-secondary block mb-1.5">Description * (min 5 characters)</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="What students must deliver..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl outline-none resize-none bg-fyp-elevated border border-fyp-border text-fyp-text text-[13px]"
                />
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[13px] text-fyp-text-secondary block mb-1.5">Deadline *</label>
                  <input
                    type="date"
                    value={form.deadline}
                    onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl outline-none bg-fyp-elevated border border-fyp-border text-fyp-text text-[13px]"
                  />
                </div>
                <div>
                  <label className="text-[13px] text-fyp-text-secondary block mb-1.5">Phase *</label>
                  <select
                    value={form.phase}
                    onChange={(e) => setForm({ ...form, phase: e.target.value as MilestonePhase })}
                    className="w-full px-4 py-3 rounded-xl outline-none bg-fyp-elevated border border-fyp-border text-fyp-text text-[13px]"
                  >
                    <option value="FYP-1">FYP-1</option>
                    <option value="FYP-2">FYP-2</option>
                  </select>
                </div>
                <div>
                  <label className="text-[13px] text-fyp-text-secondary block mb-1.5">Type *</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value as MilestoneType })}
                    className="w-full px-4 py-3 rounded-xl outline-none bg-fyp-elevated border border-fyp-border text-fyp-text text-[13px]"
                  >
                    <option value="document">Document</option>
                    <option value="defence">Defence</option>
                    <option value="code">Code</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[13px] text-fyp-text-secondary block mb-2">Assign to proposals *</label>
                <div className="space-y-2 max-h-48 overflow-y-auto rounded-xl border border-fyp-border p-2 bg-fyp-elevated/50">
                  {approvedProposals.map((p) => (
                    <label key={p._id} className="flex items-start gap-3 px-2 py-2 rounded-lg cursor-pointer hover:bg-fyp-elevated">
                      <input type="checkbox" checked={form.selectedProposals.includes(p._id)} onChange={() => toggleProposal(p._id)} className="mt-0.5" />
                      <span className="text-[13px] text-fyp-text">
                        {p.title}
                        <span className="block text-[11px] text-fyp-text-muted">{p.studentNames.join(", ")}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}
