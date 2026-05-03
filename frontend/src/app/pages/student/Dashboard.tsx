import { useState } from "react";
import { CheckCircle2, Clock, AlertCircle, Upload, ChevronRight, Users, Calendar, TrendingUp, ExternalLink } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { StatCard } from "../../components/StatCard";
import { StatusBadge } from "../../components/StatusBadge";
import { Card } from "../../components/Card";
import { EmptyState } from "../../components/EmptyState";
import {
  studentDashboardProjectDemo,
  studentDashboardRecentActivityDemo,
  studentDashboardTeamMembersDemo,
  studentDashboardTimelineDemo,
} from "../../data/demoData";

type TimelinePhase = {
  phase: string;
  date: string;
  status: "completed" | "upcoming" | "locked";
};

type TeamMember = {
  name: string;
  roll: string;
  role: "Lead" | "Member";
};

type Activity = {
  id: number;
  title: string;
  detail: string;
  time: string;
  type: "submission" | "feedback" | "meeting" | "status";
};

const project = studentDashboardProjectDemo;
const teamMembers: TeamMember[] = studentDashboardTeamMembersDemo as TeamMember[];
const timeline: TimelinePhase[] = studentDashboardTimelineDemo as TimelinePhase[];
const recentActivity: Activity[] = studentDashboardRecentActivityDemo as Activity[];

const statusColors: Record<string, { dot: string; label: string; labelColor: string }> = {
  completed: { dot: "#10b981", label: "Completed", labelColor: "#10b981" },
  upcoming: { dot: "#f59e0b", label: "Upcoming", labelColor: "#f59e0b" },
  locked: { dot: "#5a6478", label: "Locked", labelColor: "#5a6478" },
};

export function StudentDashboard() {
  const [showDetails, setShowDetails] = useState(false);
  const completedMilestones = timeline.filter((t) => t.status === "completed").length;
  const upcomingMilestones = timeline.filter((t) => t.status === "upcoming").length;
  const nextDeadline = timeline.find((t) => t.status === "upcoming")?.date ?? "—";

  const statCards = [
    { label: "Proposal Status", value: project.proposalStatus, icon: CheckCircle2, color: "#10b981" },
    { label: "Milestones Done", value: `${completedMilestones} / ${timeline.length}`, icon: TrendingUp, color: "#3b7fe8" },
    { label: "Pending Tasks", value: upcomingMilestones, icon: AlertCircle, color: "#f59e0b" },
    { label: "Next Deadline", value: nextDeadline, icon: Calendar, color: "#8b5cf6" },
  ];

  const activityConfig = {
    submission: { icon: Upload, color: "#3b7fe8", label: "Submission" },
    feedback: { icon: CheckCircle2, color: "#10b981", label: "Feedback" },
    meeting: { icon: Calendar, color: "#8b5cf6", label: "Meeting" },
    status: { icon: Clock, color: "#f59e0b", label: "Status" },
  } as const;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Proposal Dashboard"
        subtitle="Spring 2026 · Your FYP Group"
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <StatCard key={card.label} label={card.label} value={card.value} icon={card.icon} color={card.color} />
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Project Card */}
        <Card className="lg:col-span-2">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-fyp-text">{project.title}</h3>
              <p className="text-[13px] text-fyp-text-secondary mt-1">{project.groupNo} · {project.domain}</p>
            </div>
            <a href={project.repoUrl} target="_blank" rel="noreferrer" className="text-fyp-blue text-[13px] flex items-center gap-1 hover:underline">
              View repo <ExternalLink size={12} />
            </a>
          </div>

          <div className="mb-4">
            <StatusBadge label={project.proposalStatus} color="#10b981" />
          </div>

          <p className="text-[13px] text-fyp-text-secondary leading-relaxed mb-4">
            {showDetails ? project.summary : `${project.summary.slice(0, 110)}...`}
          </p>

          <button
            onClick={() => setShowDetails((prev) => !prev)}
            className="text-fyp-blue text-[13px] flex items-center gap-1 hover:underline mb-4"
          >
            {showDetails ? "Show less" : "Read more"}
          </button>

          {/* Supervisor Info */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-fyp-elevated border border-fyp-border mb-4">
            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 bg-fyp-green/20 text-fyp-green text-[13px] font-semibold">
              {project.supervisor.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
            </div>
            <div>
              <p className="text-[13px] font-medium text-fyp-text">{project.supervisor.name}</p>
              <p className="text-xs text-fyp-text-muted">{project.supervisor.email}</p>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap mb-4">
            {project.techStack.map((tech) => (
              <span key={tech} className="px-2 py-0.5 rounded-lg text-[11px] bg-fyp-elevated text-fyp-text-secondary border border-fyp-border">
                {tech}
              </span>
            ))}
          </div>

          {/* Team Members */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users size={14} className="text-fyp-text-muted" />
                <span className="text-[13px] text-fyp-text-secondary">Team Members</span>
              </div>
            </div>

            <div className="space-y-2">
              {teamMembers.map((member) => (
                <div key={member.roll} className="flex items-center gap-3 p-3 rounded-xl bg-fyp-elevated border border-fyp-border">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-fyp-blue/20 text-fyp-blue text-[11px] font-semibold">
                    {member.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-fyp-text">{member.name}</p>
                    <p className="text-xs text-fyp-text-muted">{member.roll}</p>
                  </div>
                  <StatusBadge label={member.role} color={member.role === "Lead" ? "#3b7fe8" : "#5a6478"} />
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Timeline */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={15} className="text-fyp-text-muted" />
            <h3 className="text-[15px] font-semibold text-fyp-text">FYP Timeline</h3>
          </div>

          {timeline.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No timeline set"
              description="Your FYP timeline phases will appear here"
            />
          ) : (
            <div className="space-y-1">
              {timeline.map((item, idx) => {
                const s = statusColors[item.status];
                const isLast = idx === timeline.length - 1;
                return (
                  <div key={item.phase} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full mt-1 flex-shrink-0" style={{ backgroundColor: s.dot }} />
                      {!isLast && (
                        <div className="w-px flex-1 mt-1 bg-fyp-border" style={{ minHeight: "20px" }} />
                      )}
                    </div>
                    <div className="pb-4 flex-1">
                      <p className="text-[13px]" style={{ color: item.status === "locked" ? "var(--fyp-text-muted)" : "var(--fyp-text-primary)" }}>
                        {item.phase}
                      </p>
                      <div className="flex items-center justify-between mt-0.5">
                        <p className="text-[11px] text-fyp-text-muted">{item.date}</p>
                        <span className="text-[10px]" style={{ color: s.labelColor }}>{s.label}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[15px] font-semibold text-fyp-text">Recent Activity</h3>
          <button className="text-fyp-blue text-[13px] flex items-center gap-1">
            View all <ChevronRight size={13} />
          </button>
        </div>

        {recentActivity.length === 0 ? (
          <EmptyState
            icon={Clock}
            title="No recent activity"
            description="Your recent project activities will appear here"
          />
        ) : (
          <div className="space-y-2">
            {recentActivity.map((item) => {
              const cfg = activityConfig[item.type];
              const Icon = cfg.icon;

              return (
                <div key={item.id} className="flex items-start gap-3 p-3 rounded-xl bg-fyp-elevated border border-fyp-border">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${cfg.color}20` }}>
                    <Icon size={14} color={cfg.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-[13px] font-medium text-fyp-text">{item.title}</p>
                      <StatusBadge label={cfg.label} color={cfg.color} />
                    </div>
                    <p className="text-xs text-fyp-text-secondary mt-0.5">{item.detail}</p>
                  </div>
                  <p className="text-[11px] text-fyp-text-muted flex-shrink-0">{item.time}</p>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
