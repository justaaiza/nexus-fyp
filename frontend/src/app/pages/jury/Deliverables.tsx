import { useState, useEffect } from "react";
import { FileText, Download, ExternalLink, Eye, GitBranch, ChevronDown, ChevronUp, Code2, Film, RefreshCw } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { EmptyState } from "../../components/EmptyState";
import { juryAPI } from "../../services/api";

type Submission = {
  _id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
  milestone?: { title: string };
  submittedBy?: { name: string; rollNumber?: string };
};

type Group = {
  _id: string;
  title: string;
  groupNo?: string;
  repoUrl?: string;
  teamMembers?: { name: string; rollNumber?: string }[];
};

type ProjectWithSubmissions = {
  group: Group;
  submissions: Submission[];
};

const fileTypeConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  pdf: { icon: FileText, color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
  zip: { icon: Code2, color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
  mp4: { icon: Film, color: "#8b5cf6", bg: "rgba(139,92,246,0.1)" },
};

const formatSize = (bytes: number) => {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export function JuryDeliverables() {
  const [projects, setProjects] = useState<ProjectWithSubmissions[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const fetchDeliverables = async () => {
    try {
      setLoading(true);
      setError("");

      // Step 1: Get panels assigned to this jury member
      const panelsRes = await juryAPI.getMyPanels() as { success: boolean; data: { _id: string; assignedGroups: Group[] }[] };
      const panels = panelsRes.data || [];

      // Step 2: For each group in each panel, fetch submissions
      const results: ProjectWithSubmissions[] = [];
      for (const panel of panels) {
        for (const group of panel.assignedGroups || []) {
          const subsRes = await juryAPI.getGroupSubmissions(group._id) as { success: boolean; data: Submission[] };
          results.push({ group, submissions: subsRes.data || [] });
        }
      }

      // Deduplicate groups (a group might appear in multiple panels)
      const seen = new Set<string>();
      const deduped = results.filter(r => {
        if (seen.has(r.group._id)) return false;
        seen.add(r.group._id);
        return true;
      });

      setProjects(deduped);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load deliverables.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDeliverables(); }, []);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <RefreshCw size={24} className="text-fyp-purple animate-spin mx-auto mb-3" />
          <p className="text-fyp-text-secondary text-sm">Loading deliverables...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="View Deliverables"
        subtitle="Access submitted documents and review GitHub links for each assigned group."
      />

      {error && (
        <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/30 text-red-400 text-sm flex gap-2 items-center">
          {error}
          <button onClick={fetchDeliverables} className="ml-auto text-xs underline">Retry</button>
        </div>
      )}

      {projects.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No deliverables available"
          description="Deliverables will appear here once student groups submit their documents."
        />
      ) : (
        projects.map(({ group, submissions }) => {
          const isOpen = expanded === group._id;

          return (
            <div key={group._id} className="rounded-2xl overflow-hidden bg-fyp-card border border-fyp-border">
              <div className="p-5 flex items-center gap-4 cursor-pointer" onClick={() => setExpanded(isOpen ? null : group._id)}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-fyp-purple/10">
                  <FileText size={17} className="text-fyp-purple" />
                </div>
                <div className="flex-1">
                  <h3 className="text-[15px] font-semibold text-fyp-text">{group.title}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-fyp-text-muted">{group.groupNo || "—"}</span>
                    <span className="text-xs text-fyp-text-muted">·</span>
                    <span className="text-xs text-fyp-text-muted">{submissions.length} submission{submissions.length !== 1 ? "s" : ""}</span>
                  </div>
                </div>
                {isOpen ? <ChevronUp size={16} className="text-fyp-text-muted" /> : <ChevronDown size={16} className="text-fyp-text-muted" />}
              </div>

              {isOpen && (
                <div className="border-t border-fyp-border p-5 space-y-4">
                  {/* GitHub Link */}
                  {group.repoUrl && (
                    <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-fyp-elevated">
                      <GitBranch size={15} className="text-fyp-purple" />
                      <span className="text-[13px] text-fyp-text-secondary">Repository:</span>
                      <a
                        href={group.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-sm hover:underline text-fyp-blue"
                      >
                        {group.repoUrl.replace("https://", "")}
                        <ExternalLink size={11} />
                      </a>
                    </div>
                  )}

                  {/* Submitted Documents */}
                  {submissions.length === 0 ? (
                    <p className="text-[13px] text-fyp-text-muted text-center py-4">No submissions yet from this group.</p>
                  ) : (
                    <div className="space-y-3">
                      {submissions.map((sub) => {
                        const fc = fileTypeConfig[sub.fileType] || fileTypeConfig.pdf;
                        const FIcon = fc.icon;
                        return (
                          <div key={sub._id} className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 p-4 rounded-xl bg-fyp-elevated border border-fyp-border">
                            <div className="flex items-center gap-4 w-full xl:w-auto flex-1 min-w-0">
                              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: fc.bg }}>
                                <FIcon size={17} color={fc.color} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[13px] font-medium text-fyp-text truncate">{sub.fileName}</p>
                                <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mt-1">
                                  <span className="text-xs text-fyp-text-muted whitespace-nowrap">{formatSize(sub.fileSize)}</span>
                                  <span className="text-xs text-fyp-text-muted hidden sm:inline">·</span>
                                  <span className="text-xs text-fyp-text-muted whitespace-nowrap">
                                    Submitted {new Date(sub.createdAt).toLocaleDateString()}
                                  </span>
                                  {sub.milestone && (
                                    <span className="px-1.5 py-0.5 rounded bg-fyp-card text-fyp-text-secondary text-[10px] whitespace-nowrap">
                                      {sub.milestone.title}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2 w-full xl:w-auto sm:mt-0">
                              <a
                                href={`http://localhost:5000${sub.fileUrl}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex-1 xl:flex-none justify-center flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-fyp-card text-fyp-text-secondary border border-fyp-border"
                              >
                                <Eye size={12} /> View
                              </a>
                              <a
                                href={`http://localhost:5000${sub.fileUrl}`}
                                download={sub.fileName}
                                className="flex-1 xl:flex-none justify-center flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-fyp-purple/10 text-fyp-purple border border-fyp-purple/20"
                              >
                                <Download size={12} /> Download
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
