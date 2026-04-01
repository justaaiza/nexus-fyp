import { useState } from "react";
import { FileText, Download, ExternalLink, Eye, GitBranch, GitCommit, ChevronDown, ChevronUp, Code2, Film } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { EmptyState } from "../../components/EmptyState";

type Project = {
  id: number;
  groupNo: string;
  title: string;
  githubUrl: string;
  commits: number;
  contributors: { name: string; commits: number; additions: number; deletions: number; avatar: string }[];
  documents: { name: string; type: string; size: string; submitted: string; milestone: string }[];
};

const fileTypeConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  pdf: { icon: FileText, color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
  zip: { icon: Code2, color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
  mp4: { icon: Film, color: "#8b5cf6", bg: "rgba(139,92,246,0.1)" },
};

// Empty — to be populated from API
const projects: Project[] = [];

export function JuryDeliverables() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<Record<number, "docs" | "github">>({});

  const getTab = (id: number) => activeTab[id] || "docs";
  const setTab = (id: number, tab: "docs" | "github") =>
    setActiveTab((prev) => ({ ...prev, [id]: tab }));

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="View Deliverables"
        subtitle="Access submitted documents and review GitHub contributions for each assigned group."
      />

      {projects.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No deliverables available"
          description="Deliverables will appear here once student groups submit their documents."
        />
      ) : (
        projects.map((proj) => {
          const isOpen = expanded === proj.id;
          const tab = getTab(proj.id);

          return (
            <div key={proj.id} className="rounded-2xl overflow-hidden bg-fyp-card border border-fyp-border">
              <div className="p-5 flex items-center gap-4 cursor-pointer" onClick={() => setExpanded(isOpen ? null : proj.id)}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-fyp-purple/10">
                  <FileText size={17} className="text-fyp-purple" />
                </div>
                <div className="flex-1">
                  <h3 className="text-[15px] font-semibold text-fyp-text">{proj.title}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-fyp-text-muted">{proj.groupNo}</span>
                    <span className="text-xs text-fyp-text-muted">·</span>
                    <span className="text-xs text-fyp-text-muted">{proj.documents.length} documents</span>
                    <span className="text-xs text-fyp-text-muted">·</span>
                    <div className="flex items-center gap-1">
                      <GitCommit size={11} className="text-fyp-text-muted" />
                      <span className="text-xs text-fyp-text-muted">{proj.commits} commits</span>
                    </div>
                  </div>
                </div>
                {isOpen ? <ChevronUp size={16} className="text-fyp-text-muted" /> : <ChevronDown size={16} className="text-fyp-text-muted" />}
              </div>

              {isOpen && (
                <div className="border-t border-fyp-border">
                  <div className="flex gap-0 border-b border-fyp-border">
                    {(["docs", "github"] as const).map((t) => (
                      <button key={t} onClick={() => setTab(proj.id, t)} className="px-5 py-3 text-sm transition-all" style={{
                        color: tab === t ? "var(--fyp-text-primary)" : "var(--fyp-text-muted)",
                        borderBottom: tab === t ? "2px solid #8b5cf6" : "2px solid transparent",
                        fontWeight: tab === t ? 500 : 400,
                      }}>
                        {t === "docs" ? "Documents" : "GitHub & Contributions"}
                      </button>
                    ))}
                  </div>

                  <div className="p-5">
                    {tab === "docs" ? (
                      <div className="space-y-3">
                        {proj.documents.map((doc) => {
                          const fc = fileTypeConfig[doc.type] || fileTypeConfig.pdf;
                          const FIcon = fc.icon;
                          return (
                            <div key={doc.name} className="flex items-center gap-4 p-4 rounded-xl bg-fyp-elevated border border-fyp-border">
                              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: fc.bg }}>
                                <FIcon size={17} color={fc.color} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[13px] font-medium text-fyp-text">{doc.name}</p>
                                <div className="flex items-center gap-3 mt-0.5">
                                  <span className="text-xs text-fyp-text-muted">{doc.size}</span>
                                  <span className="text-xs text-fyp-text-muted">·</span>
                                  <span className="text-xs text-fyp-text-muted">Submitted {doc.submitted}</span>
                                  <span className="px-1.5 py-0.5 rounded bg-fyp-card text-fyp-text-secondary text-[10px]">{doc.milestone}</span>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-fyp-card text-fyp-text-secondary border border-fyp-border">
                                  <Eye size={12} /> View
                                </button>
                                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-fyp-purple/10 text-fyp-purple border border-fyp-purple/20">
                                  <Download size={12} /> Download
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-fyp-elevated">
                          <GitBranch size={15} className="text-fyp-purple" />
                          <span className="text-[13px] text-fyp-text-secondary">Repository:</span>
                          <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm hover:underline text-fyp-blue">
                            {proj.githubUrl.replace("https://", "")}
                            <ExternalLink size={11} />
                          </a>
                          <div className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded-lg bg-fyp-green/10">
                            <GitCommit size={11} className="text-fyp-green" />
                            <span className="text-[11px] text-fyp-green">{proj.commits} commits</span>
                          </div>
                        </div>

                        <div>
                          <p className="text-[11px] text-fyp-text-muted uppercase tracking-wider mb-2.5">Individual Contributions</p>
                          <div className="space-y-3">
                            {proj.contributors.map((c) => {
                              const pct = Math.round((c.commits / proj.commits) * 100);
                              return (
                                <div key={c.name} className="p-4 rounded-xl bg-fyp-elevated">
                                  <div className="flex items-center gap-3 mb-3">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-fyp-blue/20 text-fyp-blue text-[11px] font-bold">{c.avatar}</div>
                                    <div className="flex-1">
                                      <p className="text-[13px] font-medium text-fyp-text">{c.name}</p>
                                      <p className="text-[11px] text-fyp-text-muted">{c.commits} commits · {pct}% contribution</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-[11px] text-fyp-green">+{c.additions.toLocaleString()}</p>
                                      <p className="text-[11px] text-fyp-red">-{c.deletions.toLocaleString()}</p>
                                    </div>
                                  </div>
                                  <div className="w-full h-2 rounded-full overflow-hidden bg-fyp-card">
                                    <div className="h-2 rounded-full" style={{ width: `${pct}%`, background: "linear-gradient(90deg, #3b7fe8, #8b5cf6)" }} />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
