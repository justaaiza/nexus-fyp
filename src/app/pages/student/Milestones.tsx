import { useState } from "react";
import { Upload, CheckCircle2, Clock, Lock, FileText, CloudUpload, AlertCircle } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { Modal } from "../../components/Modal";
import { EmptyState } from "../../components/EmptyState";
import { studentMilestonesDemo } from "../../data/demoData";

type MilestoneStatus = "submitted" | "graded" | "pending" | "locked";

type Milestone = {
  id: number;
  title: string;
  description: string;
  deadline: string;
  status: MilestoneStatus;
  grade: string | null;
  file: string | null;
  fileSize: string | null;
  types: string[];
};

const statusConfig: Record<MilestoneStatus, { icon: React.ElementType; color: string; bg: string; border: string; label: string }> = {
  submitted: { icon: CheckCircle2, color: "#3b7fe8", bg: "rgba(59,127,232,0.1)", border: "rgba(59,127,232,0.25)", label: "Submitted" },
  graded: { icon: CheckCircle2, color: "#10b981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.25)", label: "Graded" },
  pending: { icon: Clock, color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.25)", label: "Due Soon" },
  locked: { icon: Lock, color: "#5a6478", bg: "rgba(90,100,120,0.1)", border: "rgba(90,100,120,0.2)", label: "Locked" },
};

const milestones: Milestone[] = studentMilestonesDemo as Milestone[];

export function StudentMilestones() {
  const [uploadModal, setUploadModal] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const activeMilestone = milestones.find((m) => m.id === uploadModal);
  const completedCount = milestones.filter((m) => m.status === "submitted" || m.status === "graded").length;
  const totalCount = milestones.length;

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="Milestone Submissions"
        subtitle="Upload deliverables before the deadline. Files accepted: PDF, ZIP, MP4."
      />

      {/* Progress Bar */}
      {totalCount > 0 && (
        <div className="p-4 rounded-2xl bg-fyp-card border border-fyp-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] text-fyp-text-secondary">Overall Progress</span>
            <span className="text-[13px] text-fyp-blue font-semibold">{completedCount} / {totalCount} Completed</span>
          </div>
          <div className="w-full h-2 rounded-full overflow-hidden bg-fyp-elevated">
            <div
              className="h-2 rounded-full transition-all"
              style={{
                width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%`,
                background: "linear-gradient(90deg, #3b7fe8, #60a5fa)",
              }}
            />
          </div>
          <div className="flex items-center gap-4 mt-3">
            {(["submitted", "graded", "pending", "locked"] as MilestoneStatus[]).map((s) => {
              const cfg = statusConfig[s];
              const count = milestones.filter((m) => m.status === s).length;
              return (
                <div key={s} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.color }} />
                  <span className="text-xs text-fyp-text-muted">{cfg.label} ({count})</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Milestone List */}
      {milestones.length === 0 ? (
        <EmptyState
          icon={Upload}
          title="No milestones yet"
          description="Your milestone submissions will appear here once they are assigned by your supervisor."
        />
      ) : (
        <div className="space-y-4">
          {milestones.map((m, idx) => {
            const cfg = statusConfig[m.status];
            const Icon = cfg.icon;
            const isLocked = m.status === "locked";
            return (
              <div
                key={m.id}
                className="p-5 rounded-2xl transition-all bg-fyp-card"
                style={{
                  border: `1px solid ${isLocked ? "var(--fyp-border)" : cfg.border}`,
                  opacity: isLocked ? 0.65 : 1,
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: cfg.bg, border: `1px solid ${cfg.border}` }}
                  >
                    <span className="text-[13px] font-bold" style={{ color: cfg.color }}>
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-[15px] font-semibold text-fyp-text">{m.title}</h3>
                      <div
                        className="flex items-center gap-1 px-2 py-0.5 rounded-lg"
                        style={{ backgroundColor: cfg.bg, border: `1px solid ${cfg.border}` }}
                      >
                        <Icon size={11} color={cfg.color} />
                        <span className="text-[11px]" style={{ color: cfg.color }}>{cfg.label}</span>
                      </div>
                      {m.grade && (
                        <div className="px-2 py-0.5 rounded-lg bg-fyp-green/10 text-fyp-green text-[11px]">
                          Grade: {m.grade}
                        </div>
                      )}
                    </div>

                    <p className="text-[13px] text-fyp-text-secondary mt-1.5 leading-relaxed">{m.description}</p>

                    <div className="flex items-center gap-4 mt-3 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} className="text-fyp-text-muted" />
                        <span className="text-xs text-fyp-text-muted">Deadline: {m.deadline}</span>
                      </div>
                      <div className="flex gap-1">
                        {m.types.map((t) => (
                          <span key={t} className="px-1.5 py-0.5 rounded bg-fyp-elevated text-fyp-text-secondary text-[10px]">
                            .{t.toLowerCase()}
                          </span>
                        ))}
                      </div>
                    </div>

                    {m.file && (
                      <div className="flex items-center gap-2 mt-3 px-3 py-2 rounded-xl w-fit bg-fyp-elevated">
                        <FileText size={13} className="text-fyp-blue" />
                        <span className="text-xs text-fyp-text">{m.file}</span>
                        <span className="text-[11px] text-fyp-text-muted">({m.fileSize})</span>
                      </div>
                    )}
                  </div>

                  {/* Action */}
                  {!isLocked && (
                    <div className="flex-shrink-0">
                      {m.status === "pending" ? (
                        <button
                          onClick={() => setUploadModal(m.id)}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all hover:opacity-90 bg-fyp-blue text-white text-[13px]"
                        >
                          <Upload size={14} />
                          Upload
                        </button>
                      ) : (
                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-fyp-elevated text-fyp-text-secondary text-[13px] border border-fyp-border">
                          <FileText size={14} />
                          View
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Modal */}
      <Modal
        open={!!uploadModal && !!activeMilestone}
        onClose={() => setUploadModal(null)}
        title="Upload Deliverable"
        subtitle={activeMilestone?.title}
        footer={
          <>
            <button
              onClick={() => setUploadModal(null)}
              className="flex-1 py-2.5 rounded-xl text-sm bg-fyp-elevated text-fyp-text-secondary border border-fyp-border"
            >
              Cancel
            </button>
            <button className="flex-1 py-2.5 rounded-xl text-sm hover:opacity-90 transition-all bg-fyp-blue text-white">
              Submit Deliverable
            </button>
          </>
        }
      >
        {activeMilestone && (
          <>
            <div
              className="border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all"
              style={{
                borderColor: dragOver ? "#3b7fe8" : "var(--fyp-border)",
                backgroundColor: dragOver ? "rgba(59,127,232,0.05)" : "var(--fyp-bg-elevated)",
              }}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={() => setDragOver(false)}
            >
              <CloudUpload size={36} color={dragOver ? "#3b7fe8" : "var(--fyp-text-muted)"} />
              <p className="text-sm font-medium text-fyp-text mt-3">Drop your files here</p>
              <p className="text-xs text-fyp-text-muted mt-1">or click to browse — Max 50MB</p>
              <div className="flex gap-2 mt-3">
                {activeMilestone.types.map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded bg-fyp-card text-fyp-text-secondary text-[11px]">
                    .{t.toLowerCase()}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-start gap-2 mt-4 p-3 rounded-xl bg-fyp-amber/[.08] border border-fyp-amber/20">
              <AlertCircle size={14} className="text-fyp-amber mt-0.5 flex-shrink-0" />
              <p className="text-xs text-fyp-text-secondary leading-relaxed">
                Deadline: <span className="text-fyp-amber">{activeMilestone.deadline}</span>. Late submissions may be penalized.
              </p>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
