import { useState, useEffect } from "react";
import { CalendarPlus, Trash2, Edit3, Plus, Clock, Users, RefreshCw } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { StatCardSimple } from "../../components/StatCard";
import { Modal } from "../../components/Modal";
import { EmptyState } from "../../components/EmptyState";
import { supervisorAPI } from "../../services/api";

type MilestoneType = "Document" | "Defense" | "Code";

type Milestone = {
  _id: string;
  title: string;
  description: string;
  deadline: string;
  phase: string;
  assignedGroups?: any[];
};

const typeColors: Record<MilestoneType, { color: string; bg: string }> = {
  Document: { color: "#3b7fe8", bg: "rgba(59,127,232,0.1)" },
  Defense: { color: "#8b5cf6", bg: "rgba(139,92,246,0.1)" },
  Code: { color: "#10b981", bg: "rgba(16,185,129,0.1)" },
};

export function SupervisorMilestones() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    deadline: "",
    phase: "Document" as MilestoneType,
  });

  const fetchMilestones = async () => {
    try {
      setLoading(true);
      const res = await supervisorAPI.getMilestones() as { success: boolean; data: Milestone[] };
      setMilestones(res.data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load milestones.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMilestones(); }, []);

  const handleCreate = async () => {
    if (!form.title || !form.deadline) return;
    try {
      setSubmitting(true);
      const res = await supervisorAPI.createMilestone(form) as { success: boolean; data: Milestone };
      setMilestones((prev) => [...prev, res.data]);
      setForm({ title: "", description: "", deadline: "", phase: "Document" });
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

  const activeMilestones = milestones.filter(m => new Date(m.deadline) >= new Date());

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="Milestone Creation"
        subtitle="Set deadlines and tasks for your supervised groups."
        action={
          <button
            onClick={() => setShowForm(true)}
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
          <button onClick={fetchMilestones} className="ml-auto text-xs underline">Retry</button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <StatCardSimple label="Total Milestones" value={milestones.length} color="#3b7fe8" />
        <StatCardSimple label="Active Now" value={activeMilestones.length} color="#f59e0b" />
        <StatCardSimple label="Groups Supervised" value={milestones[0]?.assignedGroups?.length || 0} color="#10b981" />
      </div>

      {/* Milestone Cards */}
      {milestones.length === 0 ? (
        <EmptyState
          icon={CalendarPlus}
          title="No milestones created"
          description="Click 'New Milestone' to create deadlines and tasks for your supervised groups."
        />
      ) : (
        <div className="space-y-4">
          {milestones.map((m) => {
            const tc = typeColors[m.phase as MilestoneType] || typeColors.Document;
            const daysLeft = Math.ceil((new Date(m.deadline).getTime() - Date.now()) / 86400000);
            const isPast = daysLeft < 0;

            return (
              <div key={m._id} className="p-5 rounded-2xl bg-fyp-card border border-fyp-border">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: tc.bg }}>
                    <CalendarPlus size={17} color={tc.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-[15px] font-semibold text-fyp-text">{m.title}</h3>
                      <span className="px-2 py-0.5 rounded-lg text-[11px]" style={{ backgroundColor: tc.bg, color: tc.color }}>{m.phase || "Document"}</span>
                      {isPast ? (
                        <span className="px-2 py-0.5 rounded-lg text-[11px] bg-fyp-elevated text-fyp-text-muted border border-fyp-border">Past</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-lg text-[11px] bg-fyp-amber/10 text-fyp-amber">Active</span>
                      )}
                    </div>
                    <p className="text-[13px] text-fyp-text-secondary mt-1.5 leading-relaxed">{m.description}</p>
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
                    <button onClick={() => handleDelete(m._id)} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-red-950/30 border border-fyp-border">
                      <Trash2 size={13} className="text-fyp-red" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        title="Create New Milestone"
        maxWidth="max-w-lg"
        footer={
          <>
            <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl text-sm bg-fyp-elevated text-fyp-text-secondary border border-fyp-border">Cancel</button>
            <button onClick={handleCreate} disabled={submitting} className="flex-1 py-2.5 rounded-xl text-sm hover:opacity-90 bg-fyp-green text-white disabled:opacity-60">
              {submitting ? "Creating..." : "Create Milestone"}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="text-[13px] text-fyp-text-secondary block mb-1.5">Title *</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. SDS Submission" className="w-full px-4 py-3 rounded-xl outline-none bg-fyp-elevated border border-fyp-border text-fyp-text text-[13px]" />
          </div>
          <div>
            <label className="text-[13px] text-fyp-text-secondary block mb-1.5">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe what students need to submit..." rows={3} className="w-full px-4 py-3 rounded-xl outline-none resize-none bg-fyp-elevated border border-fyp-border text-fyp-text text-[13px]" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[13px] text-fyp-text-secondary block mb-1.5">Deadline *</label>
              <input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} className="w-full px-4 py-3 rounded-xl outline-none bg-fyp-elevated border border-fyp-border text-fyp-text text-[13px]" />
            </div>
            <div>
              <label className="text-[13px] text-fyp-text-secondary block mb-1.5">Phase / Type</label>
              <select value={form.phase} onChange={(e) => setForm({ ...form, phase: e.target.value as MilestoneType })} className="w-full px-4 py-3 rounded-xl outline-none bg-fyp-elevated border border-fyp-border text-fyp-text text-[13px]">
                <option value="Document">Document</option>
                <option value="Defense">Defense</option>
                <option value="Code">Code</option>
              </select>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
