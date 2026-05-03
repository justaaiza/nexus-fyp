import { useNavigate } from "react-router";
import { FolderOpen, ChevronRight, Users, Calendar, ExternalLink, CheckCircle2, Clock } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { EmptyState } from "../../components/EmptyState";
import { juryAssignedProjectsDemo, juryPanelInfoDemo } from "../../data/demoData";

type AssignedProject = {
  id: number;
  groupNo: string;
  title: string;
  lead: string;
  members: string[];
  supervisor: string;
  stack: string;
  defenseDate: string;
  room: string;
  status: "pending" | "scored";
  githubUrl: string;
  description: string;
  deliverables: { name: string; type: string; submitted: boolean }[];
};

const assignedProjects: AssignedProject[] = juryAssignedProjectsDemo as AssignedProject[];
const juryPanel = juryPanelInfoDemo;

export function JuryProjects() {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="Assigned Projects"
        subtitle="Projects assigned to your jury panel for evaluation."
      />

      {/* Panel info */}
      <div className="p-4 rounded-2xl flex items-center gap-4 bg-fyp-card border border-fyp-purple/30">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-fyp-purple/15">
          <Users size={18} className="text-fyp-purple" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-fyp-text">Your Jury Panel · {juryPanel.name}</p>
          <div className="flex items-center gap-4 mt-1">
            <div className="flex items-center gap-1.5">
              <Calendar size={12} className="text-fyp-text-muted" />
              <span className="text-xs text-fyp-text-muted">{juryPanel.slot}</span>
            </div>
          </div>
        </div>
        <div className="px-3 py-1.5 rounded-xl bg-fyp-amber/10 text-fyp-amber text-xs border border-fyp-amber/20">
          {assignedProjects.filter((p) => p.status === "pending").length} Pending
        </div>
      </div>

      {/* Project Cards */}
      {assignedProjects.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="No projects assigned"
          description="Projects will appear here once you are assigned to a defense panel by the coordinator."
        />
      ) : (
        <div className="space-y-5">
          {assignedProjects.map((project) => (
            <div key={project.id} className="rounded-2xl overflow-hidden bg-fyp-card" style={{ border: `1px solid ${project.status === "scored" ? "rgba(16,185,129,0.2)" : "var(--fyp-border)"}` }}>
              <div className="p-5">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-fyp-purple/10">
                      <FolderOpen size={18} className="text-fyp-purple" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-semibold text-fyp-text">{project.title}</h3>
                        <span className="px-2 py-0.5 rounded-lg text-xs" style={{
                          backgroundColor: project.status === "scored" ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.1)",
                          color: project.status === "scored" ? "#10b981" : "#f59e0b",
                        }}>
                          {project.status === "scored" ? "Scored" : "Pending Score"}
                        </span>
                      </div>
                      <p className="text-xs text-fyp-text-secondary mt-1">{project.groupNo} · {project.stack}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => navigate("/app/jury/deliverables")} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs transition-all bg-fyp-elevated text-fyp-text-secondary border border-fyp-border">
                      <FolderOpen size={12} /> Deliverables
                    </button>
                    <button onClick={() => navigate("/app/jury/scores")} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs transition-all hover:opacity-90 bg-fyp-purple text-white">
                      <ChevronRight size={12} /> {project.status === "scored" ? "Edit Scores" : "Score"}
                    </button>
                  </div>
                </div>

                <p className="text-[13px] text-fyp-text-secondary leading-relaxed mb-4">{project.description}</p>

                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-fyp-elevated">
                    <p className="text-[11px] text-fyp-text-muted mb-2">Team Members</p>
                    <div className="flex flex-col gap-1.5">
                      {project.members.map((m, i) => (
                        <div key={m} className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 bg-fyp-blue/20 text-fyp-blue">
                            {m.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                          </div>
                          <span className="text-xs text-fyp-text">
                            {m} {i === 0 && <span className="text-fyp-blue text-[10px]">(Lead)</span>}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-fyp-elevated">
                    <p className="text-[11px] text-fyp-text-muted mb-2">Deliverables</p>
                    <div className="flex flex-col gap-1.5">
                      {project.deliverables.map((d) => (
                        <div key={d.name} className="flex items-center gap-2">
                          {d.submitted ? <CheckCircle2 size={12} className="text-fyp-green" /> : <Clock size={12} className="text-fyp-amber" />}
                          <span className="text-xs" style={{ color: d.submitted ? "var(--fyp-text-primary)" : "var(--fyp-text-muted)" }}>{d.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-fyp-elevated">
                    <p className="text-[11px] text-fyp-text-muted mb-2">Supervisor & Repo</p>
                    <p className="text-xs text-fyp-text mb-2">{project.supervisor}</p>
                    <a href={project.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs hover:underline text-fyp-blue">
                      <ExternalLink size={11} /> View GitHub Repository
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
