import { useState, useEffect } from "react";
import { Star, Send, CheckCircle2, Info, RefreshCw } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { EmptyState } from "../../components/EmptyState";
import { juryAPI } from "../../services/api";

const rubric = [
  { key: "problem", label: "Problem Understanding & Motivation", max: 15, desc: "Does the team clearly understand the problem they are solving?" },
  { key: "technical", label: "Technical Implementation", max: 25, desc: "Quality, complexity, and correctness of the technical solution." },
  { key: "design", label: "System Design & Architecture", max: 15, desc: "Proper use of design patterns, architecture, and scalability." },
  { key: "demo", label: "Live Demo & Functionality", max: 20, desc: "Working demo with core features functional." },
  { key: "presentation", label: "Presentation & Communication", max: 15, desc: "Clarity, confidence, and professionalism of the presentation." },
  { key: "qa", label: "Q&A Response", max: 10, desc: "Ability to answer technical questions from the jury." },
];

const maxTotal = rubric.reduce((sum, r) => sum + r.max, 0);

type Submission = { _id: string; fileName: string; fileType: string; myFeedback?: any };

type Group = {
  _id: string;
  groupNo?: string;
  title: string;
  teamMembers?: { name: string; rollNumber?: string }[];
  submissions?: Submission[];
};

type PanelData = {
  _id: string;
  assignedGroups: Group[];
};

const getLetterGrade = (pct: number) => {
  if (pct >= 90) return { grade: "A+", color: "#10b981" };
  if (pct >= 85) return { grade: "A", color: "#10b981" };
  if (pct >= 80) return { grade: "A-", color: "#22d3ee" };
  if (pct >= 75) return { grade: "B+", color: "#3b7fe8" };
  if (pct >= 70) return { grade: "B", color: "#3b7fe8" };
  if (pct >= 65) return { grade: "B-", color: "#8b5cf6" };
  if (pct >= 60) return { grade: "C+", color: "#f59e0b" };
  return { grade: "C", color: "#f59e0b" };
};

export function JuryScores() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [scores, setScores] = useState<Record<string, Record<string, number>>>({});
  const [feedbacks, setFeedbacks] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [tooltip, setTooltip] = useState<string | null>(null);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await juryAPI.getMyPanels() as { success: boolean; data: PanelData[] };
      const panels = res.data || [];
      const allGroups: Group[] = [];
      const seen = new Set<string>();
      for (const panel of panels) {
        for (const group of panel.assignedGroups || []) {
          if (!seen.has(group._id)) {
            seen.add(group._id);
            allGroups.push(group);
          }
        }
      }
      setGroups(allGroups);

      // Pre-fill previously submitted scores/feedback into state
      const initialScores: Record<string, Record<string, number>> = {};
      const initialFeedbacks: Record<string, string> = {};
      const initialSubmitted = new Set<string>();

      allGroups.forEach(g => {
        const sub = g.submissions?.[0]; // matching logic from handleSubmit
        if (sub && sub.myFeedback) {
          initialSubmitted.add(g._id);
          initialFeedbacks[g._id] = sub.myFeedback.comment || "";
          initialScores[g._id] = sub.myFeedback.rubric || {};
        }
      });

      setScores(initialScores);
      setFeedbacks(initialFeedbacks);
      setSubmitted(initialSubmitted);

      if (allGroups.length > 0 && !selectedGroupId) {
        setSelectedGroupId(allGroups[0]._id);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load groups.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGroups(); }, []);

  const group = groups.find(g => g._id === selectedGroupId);
  const groupScores = selectedGroupId ? (scores[selectedGroupId] || {}) : {};
  const total = rubric.reduce((sum, r) => sum + (groupScores[r.key] || 0), 0);
  const pct = maxTotal > 0 ? Math.round((total / maxTotal) * 100) : 0;
  const lg = getLetterGrade(pct);
  const isSubmitted = selectedGroupId ? submitted.has(selectedGroupId) : false;

  const setScore = (key: string, val: number) => {
    if (!selectedGroupId) return;
    setScores(prev => ({ ...prev, [selectedGroupId]: { ...(prev[selectedGroupId] || {}), [key]: val } }));
  };

  const handleSubmit = async () => {
    if (!selectedGroupId || !group) return;
    const comment = feedbacks[selectedGroupId] || "";

    // Find the first submission of this group to grade against
    const groupSubs = group.submissions;
    if (!groupSubs || groupSubs.length === 0) {
      alert("No submission found for this group to attach the score to.");
      return;
    }

    const submissionId = groupSubs[0]._id;
    const grade = total;

    try {
      setSubmitting(true);
      await juryAPI.submitGrade(submissionId, { comment, grade, rubric: groupScores });
      setSubmitted(prev => new Set([...prev, selectedGroupId]));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to submit score.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <RefreshCw size={24} className="text-fyp-purple animate-spin mx-auto mb-3" />
          <p className="text-fyp-text-secondary text-sm">Loading groups...</p>
        </div>
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="p-6 space-y-6 max-w-5xl mx-auto">
        <PageHeader
          title="Input Scores"
          subtitle="Use the digital rubric to record grades and feedback in real-time during the defense."
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <EmptyState
          icon={Star}
          title="No groups to score"
          description="Groups will appear here once you are assigned to a defense panel."
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="Input Scores"
        subtitle="Use the digital rubric to record grades and feedback in real-time during the defense."
      />

      {/* Group Selector */}
      <div className="flex gap-3 flex-wrap">
        {groups.map((g) => (
          <button
            key={g._id}
            onClick={() => setSelectedGroupId(g._id)}
            className="flex items-center gap-2 px-4 py-3 rounded-xl transition-all"
            style={{
              backgroundColor: selectedGroupId === g._id ? "rgba(139,92,246,0.15)" : "var(--fyp-bg-card)",
              border: `1.5px solid ${selectedGroupId === g._id ? "#8b5cf6" : "var(--fyp-border)"}`,
            }}
          >
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-fyp-purple/20">
              <span className="text-fyp-purple text-[10px] font-bold">
                {(g.groupNo || "G").split("-")[1] || "G"}
              </span>
            </div>
            <div className="text-left">
              <p className="text-[13px] font-medium text-fyp-text">{g.groupNo || "Group"}</p>
              <p className="text-[11px] text-fyp-text-muted">{g.title}</p>
            </div>
            {submitted.has(g._id) && <CheckCircle2 size={14} className="text-fyp-green ml-2" />}
          </button>
        ))}
      </div>

      {group && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Rubric */}
          <div className="lg:col-span-2 p-5 rounded-2xl bg-fyp-card border border-fyp-border">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-[15px] font-semibold text-fyp-text">{group.groupNo || "Group"} — Evaluation Rubric</h3>
                <p className="text-xs text-fyp-text-muted mt-0.5">{group.title}</p>
              </div>
              {isSubmitted && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-fyp-green/10 text-fyp-green border border-fyp-green/20">
                  <CheckCircle2 size={13} />
                  <span className="text-xs">Submitted</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {rubric.map((r) => {
                const val = groupScores[r.key] ?? 0;
                const rPct = (val / r.max) * 100;
                const rColor = rPct >= 80 ? "#10b981" : rPct >= 60 ? "#3b7fe8" : rPct > 0 ? "#f59e0b" : "#5a6478";

                return (
                  <div key={r.key} className="p-4 rounded-xl bg-fyp-elevated">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] text-fyp-text">{r.label}</span>
                        <button onMouseEnter={() => setTooltip(r.key)} onMouseLeave={() => setTooltip(null)} className="relative">
                          <Info size={12} className="text-fyp-text-muted" />
                          {tooltip === r.key && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg text-xs w-48 z-10 bg-fyp-base border border-fyp-border text-fyp-text-secondary">
                              {r.desc}
                            </div>
                          )}
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[15px] font-bold" style={{ color: rColor }}>{val}</span>
                        <span className="text-xs text-fyp-text-muted">/ {r.max}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {Array.from({ length: r.max + 1 }, (_, i) => i)
                        .filter((v, i) => i % Math.ceil(r.max / 10) === 0 || v === r.max)
                        .map((v) => (
                          <button
                            key={v}
                            onClick={() => !isSubmitted && setScore(r.key, v)}
                            className="w-8 h-7 rounded-lg text-xs transition-all"
                            style={{
                              backgroundColor: val === v ? rColor : "var(--fyp-bg-card)",
                              color: val === v ? "white" : "var(--fyp-text-secondary)",
                              border: `1px solid ${val === v ? rColor : "var(--fyp-border)"}`,
                              fontWeight: val === v ? 600 : 400,
                              cursor: isSubmitted ? "default" : "pointer",
                            }}
                          >
                            {v}
                          </button>
                        ))}
                    </div>

                    <input
                      type="range" min={0} max={r.max} value={val}
                      onChange={(e) => !isSubmitted && setScore(r.key, +e.target.value)}
                      className="w-full mt-3" style={{ accentColor: rColor }}
                      disabled={isSubmitted}
                    />
                  </div>
                );
              })}
            </div>

            {/* Feedback */}
            <div className="mt-5">
              <label className="text-[13px] text-fyp-text-secondary block mb-2">Jury Comments & Feedback</label>
              <textarea
                rows={4}
                value={feedbacks[selectedGroupId || ""] || ""}
                onChange={(e) => setFeedbacks(prev => ({ ...prev, [selectedGroupId || ""]: e.target.value }))}
                placeholder="Enter detailed comments for this group..."
                className="w-full px-4 py-3 rounded-xl outline-none resize-none bg-fyp-elevated border border-fyp-border text-fyp-text text-[13px]"
                disabled={isSubmitted}
              />
            </div>

            {!isSubmitted && (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="mt-4 flex items-center gap-2 px-5 py-3 rounded-xl hover:opacity-90 transition-all bg-fyp-purple text-white text-sm disabled:opacity-50"
              >
                <Send size={15} />
                {submitting ? "Submitting..." : `Submit Final Score for ${group.groupNo || "Group"}`}
              </button>
            )}
          </div>

          {/* Score Summary */}
          <div className="space-y-4">
            <div className="p-5 rounded-2xl text-center bg-fyp-card border border-fyp-border">
              <div className="relative w-28 h-28 mx-auto mb-4">
                <svg width="112" height="112" className="-rotate-90" viewBox="0 0 112 112">
                  <circle cx="56" cy="56" r="48" fill="none" stroke="#252d3d" strokeWidth="8" />
                  <circle cx="56" cy="56" r="48" fill="none" stroke={lg.color} strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={`${(pct / 100) * 2 * Math.PI * 48} ${2 * Math.PI * 48}`}
                    style={{ transition: "stroke-dasharray 0.4s ease" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-fyp-text">{total}</span>
                  <span className="text-[11px] text-fyp-text-muted">/ {maxTotal}</span>
                </div>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl mb-2" style={{ backgroundColor: `${lg.color}15`, border: `1px solid ${lg.color}30` }}>
                <Star size={14} color={lg.color} />
                <span className="text-lg font-bold" style={{ color: lg.color }}>{lg.grade}</span>
              </div>
              <p className="text-xs text-fyp-text-secondary">{pct}% — {group.groupNo || "Group"}</p>
            </div>

            <div className="p-5 rounded-2xl bg-fyp-card border border-fyp-border">
              <p className="text-[13px] font-medium text-fyp-text-secondary mb-3">Score Breakdown</p>
              <div className="space-y-2">
                {rubric.map((r) => {
                  const val = groupScores[r.key] || 0;
                  const rPct = (val / r.max) * 100;
                  const c = rPct >= 80 ? "#10b981" : rPct >= 60 ? "#3b7fe8" : rPct > 0 ? "#f59e0b" : "#5a6478";
                  return (
                    <div key={r.key}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] text-fyp-text-secondary">{r.label.split(" ").slice(0, 2).join(" ")}</span>
                        <span className="text-[11px] font-semibold" style={{ color: c }}>{val}/{r.max}</span>
                      </div>
                      <div className="w-full h-1 rounded-full overflow-hidden bg-fyp-elevated">
                        <div className="h-1 rounded-full transition-all" style={{ width: `${rPct}%`, backgroundColor: c }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {group.teamMembers && group.teamMembers.length > 0 && (
              <div className="p-5 rounded-2xl bg-fyp-card border border-fyp-border">
                <p className="text-[13px] font-medium text-fyp-text-secondary mb-2.5">Team</p>
                <div className="space-y-2">
                  {group.teamMembers.map((m, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-fyp-purple/20 text-fyp-purple text-[9px] font-bold">
                        {m.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-xs text-fyp-text">{m.name}</p>
                        {m.rollNumber && <p className="text-[10px] text-fyp-text-muted">{m.rollNumber}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
