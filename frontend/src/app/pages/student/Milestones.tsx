import { useState, useEffect, useRef } from "react";
import { Upload, CheckCircle2, Clock, Lock, FileText, CloudUpload, AlertCircle, RefreshCw } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { Modal } from "../../components/Modal";
import { EmptyState } from "../../components/EmptyState";
import { studentAPI } from "../../services/api";

type MilestoneStatus = "submitted" | "graded" | "pending" | "locked";

type Milestone = {
  _id: string;
  title: string;
  description: string;
  deadline: string;
  phase: string;
  acceptedTypes?: string[];
};

const statusConfig: Record<MilestoneStatus, { icon: React.ElementType; color: string; bg: string; border: string; label: string }> = {
  submitted: { icon: CheckCircle2, color: "#3b7fe8", bg: "rgba(59,127,232,0.1)", border: "rgba(59,127,232,0.25)", label: "Submitted" },
  graded: { icon: CheckCircle2, color: "#10b981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.25)", label: "Graded" },
  pending: { icon: Clock, color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.25)", label: "Due Soon" },
  locked: { icon: Lock, color: "#5a6478", bg: "rgba(90,100,120,0.1)", border: "rgba(90,100,120,0.2)", label: "Locked" },
};

function getMilestoneStatus(milestone: Milestone): MilestoneStatus {
  const deadline = new Date(milestone.deadline);
  const now = new Date();
  if (deadline < now) return "locked";
  const diff = deadline.getTime() - now.getTime();
  if (diff < 7 * 24 * 60 * 60 * 1000) return "pending"; // within 7 days
  return "pending";
}

export function StudentMilestones() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploadModal, setUploadModal] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMilestones = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await studentAPI.getMilestones() as { success: boolean; data: Milestone[] };
      setMilestones(res.data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load milestones.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMilestones(); }, []);

  const activeMilestone = milestones.find((m) => m._id === uploadModal);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !uploadModal) return;
    try {
      setUploading(true);
      await studentAPI.submitDeliverable(uploadModal, selectedFile);
      setUploadModal(null);
      setSelectedFile(null);
      alert("Deliverable submitted successfully!");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
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

  const totalCount = milestones.length;

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="Milestone Submissions"
        subtitle="Upload deliverables before the deadline. Files accepted: PDF, ZIP, MP4."
      />

      {error && (
        <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/30 text-red-400 text-sm flex gap-2 items-center">
          {error}
          <button onClick={fetchMilestones} className="ml-auto text-xs underline">Retry</button>
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
            const status = getMilestoneStatus(m);
            const cfg = statusConfig[status];
            const Icon = cfg.icon;
            const isLocked = status === "locked";
            const types = m.acceptedTypes || ["pdf"];
            return (
              <div
                key={m._id}
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
                    </div>

                    <p className="text-[13px] text-fyp-text-secondary mt-1.5 leading-relaxed">{m.description}</p>

                    <div className="flex items-center gap-4 mt-3 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} className="text-fyp-text-muted" />
                        <span className="text-xs text-fyp-text-muted">Deadline: {new Date(m.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                      </div>
                      <div className="flex gap-1">
                        {types.map((t) => (
                          <span key={t} className="px-1.5 py-0.5 rounded bg-fyp-elevated text-fyp-text-secondary text-[10px]">.{t.toLowerCase()}</span>
                        ))}
                      </div>
                      <span className="text-[11px] text-fyp-text-muted">Phase: {m.phase}</span>
                    </div>
                  </div>

                  {/* Action */}
                  {!isLocked && (
                    <div className="flex-shrink-0">
                      <button
                        onClick={() => { setUploadModal(m._id); setSelectedFile(null); }}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all hover:opacity-90 bg-fyp-blue text-white text-[13px]"
                      >
                        <Upload size={14} />
                        Upload
                      </button>
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
        onClose={() => { setUploadModal(null); setSelectedFile(null); }}
        title="Upload Deliverable"
        subtitle={activeMilestone?.title}
        footer={
          <>
            <button
              onClick={() => { setUploadModal(null); setSelectedFile(null); }}
              className="flex-1 py-2.5 rounded-xl text-sm bg-fyp-elevated text-fyp-text-secondary border border-fyp-border"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="flex-1 py-2.5 rounded-xl text-sm hover:opacity-90 transition-all bg-fyp-blue text-white disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Submit Deliverable"}
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
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.zip,.mp4"
                className="hidden"
                onChange={(e) => { if (e.target.files?.[0]) handleFileSelect(e.target.files[0]); }}
              />
              <CloudUpload size={36} color={dragOver ? "#3b7fe8" : "var(--fyp-text-muted)"} />
              {selectedFile ? (
                <>
                  <p className="text-sm font-medium text-fyp-text mt-3 flex items-center gap-2">
                    <FileText size={14} className="text-fyp-blue" /> {selectedFile.name}
                  </p>
                  <p className="text-xs text-fyp-text-muted mt-1">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </>
              ) : (
                <>
                  <p className="text-sm font-medium text-fyp-text mt-3">Drop your files here</p>
                  <p className="text-xs text-fyp-text-muted mt-1">or click to browse — Max 50MB</p>
                </>
              )}
              <div className="flex gap-2 mt-3">
                {(activeMilestone.acceptedTypes || ["pdf"]).map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded bg-fyp-card text-fyp-text-secondary text-[11px]">.{t.toLowerCase()}</span>
                ))}
              </div>
            </div>

            <div className="flex items-start gap-2 mt-4 p-3 rounded-xl bg-fyp-amber/[.08] border border-fyp-amber/20">
              <AlertCircle size={14} className="text-fyp-amber mt-0.5 flex-shrink-0" />
              <p className="text-xs text-fyp-text-secondary leading-relaxed">
                Deadline: <span className="text-fyp-amber">{new Date(activeMilestone.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>. Late submissions may be penalized.
              </p>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
