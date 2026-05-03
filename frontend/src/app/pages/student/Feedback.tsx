import { useState } from "react";
import { MessageSquare, Star, ChevronDown, ChevronUp, FileText, User } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { Card } from "../../components/Card";
import { EmptyState } from "../../components/EmptyState";
import { studentFeedbackItemsDemo } from "../../data/demoData";

type FeedbackItem = {
  id: number;
  milestone: string;
  submittedDate: string;
  gradedDate: string;
  grade: string;
  gradeScore: number;
  maxScore: number;
  gradedBy: string;
  rubric: { criteria: string; score: number; max: number; comment: string }[];
  overallFeedback: string;
};

const feedbackItems: FeedbackItem[] = studentFeedbackItemsDemo as FeedbackItem[];

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
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Feedback & Grades"
        subtitle="View supervisor evaluations and rubric-based feedback on your submissions."
      />

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Evaluated", value: feedbackItems.length.toString(), color: "#3b7fe8" },
          { label: "Avg. Score", value: feedbackItems.length > 0 ? `${Math.round(feedbackItems.reduce((s, f) => s + f.gradeScore, 0) / feedbackItems.length)}%` : "—", color: "#10b981" },
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
            const isOpen = expanded === item.id;
            const avgPct = Math.round((item.gradeScore / item.maxScore) * 100);
            const gradeColor = avgPct >= 90 ? "#10b981" : avgPct >= 75 ? "#3b7fe8" : "#f59e0b";

            return (
              <div key={item.id} className="rounded-2xl overflow-hidden bg-fyp-card border border-fyp-border">
                <button className="w-full p-5 flex items-center gap-4 text-left" onClick={() => setExpanded(isOpen ? null : item.id)}>
                  <GradeCircle score={item.gradeScore} max={item.maxScore} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-[15px] font-semibold text-fyp-text">{item.milestone}</h3>
                      <div className="px-2 py-0.5 rounded-lg text-[11px]" style={{ backgroundColor: `${gradeColor}15`, color: gradeColor }}>
                        Grade: {item.grade}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <div className="flex items-center gap-1">
                        <User size={11} className="text-fyp-text-muted" />
                        <span className="text-xs text-fyp-text-muted">{item.gradedBy}</span>
                      </div>
                      <span className="text-xs text-fyp-text-muted">Graded {item.gradedDate}</span>
                    </div>
                  </div>
                  {isOpen ? <ChevronUp size={16} className="text-fyp-text-muted" /> : <ChevronDown size={16} className="text-fyp-text-muted" />}
                </button>

                {isOpen && (
                  <div className="border-t border-fyp-border">
                    <div className="p-5">
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
                    </div>

                    <div className="mx-5 mb-5 p-4 rounded-xl bg-fyp-elevated border border-fyp-border">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare size={13} className="text-fyp-blue" />
                        <span className="text-[13px] font-medium text-fyp-text-secondary">Overall Feedback</span>
                      </div>
                      <p className="text-[13px] text-fyp-text-secondary leading-relaxed">{item.overallFeedback}</p>
                    </div>

                    <div className="px-5 pb-5">
                      <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm bg-fyp-elevated text-fyp-text-secondary border border-fyp-border">
                        <FileText size={13} />
                        Download Graded Copy
                      </button>
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
