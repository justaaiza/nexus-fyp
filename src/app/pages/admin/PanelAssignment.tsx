import { useState } from "react";
import { Users2, Plus, X, ChevronRight, CheckCircle2, Calendar, Edit3 } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { StatCardSimple } from "../../components/StatCard";
import { Modal } from "../../components/Modal";
import { EmptyState } from "../../components/EmptyState";
import {
  adminDefenseSlotsDemo,
  adminInitialPanelsDemo,
  adminPanelGroupsDemo,
  adminPanelJurorsDemo,
} from "../../data/demoData";

type Panel = {
  id: number;
  groups: string[];
  jurors: string[];
  slot: string;
  room: string;
};

type Group = { id: string; title: string; lead: string; members: number };
type Juror = { id: string; name: string; dept: string; expertise: string };

const allGroups: Group[] = adminPanelGroupsDemo as Group[];
const jurors: Juror[] = adminPanelJurorsDemo as Juror[];
const defenseSlots: string[] = adminDefenseSlotsDemo;
const initialPanels: Panel[] = adminInitialPanelsDemo as Panel[];

export function AdminPanels() {
  const [panels, setPanels] = useState<Panel[]>(initialPanels);
  const [showForm, setShowForm] = useState(false);
  const [newPanel, setNewPanel] = useState({ groups: [] as string[], jurors: [] as string[], slot: "", room: "" });

  const assignedGroups = panels.flatMap((p) => p.groups);

  const toggleItem = (arr: string[], item: string) =>
    arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];

  const handleCreate = () => {
    if (newPanel.groups.length === 0 || newPanel.jurors.length === 0) return;
    setPanels((prev) => [...prev, { id: prev.length + 1, ...newPanel }]);
    setNewPanel({ groups: [], jurors: [], slot: "", room: "" });
    setShowForm(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <PageHeader
        title="Panel Assignment"
        subtitle="Assign jury panels to student groups for defense evaluations."
        action={
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl hover:opacity-90 transition-all bg-fyp-amber text-[#0d1117] text-sm font-semibold">
            <Plus size={15} /> New Panel
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCardSimple label="Total Panels" value={panels.length} color="#f59e0b" />
        <StatCardSimple label="Groups Assigned" value={assignedGroups.length} color="#10b981" />
        <StatCardSimple label="Unassigned Groups" value={allGroups.length - assignedGroups.length} color="#ef4444" />
        <StatCardSimple label="Jury Members" value={jurors.length} color="#3b7fe8" />
      </div>

      {/* Panels Grid */}
      {panels.length === 0 && allGroups.length === 0 ? (
        <EmptyState
          icon={Users2}
          title="No panels configured"
          description="Create defense panels by assigning jury members and student groups to time slots."
        />
      ) : (
        <div className="grid lg:grid-cols-2 gap-5">
          {panels.map((panel) => {
            const panelJurors = jurors.filter((j) => panel.jurors.includes(j.id));
            const panelGroups = allGroups.filter((g) => panel.groups.includes(g.id));

            return (
              <div key={panel.id} className="rounded-2xl overflow-hidden bg-fyp-card border border-fyp-border">
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-fyp-amber/10">
                        <Users2 size={17} className="text-fyp-amber" />
                      </div>
                      <div>
                        <h3 className="text-[15px] font-semibold text-fyp-text">Panel {panel.id}</h3>
                        <p className="text-xs text-fyp-text-muted">{panel.room}</p>
                      </div>
                    </div>
                    <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-fyp-elevated border border-fyp-border">
                      <Edit3 size={12} className="text-fyp-text-secondary" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-xl bg-fyp-elevated">
                    <Calendar size={13} className="text-fyp-amber" />
                    <span className="text-[13px] text-fyp-text-secondary">{panel.slot}</span>
                  </div>

                  {panelJurors.length > 0 && (
                    <div className="mb-4">
                      <p className="text-[11px] text-fyp-text-muted uppercase tracking-wider mb-2">Jury Members</p>
                      <div className="flex flex-wrap gap-2">
                        {panelJurors.map((j) => (
                          <div key={j.id} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-fyp-elevated">
                            <div className="w-5 h-5 rounded-full flex items-center justify-center bg-fyp-purple/20 text-fyp-purple text-[9px] font-bold">
                              {j.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                            </div>
                            <span className="text-xs text-fyp-text">{j.name.replace("Dr. ", "")}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {panelGroups.length > 0 && (
                    <div>
                      <p className="text-[11px] text-fyp-text-muted uppercase tracking-wider mb-2">Assigned Groups</p>
                      <div className="space-y-2">
                        {panelGroups.map((g) => (
                          <div key={g.id} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-fyp-elevated">
                            <CheckCircle2 size={13} className="text-fyp-green" />
                            <span className="text-xs text-fyp-text-secondary">{g.id}</span>
                            <ChevronRight size={11} className="text-fyp-text-muted" />
                            <span className="text-xs text-fyp-text flex-1">{g.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Unassigned Groups Card */}
          {allGroups.filter((g) => !assignedGroups.includes(g.id)).length > 0 && (
            <div className="rounded-2xl p-5 bg-fyp-card border border-dashed border-fyp-border">
              <p className="text-[13px] font-medium text-fyp-text-secondary mb-3">Unassigned Groups</p>
              <div className="space-y-2">
                {allGroups.filter((g) => !assignedGroups.includes(g.id)).map((g) => (
                  <div key={g.id} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-fyp-elevated">
                    <div className="w-2 h-2 rounded-full flex-shrink-0 bg-fyp-red" />
                    <span className="text-xs text-fyp-text-secondary">{g.id}</span>
                    <ChevronRight size={11} className="text-fyp-text-muted" />
                    <span className="text-xs text-fyp-text flex-1">{g.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create Panel Modal */}
      <Modal open={showForm} onClose={() => setShowForm(false)} title="Create New Panel" maxWidth="max-w-xl"
        footer={<>
          <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl text-sm bg-fyp-elevated text-fyp-text-secondary border border-fyp-border">Cancel</button>
          <button onClick={handleCreate} className="flex-1 py-2.5 rounded-xl text-sm hover:opacity-90 bg-fyp-amber text-[#0d1117] font-semibold">Create Panel</button>
        </>}
      >
        <div className="space-y-5">
          <div>
            <label className="text-[13px] text-fyp-text-secondary block mb-2">Select Groups</label>
            <div className="space-y-2 max-h-36 overflow-y-auto">
              {allGroups.filter((g) => !assignedGroups.includes(g.id)).map((g) => (
                <label key={g.id} className="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer bg-fyp-elevated">
                  <input type="checkbox" checked={newPanel.groups.includes(g.id)} onChange={() => setNewPanel((p) => ({ ...p, groups: toggleItem(p.groups, g.id) }))} />
                  <span className="text-[13px] text-fyp-text">{g.id} — {g.title}</span>
                </label>
              ))}
              {allGroups.filter((g) => !assignedGroups.includes(g.id)).length === 0 && (
                <p className="text-[13px] text-fyp-text-muted text-center py-4">All groups are assigned</p>
              )}
            </div>
          </div>
          <div>
            <label className="text-[13px] text-fyp-text-secondary block mb-2">Select Jury Members (min 3)</label>
            <div className="space-y-2">
              {jurors.map((j) => (
                <label key={j.id} className="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer bg-fyp-elevated">
                  <input type="checkbox" checked={newPanel.jurors.includes(j.id)} onChange={() => setNewPanel((p) => ({ ...p, jurors: toggleItem(p.jurors, j.id) }))} />
                  <span className="text-[13px] text-fyp-text">{j.name}</span>
                  <span className="text-[11px] text-fyp-text-muted ml-auto">{j.expertise}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[13px] text-fyp-text-secondary block mb-1.5">Defense Slot</label>
              <select value={newPanel.slot} onChange={(e) => setNewPanel({ ...newPanel, slot: e.target.value })} className="w-full px-3 py-2.5 rounded-xl outline-none bg-fyp-elevated border border-fyp-border text-fyp-text text-xs">
                <option value="">Select slot</option>
                {defenseSlots.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[13px] text-fyp-text-secondary block mb-1.5">Room</label>
              <input value={newPanel.room} onChange={(e) => setNewPanel({ ...newPanel, room: e.target.value })} placeholder="e.g. CR-103" className="w-full px-3 py-2.5 rounded-xl outline-none bg-fyp-elevated border border-fyp-border text-fyp-text text-[13px]" />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
