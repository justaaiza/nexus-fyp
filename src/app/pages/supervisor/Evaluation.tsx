import { useState } from "react";
import { ClipboardCheck, FileText, Download, Star, Send, ChevronDown, ChevronUp } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { StatCardSimple } from "../../components/StatCard";
import { EmptyState } from "../../components/EmptyState";

const rubricCriteria = [
  { key: "completeness", label: "Completeness", max: 25 },
  { key: "technical", label: "Technical Depth", max: 25 },
  { key: "clarity", label: "Clarity & Structure", max: 20 },
  { key: "diagrams", label: "Diagrams & Visuals", max: 15 },
  { key: "presentation", label: "Formatting", max: 15 },
];

type Submission = {
  id: number;
  group: string;
  title: string;
  lead: string;
  milestone: string;
  submittedDate: string;
  file: string;
  fileSize: string;
  status: "pending" | "graded";
  existingGrades: Record<string, number> | null;
  existingFeedback: string;
};

// Empty — to be populated from API
const submissions: Submission[] = [];

export function SupervisorEvaluation() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [grades, setGrades] = useState<Record<number, Record<string, number>>>({});
  const [feedbacks, setFeedbacks] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState<Set<number>>(new Set());

  const setGrade = (subId: number, key: string, val: number) => {
    setGrades((prev) => ({ ...prev, [subId]: { ...(prev[subId] || {}), [key]: val } }));
  };

  const getGrades = (sub: Submission) => grades[sub.id] || sub.existingGrades || {};

  const getTotal = (sub: Submission) => {
    const g = getGrades(sub);
    return rubricCriteria.reduce((sum, c) => sum + (g[c.key] || 0), 0);
  };

  const handleSubmit = (id: number) => {
    setSubmitted((prev) => new Set([...prev, id]));
    setExpanded(null);
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="Evaluation"
        subtitle="Grade submissions using the digital rubric and provide feedback."
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatCardSimple label="Pending Review" value={submissions.filter((s) => s.status === "pending" && !submitted.has(s.id)).length} color="#f59e0b" />
        <StatCardSimple label="Graded" value={submissions.filter((s) => s.status === "graded").length + submitted.size} color="#10b981" />
        <StatCardSimple label="Total Submissions" value={submissions.length} color="#3b7fe8" />
      </div>

      {/* Submission Cards */}
      {submissions.length === 0 ? (
        <EmptyState
          icon={ClipboardCheck}
          title="No submissions to evaluate"
          description="Student submissions will appear here for grading once they upload their deliverables."
        />
      ) : (
        <div className="space-y-4">
          {submissions.map((sub) => {
            const isOpen = expanded === sub.id;
            const isGraded = sub.status === "graded" || submitted.has(sub.id);
            const total = getTotal(sub);
            const g = getGrades(sub);
            const feedback = feedbacks[sub.id] ?? sub.existingFeedback;

            return (
              <div key={sub.id} className="rounded-2xl overflow-hidden bg-fyp-card" style={{ border: `1px solid ${isGraded ? "rgba(16,185,129,0.2)" : "var(--fyp-border)"}` }}>
                <div className="p-5 flex items-start gap-4 cursor-pointer" onClick={() => setExpanded(isOpen ? null : sub.id)}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-fyp-elevated">
                    <FileText size={17} color={isGraded ? "#10b981" : "#3b7fe8"} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-[15px] font-semibold text-fyp-text">{sub.group} — {sub.title}</h3>
                      <span className="px-2 py-0.5 rounded-lg text-xs" style={{
                        backgroundColor: isGraded ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.1)",
                        color: isGraded ? "#10b981" : "#f59e0b",
                        border: `1px solid ${isGraded ? "rgba(16,185,129,0.25)" : "rgba(245,158,11,0.25)"}`,
                      }}>
                        {isGraded ? "Graded" : "Pending"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="text-xs text-fyp-text-muted">{sub.milestone}</span>
                      <span className="text-xs text-fyp-text-muted">·</span>
                      <span className="text-xs text-fyp-text-muted">Submitted {sub.submittedDate}</span>
                      {isGraded && <span className="text-xs font-semibold text-fyp-green">{total}/100</span>}
                    </div>
                  </div>
                  {isOpen ? <ChevronUp size={16} className="text-fyp-text-muted" /> : <ChevronDown size={16} className="text-fyp-text-muted" />}
                </div>

                {isOpen && (
                  <div className="border-t border-fyp-border">
                    <div className="p-5 space-y-5">
                      {/* File */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-fyp-elevated border border-fyp-border">
                          <FileText size={13} className="text-fyp-blue" />
                          <span className="text-[13px] text-fyp-text">{sub.file}</span>
                          <span className="text-[11px] text-fyp-text-muted">({sub.fileSize})</span>
                        </div>
                        <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm bg-fyp-elevated text-fyp-text-secondary border border-fyp-border">
                          <Download size={13} /> Download
                        </button>
                      </div>

                      {/* Rubric */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Star size={14} className="text-fyp-text-muted" />
                            <span className="text-[13px] font-medium text-fyp-text-secondary">Rubric Evaluation</span>
                          </div>
                          <div className="px-3 py-1 rounded-lg" style={{
                            backgroundColor: total >= 85 ? "rgba(16,185,129,0.1)" : total >= 70 ? "rgba(59,127,232,0.1)" : "rgba(245,158,11,0.1)",
                            color: total >= 85 ? "#10b981" : total >= 70 ? "#3b7fe8" : "#f59e0b",
                          }}>
                            <span className="text-[15px] font-bold">{total}</span>
                            <span className="text-xs"> / 100</span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          {rubricCriteria.map((c) => (
                            <div key={c.key} className="p-3 rounded-xl bg-fyp-elevated">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[13px] text-fyp-text">{c.label}</span>
                                <span className="text-xs text-fyp-text-secondary">Max: {c.max}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <input
                                  type="range" min={0} max={c.max}
                                  value={g[c.key] ?? 0}
                                  onChange={(e) => setGrade(sub.id, c.key, +e.target.value)}
                                  className="flex-1" style={{ accentColor: "#3b7fe8" }}
                                  disabled={isGraded}
                                />
                                <div className="w-10 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold bg-fyp-blue/10 text-fyp-blue">
                                  {g[c.key] ?? 0}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Feedback */}
                      <div>
                        <label className="text-[13px] text-fyp-text-secondary block mb-2">Feedback Comments</label>
                        <textarea
                          rows={3} value={feedback}
                          onChange={(e) => setFeedbacks((prev) => ({ ...prev, [sub.id]: e.target.value }))}
                          placeholder="Write detailed feedback for the student..."
                          className="w-full px-4 py-3 rounded-xl outline-none resize-none bg-fyp-elevated border border-fyp-border text-fyp-text text-[13px]"
                          disabled={isGraded}
                        />
                      </div>

                      {!isGraded && (
                        <button
                          onClick={() => handleSubmit(sub.id)}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm hover:opacity-90 transition-all bg-fyp-green text-white"
                        >
                          <Send size={14} />
                          Submit Grade & Feedback
                        </button>
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
