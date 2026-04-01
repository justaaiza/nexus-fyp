import { useState } from "react";
import { CalendarPlus, Trash2, Edit3, Plus, Clock, Users } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { StatCardSimple } from "../../components/StatCard";
import { Modal } from "../../components/Modal";
import { EmptyState } from "../../components/EmptyState";
import { supervisorGroupsDemo, supervisorMilestonesDemo } from "../../data/demoData";

type MilestoneType = "Document" | "Defense" | "Code";
type MilestoneStatus = "past" | "active" | "upcoming";

type Milestone = {
  id: number;
  title: string;
  description: string;
  deadline: string;
  groups: string[];
  submittedCount: number;
  type: MilestoneType;
  status: MilestoneStatus;
};

const typeColors: Record<MilestoneType, { color: string; bg: string }> = {
  Document: { color: "#3b7fe8", bg: "rgba(59,127,232,0.1)" },
  Defense: { color: "#8b5cf6", bg: "rgba(139,92,246,0.1)" },
  Code: { color: "#10b981", bg: "rgba(16,185,129,0.1)" },
};

const statusCfg: Record<MilestoneStatus, { label: string; color: string; bg: string }> = {
  past: { label: "Past", color: "#5a6478", bg: "rgba(90,100,120,0.1)" },
  active: { label: "Active", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
  upcoming: { label: "Upcoming", color: "#3b7fe8", bg: "rgba(59,127,232,0.1)" },
};

const groups: string[] = supervisorGroupsDemo;
const initialMilestones: Milestone[] = supervisorMilestonesDemo as Milestone[];

export function SupervisorMilestones() {
  const [milestones, setMilestones] = useState(initialMilestones);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    deadline: "",
    type: "Document" as MilestoneType,
    groups: [] as string[],
  });

  const handleCreate = () => {
    if (!form.title || !form.deadline) return;
    setMilestones((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        title: form.title,
        description: form.description,
        deadline: form.deadline,
        groups: form.groups.length > 0 ? form.groups : groups,
        submittedCount: 0,
        type: form.type,
        status: "upcoming",
      },
    ]);
    setForm({ title: "", description: "", deadline: "", type: "Document", groups: [] });
    setShowForm(false);
  };

  const toggleGroup = (g: string) => {
    setForm((prev) => ({
      ...prev,
      groups: prev.groups.includes(g) ? prev.groups.filter((x) => x !== g) : [...prev.groups, g],
    }));
  };

  const handleDelete = (id: number) => {
    setMilestones((prev) => prev.filter((m) => m.id !== id));
  };

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

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatCardSimple label="Total Milestones" value={milestones.length} color="#3b7fe8" />
        <StatCardSimple label="Active Now" value={milestones.filter((m) => m.status === "active").length} color="#f59e0b" />
        <StatCardSimple label="Groups Supervised" value={groups.length} color="#10b981" />
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
            const tc = typeColors[m.type] || typeColors.Document;
            const sc = statusCfg[m.status];
            const daysLeft = Math.ceil((new Date(m.deadline).getTime() - Date.now()) / 86400000);
            return (
              <div key={m.id} className="p-5 rounded-2xl bg-fyp-card border border-fyp-border">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: tc.bg }}>
                    <CalendarPlus size={17} color={tc.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-[15px] font-semibold text-fyp-text">{m.title}</h3>
                      <span className="px-2 py-0.5 rounded-lg text-[11px]" style={{ backgroundColor: tc.bg, color: tc.color }}>{m.type}</span>
                      <span className="px-2 py-0.5 rounded-lg text-[11px]" style={{ backgroundColor: sc.bg, color: sc.color }}>{sc.label}</span>
                    </div>
                    <p className="text-[13px] text-fyp-text-secondary mt-1.5 leading-relaxed">{m.description}</p>
                    <div className="flex items-center gap-4 mt-3 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} className="text-fyp-text-muted" />
                        <span className="text-xs text-fyp-text-muted">
                          {new Date(m.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                          {daysLeft > 0 && m.status !== "past" && (
                            <span style={{ color: daysLeft < 7 ? "#f59e0b" : "inherit", marginLeft: "6px" }}>({daysLeft}d left)</span>
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users size={12} className="text-fyp-text-muted" />
                        <span className="text-xs text-fyp-text-muted">{m.submittedCount}/{m.groups.length} submitted</span>
                      </div>
                      <div className="flex gap-1">
                        {m.groups.map((g) => (
                          <span key={g} className="px-1.5 py-0.5 rounded bg-fyp-elevated text-fyp-text-secondary text-[10px]">{g}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-fyp-elevated border border-fyp-border">
                      <Edit3 size={13} className="text-fyp-text-secondary" />
                    </button>
                    <button onClick={() => handleDelete(m.id)} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-red-950/30 border border-fyp-border">
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
            <button onClick={handleCreate} className="flex-1 py-2.5 rounded-xl text-sm hover:opacity-90 bg-fyp-green text-white">Create Milestone</button>
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[13px] text-fyp-text-secondary block mb-1.5">Deadline *</label>
              <input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} className="w-full px-4 py-3 rounded-xl outline-none bg-fyp-elevated border border-fyp-border text-fyp-text text-[13px]" />
            </div>
            <div>
              <label className="text-[13px] text-fyp-text-secondary block mb-1.5">Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as MilestoneType })} className="w-full px-4 py-3 rounded-xl outline-none bg-fyp-elevated border border-fyp-border text-fyp-text text-[13px]">
                <option>Document</option>
                <option>Defense</option>
                <option>Code</option>
              </select>
            </div>
          </div>
          {groups.length > 0 && (
            <div>
              <label className="text-[13px] text-fyp-text-secondary block mb-2">Assign to Groups</label>
              <div className="flex gap-2 flex-wrap">
                {groups.map((g) => (
                  <button key={g} onClick={() => toggleGroup(g)} className="px-3 py-1.5 rounded-lg text-xs transition-all" style={{
                    backgroundColor: form.groups.includes(g) ? "rgba(16,185,129,0.1)" : "var(--fyp-bg-elevated)",
                    color: form.groups.includes(g) ? "#10b981" : "var(--fyp-text-secondary)",
                    border: `1px solid ${form.groups.includes(g) ? "rgba(16,185,129,0.3)" : "var(--fyp-border)"}`,
                  }}>{g}</button>
                ))}
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
