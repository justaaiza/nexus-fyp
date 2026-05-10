import { useState, useEffect } from "react";
import { Users2, Plus, ChevronRight, CheckCircle2, Calendar, Trash2, RefreshCw, Pencil } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { StatCardSimple } from "../../components/StatCard";
import { Modal } from "../../components/Modal";
import { EmptyState } from "../../components/EmptyState";
import { adminAPI } from "../../services/api";

type Panel = {
  _id: string;
  name: string;
  juryMembers: { _id: string; name: string; email: string; department?: string }[];
  assignedGroups: { _id: string; title: string; groupNo?: string }[];
  defenseDate?: string;
  room?: string;
};

function toDatetimeLocalValue(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function groupTakenElsewhere(panels: Panel[], groupId: string, exceptPanelId?: string): boolean {
  return panels.some(
    (pan) => pan._id !== exceptPanelId && pan.assignedGroups.some((g) => g._id === groupId)
  );
}

export function AdminPanels() {
  const [panels, setPanels] = useState<Panel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newPanel, setNewPanel] = useState({
    name: "",
    juryMemberIds: [] as string[],
    assignedGroupIds: [] as string[],
    defenseDate: "",
    room: "",
  });

  const [juryUsers, setJuryUsers] = useState<{ _id: string; name: string; email: string; department?: string }[]>([]);
  const [proposals, setProposals] = useState<{ _id: string; title: string; groupNo?: string }[]>([]);
  const [editPanel, setEditPanel] = useState<{
    id: string;
    name: string;
    juryMemberIds: string[];
    assignedGroupIds: string[];
    defenseDate: string;
    room: string;
  } | null>(null);

  const fetchPanels = async () => {
    try {
      setLoading(true);
      setError("");
      const [panelsRes, juryRes, proposalsRes] = await Promise.all([
        adminAPI.getPanels() as Promise<{ success: boolean; data: Panel[] }>,
        adminAPI.getUsers("jury") as Promise<{ success: boolean; data: { _id: string; name: string; email: string; department?: string; isApproved: boolean }[] }>,
        adminAPI.getProposals("approved") as Promise<{ success: boolean; data: { _id: string; title: string; groupNo?: string }[] }>,
      ]);
      setPanels(panelsRes.data || []);
      setJuryUsers((juryRes.data || []).filter((u) => u.isApproved));
      setProposals(proposalsRes.data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load panels.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPanels(); }, []);

  const toggleItem = (arr: string[], item: string) =>
    arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];

  const handleCreate = async () => {
    if (newPanel.juryMemberIds.length < 3 || newPanel.assignedGroupIds.length === 0 || !newPanel.name) return;
    try {
      setSubmitting(true);
      const res = await adminAPI.createPanel({
        name: newPanel.name,
        juryMembers: newPanel.juryMemberIds,
        assignedGroups: newPanel.assignedGroupIds,
        defenseDate: newPanel.defenseDate || null,
        room: newPanel.room || null,
      }) as { success: boolean; data: Panel };
      setPanels((prev) => [res.data, ...prev]);
      setNewPanel({ name: "", juryMemberIds: [], assignedGroupIds: [], defenseDate: "", room: "" });
      setShowForm(false);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to create panel.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this panel?")) return;
    try {
      await adminAPI.deletePanel(id);
      setPanels((prev) => prev.filter((p) => p._id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete panel.");
    }
  };

  const handleSaveEdit = async () => {
    if (!editPanel || editPanel.juryMemberIds.length < 3 || editPanel.assignedGroupIds.length === 0 || !editPanel.name.trim()) return;
    try {
      setSubmitting(true);
      const res = await adminAPI.updatePanel(editPanel.id, {
        name: editPanel.name.trim(),
        juryMembers: editPanel.juryMemberIds,
        assignedGroups: editPanel.assignedGroupIds,
        defenseDate: editPanel.defenseDate || null,
        room: editPanel.room?.trim() || null,
      }) as { success: boolean; data: Panel };
      setPanels((prev) => prev.map((p) => (p._id === editPanel.id ? res.data : p)));
      setEditPanel(null);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to update panel.");
    } finally {
      setSubmitting(false);
    }
  };

  const openEdit = (panel: Panel) => {
    setEditPanel({
      id: panel._id,
      name: panel.name,
      juryMemberIds: panel.juryMembers.map((j) => j._id),
      assignedGroupIds: panel.assignedGroups.map((g) => g._id),
      defenseDate: toDatetimeLocalValue(panel.defenseDate),
      room: panel.room || "",
    });
  };

  const proposalsForCreate = proposals.filter((p) => !groupTakenElsewhere(panels, p._id));

  const assignedGroupIds = panels.flatMap((p) => p.assignedGroups.map((g) => g._id));

  const proposalsForEdit = editPanel
    ? proposals.filter(
        (p) =>
          !groupTakenElsewhere(panels, p._id, editPanel.id) ||
          editPanel.assignedGroupIds.includes(p._id)
      )
    : [];

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <RefreshCw size={24} className="text-fyp-blue animate-spin mx-auto mb-3" />
          <p className="text-fyp-text-secondary text-sm">Loading panels...</p>
        </div>
      </div>
    );
  }

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

      {error && (
        <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/30 text-red-400 text-sm flex gap-2 items-center">
          {error}
          <button onClick={fetchPanels} className="ml-auto text-xs underline">Retry</button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCardSimple label="Total Panels" value={panels.length} color="#f59e0b" />
        <StatCardSimple label="Groups Assigned" value={assignedGroupIds.length} color="#10b981" />
        <StatCardSimple label="Unassigned Groups" value={Math.max(0, proposals.length - assignedGroupIds.length)} color="#ef4444" />
        <StatCardSimple label="Jury Members" value={juryUsers.length} color="#3b7fe8" />
      </div>

      {/* Panels Grid */}
      {panels.length === 0 ? (
        <EmptyState
          icon={Users2}
          title="No panels configured"
          description="Create defense panels by assigning jury members and student groups to time slots."
        />
      ) : (
        <div className="grid lg:grid-cols-2 gap-5">
          {panels.map((panel) => (
            <div key={panel._id} className="rounded-2xl overflow-hidden bg-fyp-card border border-fyp-border">
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-fyp-amber/10">
                      <Users2 size={17} className="text-fyp-amber" />
                    </div>
                    <div>
                      <h3 className="text-[15px] font-semibold text-fyp-text">{panel.name}</h3>
                      <p className="text-xs text-fyp-text-muted">{panel.room || "No room"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => openEdit(panel)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-fyp-blue/10 transition-all" title="Edit panel">
                      <Pencil size={13} className="text-fyp-blue" />
                    </button>
                    <button type="button" onClick={() => handleDelete(panel._id)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-950/30 transition-all" title="Delete">
                      <Trash2 size={13} className="text-fyp-red" />
                    </button>
                  </div>
                </div>

                {panel.defenseDate && (
                  <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-xl bg-fyp-elevated">
                    <Calendar size={13} className="text-fyp-amber" />
                    <span className="text-[13px] text-fyp-text-secondary">{new Date(panel.defenseDate).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                  </div>
                )}

                {panel.juryMembers.length > 0 && (
                  <div className="mb-4">
                    <p className="text-[11px] text-fyp-text-muted uppercase tracking-wider mb-2">Jury Members</p>
                    <div className="flex flex-wrap gap-2">
                      {panel.juryMembers.map((j) => (
                        <div key={j._id} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-fyp-elevated">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center bg-fyp-purple/20 text-fyp-purple text-[9px] font-bold">
                            {j.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                          </div>
                          <span className="text-xs text-fyp-text">{j.name.replace("Dr. ", "")}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {panel.assignedGroups.length > 0 && (
                  <div>
                    <p className="text-[11px] text-fyp-text-muted uppercase tracking-wider mb-2">Assigned Groups</p>
                    <div className="space-y-2">
                      {panel.assignedGroups.map((g) => (
                        <div key={g._id} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-fyp-elevated">
                          <CheckCircle2 size={13} className="text-fyp-green" />
                          <span className="text-xs text-fyp-text-secondary">{g.groupNo || "—"}</span>
                          <ChevronRight size={11} className="text-fyp-text-muted" />
                          <span className="text-xs text-fyp-text flex-1">{g.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Panel Modal */}
      <Modal open={showForm} onClose={() => setShowForm(false)} title="Create New Panel" maxWidth="max-w-xl"
        footer={<>
          <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl text-sm bg-fyp-elevated text-fyp-text-secondary border border-fyp-border">Cancel</button>
          <button
            onClick={handleCreate}
            disabled={submitting || newPanel.juryMemberIds.length < 3 || newPanel.assignedGroupIds.length === 0 || !newPanel.name}
            className="flex-1 py-2.5 rounded-xl text-sm hover:opacity-90 bg-fyp-amber text-[#0d1117] font-semibold disabled:opacity-50"
          >
            {submitting ? "Creating..." : "Create Panel"}
          </button>
        </>}
      >
        <div className="space-y-5">
          <div>
            <label className="text-[13px] text-fyp-text-secondary block mb-1.5">Panel Name *</label>
            <input value={newPanel.name} onChange={(e) => setNewPanel({ ...newPanel, name: e.target.value })}
              placeholder="e.g. Panel A" className="w-full px-4 py-2.5 rounded-xl outline-none bg-fyp-elevated border border-fyp-border text-fyp-text text-[13px]" />
          </div>
          <div>
            <label className="text-[13px] text-fyp-text-secondary block mb-2">Select Approved Groups</label>
            <div className="space-y-2 max-h-36 overflow-y-auto">
              {proposalsForCreate.map((g) => (
                <label key={g._id} className="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer bg-fyp-elevated">
                  <input type="checkbox" checked={newPanel.assignedGroupIds.includes(g._id)} onChange={() => setNewPanel((p) => ({ ...p, assignedGroupIds: toggleItem(p.assignedGroupIds, g._id) }))} />
                  <span className="text-[13px] text-fyp-text">{g.groupNo || "—"} — {g.title}</span>
                </label>
              ))}
              {proposalsForCreate.length === 0 && (
                <p className="text-[13px] text-fyp-text-muted text-center py-4">No unassigned approved groups</p>
              )}
            </div>
          </div>
          <div>
            <label className="text-[13px] text-fyp-text-secondary block mb-2">Select Jury Members (min 3)</label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {juryUsers.map((j) => (
                <label key={j._id} className="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer bg-fyp-elevated">
                  <input type="checkbox" checked={newPanel.juryMemberIds.includes(j._id)} onChange={() => setNewPanel((p) => ({ ...p, juryMemberIds: toggleItem(p.juryMemberIds, j._id) }))} />
                  <span className="text-[13px] text-fyp-text">{j.name}</span>
                  <span className="text-[11px] text-fyp-text-muted ml-auto">{j.department || j.email}</span>
                </label>
              ))}
              {juryUsers.length === 0 && (
                <p className="text-[13px] text-fyp-text-muted text-center py-4">No approved jury members found</p>
              )}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[13px] text-fyp-text-secondary block mb-1.5">Defense Date/Slot</label>
              <input type="datetime-local" value={newPanel.defenseDate} onChange={(e) => setNewPanel({ ...newPanel, defenseDate: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl outline-none bg-fyp-elevated border border-fyp-border text-fyp-text text-xs" />
            </div>
            <div>
              <label className="text-[13px] text-fyp-text-secondary block mb-1.5">Room</label>
              <input value={newPanel.room} onChange={(e) => setNewPanel({ ...newPanel, room: e.target.value })}
                placeholder="e.g. CR-103"
                className="w-full px-3 py-2.5 rounded-xl outline-none bg-fyp-elevated border border-fyp-border text-fyp-text text-[13px]" />
            </div>
          </div>
        </div>
      </Modal>

      {/* Edit Panel Modal */}
      <Modal
        open={editPanel !== null}
        onClose={() => !submitting && setEditPanel(null)}
        title="Edit Panel"
        maxWidth="max-w-xl"
        footer={
          <>
            <button type="button" onClick={() => setEditPanel(null)} disabled={submitting} className="flex-1 py-2.5 rounded-xl text-sm bg-fyp-elevated text-fyp-text-secondary border border-fyp-border disabled:opacity-50">
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveEdit}
              disabled={
                submitting ||
                !editPanel ||
                editPanel.juryMemberIds.length < 3 ||
                editPanel.assignedGroupIds.length === 0 ||
                !editPanel.name.trim()
              }
              className="flex-1 py-2.5 rounded-xl text-sm hover:opacity-90 bg-fyp-amber text-[#0d1117] font-semibold disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Save changes"}
            </button>
          </>
        }
      >
        {editPanel && (
          <div className="space-y-5">
            <div>
              <label className="text-[13px] text-fyp-text-secondary block mb-1.5">Panel Name *</label>
              <input
                value={editPanel.name}
                onChange={(e) => setEditPanel({ ...editPanel, name: e.target.value })}
                placeholder="e.g. Panel A"
                className="w-full px-4 py-2.5 rounded-xl outline-none bg-fyp-elevated border border-fyp-border text-fyp-text text-[13px]"
              />
            </div>
            <div>
              <label className="text-[13px] text-fyp-text-secondary block mb-2">Assigned Groups</label>
              <div className="space-y-2 max-h-36 overflow-y-auto">
                {proposalsForEdit.map((g) => (
                  <label key={g._id} className="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer bg-fyp-elevated">
                    <input
                      type="checkbox"
                      checked={editPanel.assignedGroupIds.includes(g._id)}
                      onChange={() =>
                        setEditPanel((prev) =>
                          prev
                            ? {
                                ...prev,
                                assignedGroupIds: toggleItem(prev.assignedGroupIds, g._id),
                              }
                            : prev
                        )
                      }
                    />
                    <span className="text-[13px] text-fyp-text">
                      {g.groupNo || "—"} — {g.title}
                    </span>
                  </label>
                ))}
                {proposalsForEdit.length === 0 && (
                  <p className="text-[13px] text-fyp-text-muted text-center py-4">No groups available</p>
                )}
              </div>
            </div>
            <div>
              <label className="text-[13px] text-fyp-text-secondary block mb-2">Jury Members (min 3)</label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {juryUsers.map((j) => (
                  <label key={j._id} className="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer bg-fyp-elevated">
                    <input
                      type="checkbox"
                      checked={editPanel.juryMemberIds.includes(j._id)}
                      onChange={() =>
                        setEditPanel((prev) =>
                          prev
                            ? {
                                ...prev,
                                juryMemberIds: toggleItem(prev.juryMemberIds, j._id),
                              }
                            : prev
                        )
                      }
                    />
                    <span className="text-[13px] text-fyp-text">{j.name}</span>
                    <span className="text-[11px] text-fyp-text-muted ml-auto">{j.department || j.email}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[13px] text-fyp-text-secondary block mb-1.5">Defense Date/Slot</label>
                <input
                  type="datetime-local"
                  value={editPanel.defenseDate}
                  onChange={(e) => setEditPanel({ ...editPanel, defenseDate: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl outline-none bg-fyp-elevated border border-fyp-border text-fyp-text text-xs"
                />
              </div>
              <div>
                <label className="text-[13px] text-fyp-text-secondary block mb-1.5">Room</label>
                <input
                  value={editPanel.room}
                  onChange={(e) => setEditPanel({ ...editPanel, room: e.target.value })}
                  placeholder="e.g. CR-103"
                  className="w-full px-3 py-2.5 rounded-xl outline-none bg-fyp-elevated border border-fyp-border text-fyp-text text-[13px]"
                />
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
