import { useState, useEffect } from "react";
import { MessageSquare, Star, ChevronDown, ChevronUp, FileText, User, RefreshCw } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { Card } from "../../components/Card";
import { EmptyState } from "../../components/EmptyState";
import { studentAPI } from "../../services/api";

type RubricItem = {
  criteria: string;
  score: number;
  max: number;
  comment: string;
};

type FeedbackItem = {
  _id: string;
  comment: string;
  grade: number | null;
  overallFeedback?: string;
  rubric?: RubricItem[];
  createdAt: string;
  givenBy: { name: string; email: string; role: string };
  submission: {
    _id: string;
    status: string;
    fileUrl: string;
    milestone?: { title: string; deadline: string; phase: string };
  };
};

function GradeCircle({ score, max }: { score: number; max: number }) {
  const pct = (score / max) * 100;
  const circumference = 2 * Math.PI * 28;
  const strokeDash = (pct / 100) * circumference;
  const color = pct >= 90 ? "#10b981" : pct >= 75 ? "#3b7fe8" : pct >= 60 ? "#f59e0b" : "#ef4444";

  return (
    <div className="relative w-16 h-16 flex items-center justify-center">
      <svg width="64" height="64" className="-rotate-90" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="28" fill="none" stroke="#252d3d" strokeWidth="5" />
        <circle cx="32" cy="32" r="28" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" strokeDasharray={`${strokeDash} ${circumference}`} />
      </svg>
      <span className="absolute text-[13px] font-bold text-fyp-text">{score}</span>
    </div>
  );
}

export function StudentFeedback() {
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await studentAPI.getMyFeedback() as { success: boolean; data: FeedbackItem[] };
      setFeedbackItems(res.data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load feedback.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFeedback(); }, []);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <RefreshCw size={24} className="text-fyp-blue animate-spin mx-auto mb-3" />
          <p className="text-fyp-text-secondary text-sm">Loading feedback...</p>
        </div>
      </div>
    );
  }

  const avgScore = feedbackItems.length > 0 && feedbackItems.some((f) => f.grade !== null)
    ? Math.round(feedbackItems.filter((f) => f.grade !== null).reduce((s, f) => s + (f.grade || 0), 0) / feedbackItems.filter((f) => f.grade !== null).length)
    : null;

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Feedback & Grades"
        subtitle="View supervisor evaluations and rubric-based feedback on your submissions."
      />

      {error && (
        <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/30 text-red-400 text-sm flex gap-2 items-center">
          {error}
          <button onClick={fetchFeedback} className="ml-auto text-xs underline">Retry</button>
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Evaluated", value: feedbackItems.length.toString(), color: "#3b7fe8" },
          { label: "Avg. Score", value: avgScore !== null ? `${avgScore}` : "—", color: "#10b981" },
          { label: "Pending", value: "0", color: "#f59e0b" },
        ].map((s) => (
          <div key={s.label} className="p-4 rounded-2xl text-center bg-fyp-card border border-fyp-border">
            <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-fyp-text-secondary mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Feedback Cards */}
      {feedbackItems.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No feedback yet"
          description="Supervisor evaluations and rubric-based feedback will appear here after your submissions are graded."
        />
      ) : (
        <div className="space-y-4">
          {feedbackItems.map((item) => {
            const isOpen = expanded === item._id;
            const maxScore = 100;
            const scoreVal = item.grade || 0;
            const avgPct = Math.round((scoreVal / maxScore) * 100);
            const gradeColor = avgPct >= 90 ? "#10b981" : avgPct >= 75 ? "#3b7fe8" : "#f59e0b";
            const milestoneName = item.submission?.milestone?.title || "Submission";

            return (
              <div key={item._id} className="rounded-2xl overflow-hidden bg-fyp-card border border-fyp-border">
                <button className="w-full p-5 flex items-center gap-4 text-left" onClick={() => setExpanded(isOpen ? null : item._id)}>
                  {item.grade !== null ? (
                    <GradeCircle score={item.grade} max={maxScore} />
                  ) : (
                    <div className="w-16 h-16 rounded-full flex items-center justify-center bg-fyp-elevated border border-fyp-border">
                      <Star size={20} className="text-fyp-text-muted" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-[15px] font-semibold text-fyp-text">{milestoneName}</h3>
                      {item.grade !== null && (
                        <div className="px-2 py-0.5 rounded-lg text-[11px]" style={{ backgroundColor: `${gradeColor}15`, color: gradeColor }}>
                          Score: {item.grade}/100
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <div className="flex items-center gap-1">
                        <User size={11} className="text-fyp-text-muted" />
                        <span className="text-xs text-fyp-text-muted">{item.givenBy.name}</span>
                      </div>
                      <span className="text-xs text-fyp-text-muted">
                        {new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </div>
                  </div>
                  {isOpen ? <ChevronUp size={16} className="text-fyp-text-muted" /> : <ChevronDown size={16} className="text-fyp-text-muted" />}
                </button>

                {isOpen && (
                  <div className="border-t border-fyp-border">
                    <div className="p-5">
                      {item.rubric && item.rubric.length > 0 && (
                        <>
                          <div className="flex items-center gap-2 mb-4">
                            <Star size={14} className="text-fyp-text-muted" />
                            <span className="text-[13px] font-medium text-fyp-text-secondary">Rubric Breakdown</span>
                          </div>
                          <div className="space-y-3">
                            {item.rubric.map((r) => {
                              const pct = (r.score / r.max) * 100;
                              const rColor = pct >= 85 ? "#10b981" : pct >= 70 ? "#3b7fe8" : "#f59e0b";
                              return (
                                <div key={r.criteria} className="p-3 rounded-xl bg-fyp-elevated">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-[13px] text-fyp-text">{r.criteria}</span>
                                    <span className="text-[13px] font-semibold" style={{ color: rColor }}>{r.score}/{r.max}</span>
                                  </div>
                                  <div className="w-full h-1.5 rounded-full overflow-hidden bg-fyp-border">
                                    <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, backgroundColor: rColor }} />
                                  </div>
                                  <p className="text-xs text-fyp-text-muted mt-2">{r.comment}</p>
                                </div>
                              );
                            })}
                          </div>
                        </>
                      )}
                    </div>

                    <div className="mx-5 mb-5 p-4 rounded-xl bg-fyp-elevated border border-fyp-border">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare size={13} className="text-fyp-blue" />
                        <span className="text-[13px] font-medium text-fyp-text-secondary">Feedback Comment</span>
                      </div>
                      <p className="text-[13px] text-fyp-text-secondary leading-relaxed">{item.comment}</p>
                    </div>

                    {item.submission?.fileUrl && (
                      <div className="px-5 pb-5">
                        <a
                          href={`http://localhost:5000${item.submission.fileUrl}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm bg-fyp-elevated text-fyp-text-secondary border border-fyp-border w-fit"
                        >
                          <FileText size={13} />
                          Download Submission
                        </a>
                      </div>
                    )}
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
