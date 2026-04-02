import { useState } from "react";
import { Megaphone, Plus, Pin, Trash2, GraduationCap, BookOpen, Users, Globe } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { Modal } from "../../components/Modal";
import { EmptyState } from "../../components/EmptyState";
import { adminAnnouncementsDemo } from "../../data/demoData";

type Audience = "all" | "students" | "supervisors" | "jury";

type Announcement = {
  id: number;
  title: string;
  body: string;
  audience: Audience;
  date: string;
  pinned: boolean;
  type: "info" | "warning" | "success";
};

const audienceConfig: Record<Audience, { icon: React.ElementType; label: string; color: string; bg: string }> = {
  all: { icon: Globe, label: "Everyone", color: "#3b7fe8", bg: "rgba(59,127,232,0.1)" },
  students: { icon: GraduationCap, label: "Students", color: "#10b981", bg: "rgba(16,185,129,0.1)" },
  supervisors: { icon: BookOpen, label: "Supervisors", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
  jury: { icon: Users, label: "Jury Members", color: "#8b5cf6", bg: "rgba(139,92,246,0.1)" },
};

const typeConfig = {
  info: { border: "var(--fyp-border)", accent: "#3b7fe8" },
  warning: { border: "rgba(245,158,11,0.3)", accent: "#f59e0b" },
  success: { border: "rgba(16,185,129,0.3)", accent: "#10b981" },
};

const initialAnnouncements: Announcement[] = adminAnnouncementsDemo as Announcement[];

export function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", body: "", audience: "all" as Audience, type: "info" as "info" | "warning" | "success" });

  const handleCreate = () => {
    if (!form.title || !form.body) return;
    setAnnouncements((prev) => [
      { id: prev.length + 1, ...form, date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), pinned: false },
      ...prev,
    ]);
    setForm({ title: "", body: "", audience: "all", type: "info" });
    setShowForm(false);
  };

  const togglePin = (id: number) => {
    setAnnouncements((prev) => prev.map((a) => (a.id === id ? { ...a, pinned: !a.pinned } : a)));
  };

  const deleteAnnouncement = (id: number) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  const sorted = [...announcements].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Announcements"
        subtitle="Post global updates for students, faculty, and jury members."
        action={
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl hover:opacity-90 transition-all bg-fyp-amber text-[#0d1117] text-sm font-semibold">
            <Plus size={15} /> New Post
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {(["all", "students", "supervisors", "jury"] as Audience[]).map((a) => {
          const cfg = audienceConfig[a];
          const Icon = cfg.icon;
          const count = announcements.filter((an) => an.audience === a).length;
          return (
            <div key={a} className="p-4 rounded-2xl flex items-center gap-3 bg-fyp-card border border-fyp-border">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: cfg.bg }}>
                <Icon size={14} color={cfg.color} />
              </div>
              <div>
                <p className="text-lg font-bold text-fyp-text">{count}</p>
                <p className="text-[11px] text-fyp-text-muted">{cfg.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Announcements */}
      {sorted.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title="No announcements"
          description="Click 'New Post' to publish announcements for students, faculty, or jury members."
        />
      ) : (
        <div className="space-y-4">
          {sorted.map((ann) => {
            const audienceCfg = audienceConfig[ann.audience];
            const AIcon = audienceCfg.icon;
            const tc = typeConfig[ann.type];

            return (
              <div key={ann.id} className="p-5 rounded-2xl bg-fyp-card" style={{ border: `1px solid ${tc.border}`, borderLeft: `3px solid ${tc.accent}` }}>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: `${tc.accent}15` }}>
                      <Megaphone size={16} color={tc.accent} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {ann.pinned && (
                          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-fyp-amber/10 text-fyp-amber">
                            <Pin size={9} /><span className="text-[10px]">Pinned</span>
                          </div>
                        )}
                        <h3 className="text-[15px] font-semibold text-fyp-text">{ann.title}</h3>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-fyp-text-muted">{ann.date}</span>
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg" style={{ backgroundColor: audienceCfg.bg }}>
                          <AIcon size={10} color={audienceCfg.color} />
                          <span className="text-[10px]" style={{ color: audienceCfg.color }}>{audienceCfg.label}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => togglePin(ann.id)} className="p-1.5 rounded-lg transition-all hover:bg-fyp-elevated" title={ann.pinned ? "Unpin" : "Pin"}>
                      <Pin size={13} color={ann.pinned ? "#f59e0b" : "var(--fyp-text-muted)"} />
                    </button>
                    <button onClick={() => deleteAnnouncement(ann.id)} className="p-1.5 rounded-lg transition-all hover:bg-red-950/30" title="Delete">
                      <Trash2 size={13} className="text-fyp-red" />
                    </button>
                  </div>
                </div>
                <p className="text-[13px] text-fyp-text-secondary leading-relaxed pl-12">{ann.body}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      <Modal open={showForm} onClose={() => setShowForm(false)} title="New Announcement" maxWidth="max-w-lg"
        footer={<>
          <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl text-sm bg-fyp-elevated text-fyp-text-secondary border border-fyp-border">Cancel</button>
          <button onClick={handleCreate} className="flex-1 py-2.5 rounded-xl text-sm hover:opacity-90 bg-fyp-amber text-[#0d1117] font-semibold">Publish Announcement</button>
        </>}
      >
        <div className="space-y-4">
          <div>
            <label className="text-[13px] text-fyp-text-secondary block mb-1.5">Title *</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Announcement title..." className="w-full px-4 py-3 rounded-xl outline-none bg-fyp-elevated border border-fyp-border text-fyp-text text-[13px]" />
          </div>
          <div>
            <label className="text-[13px] text-fyp-text-secondary block mb-1.5">Message *</label>
            <textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} placeholder="Write the full announcement here..." rows={4} className="w-full px-4 py-3 rounded-xl outline-none resize-none bg-fyp-elevated border border-fyp-border text-fyp-text text-[13px]" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[13px] text-fyp-text-secondary block mb-1.5">Audience</label>
              <select value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value as Audience })} className="w-full px-4 py-3 rounded-xl outline-none bg-fyp-elevated border border-fyp-border text-fyp-text text-[13px]">
                <option value="all">Everyone</option>
                <option value="students">Students</option>
                <option value="supervisors">Supervisors</option>
                <option value="jury">Jury Members</option>
              </select>
            </div>
            <div>
              <label className="text-[13px] text-fyp-text-secondary block mb-1.5">Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as "info" | "warning" | "success" })} className="w-full px-4 py-3 rounded-xl outline-none bg-fyp-elevated border border-fyp-border text-fyp-text text-[13px]">
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="success">Update</option>
              </select>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
