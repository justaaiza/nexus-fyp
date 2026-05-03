import { useState, useEffect } from "react";
import { Users2, ChevronRight, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { StatCardSimple } from "../../components/StatCard";
import { EmptyState } from "../../components/EmptyState";
import { juryAPI } from "../../services/api";

type Panel = {
  _id: string;
  name: string;
  defenseDate?: string;
  assignedGroups: { _id: string; groupNo?: string; title: string; status: string }[];
};

export function JuryProjects() {
  const [panels, setPanels] = useState<Panel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const fetchPanels = async () => {
    try {
      setLoading(true);
      const res = await juryAPI.getMyPanels() as { success: boolean; data: Panel[] };
      setPanels(res.data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load assigned panels.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPanels(); }, []);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <RefreshCw size={24} className="text-fyp-blue animate-spin mx-auto mb-3" />
          <p className="text-fyp-text-secondary text-sm">Loading assigned panels...</p>
        </div>
      </div>
    );
  }

  const allGroups = panels.flatMap(p => p.assignedGroups);

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="Assigned Projects"
        subtitle="View the groups assigned to you for defense evaluation."
      />

      {error && (
        <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/30 text-red-400 text-sm flex gap-2 items-center">
          {error}
          <button onClick={fetchPanels} className="ml-auto text-xs underline">Retry</button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <StatCardSimple label="Panels Assigned" value={panels.length} color="#8b5cf6" />
        <StatCardSimple label="Total Groups" value={allGroups.length} color="#3b7fe8" />
      </div>

      {panels.length === 0 ? (
        <EmptyState
          icon={Users2}
          title="No projects assigned"
          description="You have not been assigned to any defense panels yet."
        />
      ) : (
        <div className="space-y-4">
          {panels.map((panel) => {
            const isExpanded = expanded === panel._id;

            return (
              <div key={panel._id} className="rounded-2xl overflow-hidden transition-all bg-fyp-card border border-fyp-border">
                <div className="p-5 flex items-start gap-4 cursor-pointer" onClick={() => setExpanded(isExpanded ? null : panel._id)}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-fyp-purple/10">
                    <Users2 size={18} className="text-fyp-purple" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-[15px] font-semibold text-fyp-text">{panel.name}</h3>
                      <span className="px-2 py-0.5 rounded-lg text-[11px] bg-fyp-purple/10 text-fyp-purple border border-fyp-purple/20">
                        {panel.assignedGroups.length} Groups
                      </span>
                    </div>
                    {panel.defenseDate && (
                      <p className="text-[13px] text-fyp-text-secondary mt-1.5 flex items-center gap-2">
                        <AlertCircle size={13} className="text-fyp-amber" />
                        Defense Date: {new Date(panel.defenseDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <ChevronRight size={16} className="text-fyp-text-muted transition-transform flex-shrink-0" style={{ transform: isExpanded ? "rotate(90deg)" : "none" }} />
                </div>

                {isExpanded && panel.assignedGroups.length > 0 && (
                  <div className="border-t border-fyp-border bg-fyp-elevated">
                    <div className="p-5 space-y-3">
                      <p className="text-xs text-fyp-text-muted uppercase tracking-wider mb-2">Groups in this Panel</p>
                      {panel.assignedGroups.map(g => (
                        <div key={g._id} className="p-3 rounded-xl bg-fyp-card border border-fyp-border flex items-center gap-3">
                          <CheckCircle2 size={16} className="text-fyp-green" />
                          <span className="text-[13px] font-medium text-fyp-blue">{g.groupNo || "—"}</span>
                          <span className="text-[13px] text-fyp-text flex-1">{g.title}</span>
                          <span className="text-[11px] text-fyp-text-muted capitalize">{g.status}</span>
                        </div>
                      ))}
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
