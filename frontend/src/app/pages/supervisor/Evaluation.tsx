import { useState, useEffect } from "react";
import { CheckCircle2, ChevronRight, FileText, Download, User, MessageSquare, RefreshCw } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { StatCardSimple } from "../../components/StatCard";
import { EmptyState } from "../../components/EmptyState";
import { supervisorAPI } from "../../services/api";

type Submission = {
  _id: string;
  milestone: { _id: string; title: string; deadline: string; phase: string };
  group: { _id: string; groupNo: string; title: string };
  status: "pending" | "graded";
  fileUrl: string;
  submittedAt: string;
  feedback?: { grade: number; comment: string };
};

export function SupervisorEvaluation() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSub, setSelectedSub] = useState<string | null>(null);
  const [feedbackForm, setFeedbackForm] = useState({ grade: "", comment: "" });
  const [submitting, setSubmitting] = useState(false);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const res = await supervisorAPI.getSubmissions() as { success: boolean; data: Submission[] };
      setSubmissions(res.data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load submissions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSubmissions(); }, []);

  const handleSubmitFeedback = async (subId: string) => {
    if (!feedbackForm.grade || !feedbackForm.comment) return;
    try {
      setSubmitting(true);
      await supervisorAPI.submitFeedback(subId, {
        grade: Number(feedbackForm.grade),
        comment: feedbackForm.comment,
      });
      setSubmissions(prev => prev.map(s => s._id === subId ? { ...s, status: "graded", feedback: { grade: Number(feedbackForm.grade), comment: feedbackForm.comment } } : s));
      setFeedbackForm({ grade: "", comment: "" });
      setSelectedSub(null);
      alert("Feedback submitted successfully!");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to submit feedback.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <RefreshCw size={24} className="text-fyp-blue animate-spin mx-auto mb-3" />
          <p className="text-fyp-text-secondary text-sm">Loading evaluations...</p>
        </div>
      </div>
    );
  }

  const pending = submissions.filter((s) => s.status !== "graded");

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="Evaluations & Grading"
        subtitle="Review deliverables and provide feedback/grades to your groups."
      />

      {error && (
        <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/30 text-red-400 text-sm flex gap-2 items-center">
          {error}
          <button onClick={fetchSubmissions} className="ml-auto text-xs underline">Retry</button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCardSimple label="Pending Evaluation" value={pending.length} color="#f59e0b" />
        <StatCardSimple label="Graded" value={submissions.filter(s => s.status === "graded").length} color="#10b981" />
      </div>

      {submissions.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No submissions yet"
          description="Group submissions will appear here once they upload their deliverables."
        />
      ) : (
        <div className="space-y-4">
          {submissions.map((sub) => {
            const isExpanded = selectedSub === sub._id;

            return (
              <div key={sub._id} className="rounded-2xl overflow-hidden transition-all bg-fyp-card" style={{ border: `1px solid ${sub.status === "graded" ? "var(--fyp-border)" : "rgba(245,158,11,0.25)"}` }}>
                <div className="p-5 flex items-start gap-4 cursor-pointer" onClick={() => setSelectedSub(isExpanded ? null : sub._id)}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-fyp-elevated">
                    <span className="text-fyp-blue text-xs font-bold">{sub.group?.groupNo || "—"}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-[15px] font-semibold text-fyp-text">{sub.milestone?.title || "Milestone"}</h3>
                      {sub.status === "graded" ? (
                        <span className="px-2 py-0.5 rounded-lg text-[11px] bg-fyp-green/10 text-fyp-green border border-fyp-green/20">Graded: {sub.feedback?.grade}/100</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-lg text-[11px] bg-fyp-amber/10 text-fyp-amber border border-fyp-amber/20">Needs Grading</span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-1 flex-wrap">
                      <div className="flex items-center gap-1">
                        <User size={11} className="text-fyp-text-muted" />
                        <span className="text-xs text-fyp-text-muted">{sub.group?.title}</span>
                      </div>
                      <span className="text-xs text-fyp-text-muted">Submitted {new Date(sub.submittedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <ChevronRight size={16} className="text-fyp-text-muted transition-transform flex-shrink-0" style={{ transform: isExpanded ? "rotate(90deg)" : "none" }} />
                </div>

                {isExpanded && (
                  <div className="border-t border-fyp-border">
                    <div className="p-5 flex flex-col md:flex-row gap-6">
                      <div className="flex-1 space-y-4">
                        <div className="p-4 rounded-xl bg-fyp-elevated border border-fyp-border flex items-center justify-between">
                          <div>
                            <p className="text-[13px] font-medium text-fyp-text flex items-center gap-2"><FileText size={14} className="text-fyp-blue" /> Deliverable File</p>
                            <p className="text-xs text-fyp-text-muted mt-0.5">Ready for download</p>
                          </div>
                          {sub.fileUrl && (
                            <a href={`http://localhost:5000${sub.fileUrl}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-fyp-card text-fyp-text-secondary border border-fyp-border hover:opacity-80">
                              <Download size={13} /> Download
                            </a>
                          )}
                        </div>

                        {sub.status === "graded" && sub.feedback && (
                          <div className="p-4 rounded-xl bg-fyp-elevated border border-fyp-border">
                            <div className="flex items-center gap-2 mb-2">
                              <MessageSquare size={13} className="text-fyp-green" />
                              <span className="text-[13px] font-medium text-fyp-text-secondary">Your Feedback</span>
                            </div>
                            <p className="text-[13px] text-fyp-text-secondary leading-relaxed">{sub.feedback.comment}</p>
                          </div>
                        )}
                      </div>

                      {sub.status !== "graded" && (
                        <div className="w-full md:w-[320px] p-4 rounded-xl bg-fyp-elevated border border-fyp-border">
                          <h4 className="text-[13px] font-semibold text-fyp-text mb-4">Submit Evaluation</h4>
                          <div className="space-y-4">
                            <div>
                              <label className="text-[11px] text-fyp-text-secondary block mb-1.5 uppercase tracking-wide">Grade (0-100)</label>
                              <input type="number" min="0" max="100" value={feedbackForm.grade} onChange={(e) => setFeedbackForm({ ...feedbackForm, grade: e.target.value })} className="w-full px-3 py-2 rounded-lg outline-none bg-fyp-card border border-fyp-border text-fyp-text text-[13px]" placeholder="e.g. 85" />
                            </div>
                            <div>
                              <label className="text-[11px] text-fyp-text-secondary block mb-1.5 uppercase tracking-wide">Feedback Comment</label>
                              <textarea value={feedbackForm.comment} onChange={(e) => setFeedbackForm({ ...feedbackForm, comment: e.target.value })} rows={3} className="w-full px-3 py-2 rounded-lg outline-none resize-none bg-fyp-card border border-fyp-border text-fyp-text text-[13px]" placeholder="Detailed feedback..." />
                            </div>
                            <button onClick={() => handleSubmitFeedback(sub._id)} disabled={!feedbackForm.grade || !feedbackForm.comment || submitting} className="w-full py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all hover:opacity-90 bg-fyp-green text-white text-[13px] font-medium disabled:opacity-50">
                              <CheckCircle2 size={15} /> {submitting ? "Submitting..." : "Submit Grade"}
                            </button>
                          </div>
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
