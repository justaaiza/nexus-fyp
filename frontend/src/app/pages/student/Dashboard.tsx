import { useState, useEffect } from "react";
import { CheckCircle2, Clock, AlertCircle, Upload, ChevronRight, Users, Calendar, TrendingUp, ExternalLink, RefreshCw, X, Search, Check, XCircle } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { StatCard } from "../../components/StatCard";
import { StatusBadge } from "../../components/StatusBadge";
import { Card } from "../../components/Card";
import { Modal } from "../../components/Modal";
import { studentAPI, getStoredUser } from "../../services/api";

type ProposalStatus = "pending" | "approved" | "rejected";

type Proposal = {
  _id: string;
  title: string;
  description: string;
  groupNo?: string;
  domain?: string;
  status: ProposalStatus;
  techStack?: string[];
  repoUrl?: string;
  teamMembers?: { _id: string; name: string; rollNumber?: string }[];
  supervisorPreference?: { _id: string; name: string; email: string };
};

type GroupMember = {
  user: { _id: string; name: string; email: string; rollNumber?: string };
  status: 'pending' | 'accepted' | 'rejected';
};

type Group = {
  _id: string;
  leader: { _id: string; name: string; email: string };
  members: GroupMember[];
  status: 'forming' | 'formed';
};

const statusColorMap: Record<ProposalStatus, string> = {
  approved: "#10b981",
  pending: "#f59e0b",
  rejected: "#ef4444",
};

export function StudentDashboard() {
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  const [form, setForm] = useState({ title: "", description: "", domain: "", groupNo: "", supervisorPreference: "" });
  const [options, setOptions] = useState<{ availableStudents: any[], supervisors: any[] }>({ availableStudents: [], supervisors: [] });
  
  const [selectedGroupMembers, setSelectedGroupMembers] = useState<string[]>([]);
  const [groupSubmitting, setGroupSubmitting] = useState(false);

  useEffect(() => {
    studentAPI.getProposalOptions().then((res: any) => setOptions(res.data)).catch(console.error);
  }, []);
  
  useEffect(() => {
    if (proposal) {
        setForm({
            title: proposal.title,
            description: proposal.description,
            domain: proposal.domain || "",
            groupNo: proposal.groupNo || "",
            supervisorPreference: proposal.supervisorPreference?._id || ""
        });
    }
  }, [proposal]);
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showSupervisorModal, setShowSupervisorModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const user = getStoredUser();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Try to fetch group first
      let myGroup = null;
      try {
        const groupRes = await studentAPI.getMyGroup() as { success: boolean; data: Group };
        myGroup = groupRes.data;
        setGroup(myGroup);
      } catch (err: any) {
        if (err.message !== "No group found.") {
          console.error("Group fetch error:", err);
        }
      }

      // If we have a group and it's formed, fetch proposal
      if (myGroup && myGroup.status === 'formed') {
        try {
          const propRes = await studentAPI.getMyProposal() as { success: boolean; data: Proposal };
          setProposal(propRes.data);
        } catch (err: any) {
          if (err.message !== "No proposal found.") {
            console.error("Proposal fetch error:", err);
          }
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboardData(); }, []);

  const handleCreateGroup = async () => {
    if (selectedGroupMembers.length === 0) {
      alert("Please select at least 1 team member.");
      return;
    }
    try {
      setGroupSubmitting(true);
      const res = await studentAPI.createGroup({ memberIds: selectedGroupMembers }) as { success: boolean; data: Group };
      setGroup(res.data);
      setShowMemberModal(false);
      setSelectedGroupMembers([]);
    } catch (err: any) {
      alert(err.message || "Failed to create group.");
    } finally {
      setGroupSubmitting(false);
    }
  };

  const handleRespondGroup = async (accept: boolean) => {
    if (!group) return;
    try {
      setGroupSubmitting(true);
      await studentAPI.respondGroup(group._id, accept);
      await fetchDashboardData();
    } catch (err: any) {
      alert(err.message || "Failed to respond.");
    } finally {
      setGroupSubmitting(false);
    }
  };

  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description) return;
    try {
      setSubmitting(true);
      let res;
      if (proposal) {
          res = await studentAPI.updateProposal(proposal._id, form) as { success: boolean; data: Proposal };
      } else {
          res = await studentAPI.submitProposal(form) as { success: boolean; data: Proposal };
      }
      setProposal(res.data);
      setShowForm(false);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to submit proposal.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <RefreshCw size={24} className="text-fyp-blue animate-spin mx-auto mb-3" />
          <p className="text-fyp-text-secondary text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const filteredStudents = options.availableStudents.filter(s => 
    s._id !== user?._id && (s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.rollNumber && s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const filteredSupervisors = options.supervisors.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group Formation UI
  if (!group || group.status === 'forming') {
    const isLeader = group?.leader._id === user?._id;
    const myMemberRecord = group?.members.find(m => m.user._id === user?._id);

    return (
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <PageHeader title="Group Formation" subtitle="Step 1: Form your team of 2-3 members" />
        
        {error && <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/30 text-red-400 text-sm">{error}</div>}

        {!group ? (
          <div className="p-10 rounded-2xl border-2 border-dashed border-fyp-border flex flex-col items-center justify-center gap-4 bg-fyp-card">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-fyp-blue/10">
              <Users size={28} className="text-fyp-blue" />
            </div>
            <div className="text-center">
              <h3 className="text-[17px] font-semibold text-fyp-text mb-1">Create your FYP Group</h3>
              <p className="text-sm text-fyp-text-secondary">Invite 1 or 2 other students to form your group. Once everyone accepts, you can submit a proposal.</p>
            </div>
            <button
              onClick={() => { setSearchQuery(""); setShowMemberModal(true); }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-fyp-blue text-white text-sm font-semibold hover:opacity-90 transition-all"
            >
              <Users size={15} /> Form Group
            </button>
          </div>
        ) : (
          <Card>
            <h3 className="text-base font-semibold text-fyp-text mb-4">Pending Group Request</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between p-3 rounded-xl bg-fyp-elevated border border-fyp-border">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-fyp-blue/20 text-fyp-blue flex items-center justify-center text-xs font-bold">
                    {group.leader.name.substring(0,2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-fyp-text">{group.leader.name} (Leader)</p>
                    <p className="text-xs text-fyp-text-muted">{group.leader.email}</p>
                  </div>
                </div>
                <StatusBadge label="Accepted" color="#10b981" />
              </div>
              
              {group.members.map((m) => (
                <div key={m.user._id} className="flex items-center justify-between p-3 rounded-xl bg-fyp-elevated border border-fyp-border">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-fyp-blue/10 text-fyp-text-secondary flex items-center justify-center text-xs font-bold">
                      {m.user.name.substring(0,2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-fyp-text">{m.user.name}</p>
                      <p className="text-xs text-fyp-text-muted">{m.user.email}</p>
                    </div>
                  </div>
                  <StatusBadge 
                    label={m.status.charAt(0).toUpperCase() + m.status.slice(1)} 
                    color={m.status === 'accepted' ? '#10b981' : m.status === 'rejected' ? '#ef4444' : '#f59e0b'} 
                  />
                </div>
              ))}
            </div>

            {!isLeader && myMemberRecord?.status === 'pending' && (
              <div className="flex gap-3 mt-4 pt-4 border-t border-fyp-border">
                <button 
                  disabled={groupSubmitting}
                  onClick={() => handleRespondGroup(false)} 
                  className="flex-1 py-2.5 rounded-xl text-sm bg-fyp-elevated text-fyp-red font-semibold border border-fyp-border disabled:opacity-50"
                >
                  Reject
                </button>
                <button 
                  disabled={groupSubmitting}
                  onClick={() => handleRespondGroup(true)} 
                  className="flex-1 py-2.5 rounded-xl text-sm bg-fyp-green text-white font-semibold disabled:opacity-50"
                >
                  Accept Request
                </button>
              </div>
            )}
            
            {isLeader && (
              <p className="text-sm text-fyp-text-secondary text-center mt-4">
                Waiting for all members to accept the group request...
              </p>
            )}
          </Card>
        )}

        <Modal open={showMemberModal} onClose={() => setShowMemberModal(false)} title="Select Team Members" subtitle="Choose 1 or 2 other students for your group.">
          <div className="mb-4 flex items-center gap-2 px-3 py-2 rounded-xl bg-fyp-elevated border border-fyp-border">
            <Search size={14} className="text-fyp-text-muted" />
            <input placeholder="Search by name, email or roll number..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="bg-transparent outline-none flex-1 text-fyp-text text-[13px]" />
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {filteredStudents.map((s: any) => (
              <div key={s._id} className="flex items-center justify-between p-3 rounded-xl bg-fyp-elevated border border-fyp-border">
                <div>
                  <p className="text-[13px] font-medium text-fyp-text">{s.name}</p>
                  <p className="text-xs text-fyp-text-muted">{s.email} {s.rollNumber ? `· ${s.rollNumber}` : ''}</p>
                </div>
                <button type="button" onClick={() => {
                  if (selectedGroupMembers.includes(s._id)) {
                    setSelectedGroupMembers(selectedGroupMembers.filter(id => id !== s._id));
                  } else if (selectedGroupMembers.length < 2) {
                    setSelectedGroupMembers([...selectedGroupMembers, s._id]);
                  } else {
                    alert("You can select up to 2 team members only.");
                  }
                }} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${selectedGroupMembers.includes(s._id) ? 'bg-fyp-red text-white' : 'bg-fyp-blue text-white'}`}>
                  {selectedGroupMembers.includes(s._id) ? 'Remove' : 'Select'}
                </button>
              </div>
            ))}
            {filteredStudents.length === 0 && <p className="text-[13px] text-fyp-text-muted text-center py-4">No available students found.</p>}
          </div>
          <div className="mt-4 flex justify-end gap-3">
             <button onClick={() => setShowMemberModal(false)} className="px-5 py-2.5 rounded-xl text-sm text-fyp-text-secondary">Cancel</button>
             <button onClick={handleCreateGroup} disabled={groupSubmitting} className="px-5 py-2.5 rounded-xl bg-fyp-blue text-white text-sm font-semibold disabled:opacity-50">
               {groupSubmitting ? "Sending..." : "Send Request"}
             </button>
          </div>
        </Modal>
      </div>
    );
  }

  // Proposal Flow (Group Formed)
  if (!proposal && !showForm) {
    return (
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <PageHeader title="Proposal Dashboard" subtitle="Step 2: Submit your FYP Proposal" />

        {error && (
          <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/30 text-red-400 text-sm">{error}</div>
        )}

        <div className="p-10 rounded-2xl border-2 border-dashed border-fyp-border flex flex-col items-center justify-center gap-4 bg-fyp-card">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-fyp-green/10">
            <CheckCircle2 size={28} className="text-fyp-green" />
          </div>
          <div className="text-center">
            <h3 className="text-[17px] font-semibold text-fyp-text mb-1">Group Formed Successfully</h3>
            <p className="text-sm text-fyp-text-secondary">Your team is ready. Any member can now submit the FYP proposal.</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-fyp-blue text-white text-sm font-semibold hover:opacity-90 transition-all"
          >
            <Upload size={15} /> Submit Proposal
          </button>
        </div>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <PageHeader title="Proposal Dashboard" subtitle="Step 2: FYP Proposal" />
        <div className="p-8 rounded-2xl bg-fyp-card border border-fyp-border max-w-3xl mx-auto w-full shadow-sm">
          <h3 className="text-[18px] font-semibold text-fyp-text mb-6">{proposal ? "Edit FYP Proposal" : "Submit FYP Proposal"}</h3>
          <form onSubmit={handleSubmitProposal} className="space-y-4">
            <div>
              <label className="text-[13px] text-fyp-text-secondary block mb-1.5">Project Title *</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Nexus Attendance Intelligence" required
                className="w-full px-4 py-3 rounded-xl outline-none bg-fyp-elevated border border-fyp-border text-fyp-text text-[13px]" />
            </div>
            <div>
              <label className="text-[13px] text-fyp-text-secondary block mb-1.5">Description *</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe your project idea, objectives, and expected outcomes..." rows={4} required
                className="w-full px-4 py-3 rounded-xl outline-none resize-none bg-fyp-elevated border border-fyp-border text-fyp-text text-[13px]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[13px] text-fyp-text-secondary block mb-1.5">Domain</label>
                <input value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })}
                  placeholder="e.g. AI + Web"
                  className="w-full px-4 py-3 rounded-xl outline-none bg-fyp-elevated border border-fyp-border text-fyp-text text-[13px]" />
              </div>
              <div>
                <label className="text-[13px] text-fyp-text-secondary block mb-1.5">Group No.</label>
                <input value={form.groupNo} onChange={(e) => setForm({ ...form, groupNo: e.target.value })}
                  placeholder="e.g. G-08"
                  className="w-full px-4 py-3 rounded-xl outline-none bg-fyp-elevated border border-fyp-border text-fyp-text text-[13px]" />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-[13px] text-fyp-text-secondary block mb-1.5">Supervisor Preference *</label>
                <button type="button" onClick={() => { setSearchQuery(""); setShowSupervisorModal(true); }}
                  className="w-full px-4 py-3 rounded-xl outline-none bg-fyp-elevated border border-fyp-border text-fyp-text text-[13px] text-left">
                  {form.supervisorPreference ? options.supervisors.find((s: any) => s._id === form.supervisorPreference)?.name || "Selected" : "Select Supervisor"}
                </button>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => { if(proposal) setShowForm(false); }} disabled={!proposal} className="flex-1 py-2.5 rounded-xl text-sm bg-fyp-elevated text-fyp-text-secondary border border-fyp-border disabled:opacity-50">Cancel</button>
              <button type="submit" disabled={submitting} className="flex-1 py-2.5 rounded-xl text-sm bg-fyp-blue text-white font-semibold hover:opacity-90 disabled:opacity-60">
                {submitting ? "Submitting..." : "Submit Proposal"}
              </button>
            </div>
          </form>
        </div>

        <Modal open={showSupervisorModal} onClose={() => setShowSupervisorModal(false)} title="Select Supervisor" subtitle="Choose your preferred supervisor.">
          <div className="mb-4 flex items-center gap-2 px-3 py-2 rounded-xl bg-fyp-elevated border border-fyp-border">
            <Search size={14} className="text-fyp-text-muted" />
            <input placeholder="Search supervisor by name..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="bg-transparent outline-none flex-1 text-fyp-text text-[13px]" />
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {filteredSupervisors.map((s: any) => (
              <div key={s._id} className="flex items-center justify-between p-3 rounded-xl bg-fyp-elevated border border-fyp-border">
                <div>
                  <p className="text-[13px] font-medium text-fyp-text">{s.name}</p>
                  <p className="text-xs text-fyp-text-muted">{s.email}</p>
                </div>
                <button type="button" onClick={() => {
                  setForm({ ...form, supervisorPreference: s._id });
                  setShowSupervisorModal(false);
                }} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-fyp-blue text-white">
                  Select
                </button>
              </div>
            ))}
            {filteredSupervisors.length === 0 && <p className="text-[13px] text-fyp-text-muted text-center py-4">No supervisors found.</p>}
          </div>
        </Modal>
      </div>
    );
  }

  if (!proposal) return null;

  const statusColor = statusColorMap[proposal.status] || "#f59e0b";
  const teamMembers = proposal.teamMembers || [];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <PageHeader title="Proposal Dashboard" subtitle="Spring 2026 · Your FYP Group" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Proposal Status" value={proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)} icon={CheckCircle2} color={statusColor} />
        <StatCard label="Team Size" value={teamMembers.length.toString() || "1"} icon={Users} color="#3b7fe8" />
        <StatCard label="Domain" value={proposal.domain || "—"} icon={TrendingUp} color="#8b5cf6" />
        <StatCard label="Group No." value={proposal.groupNo || "—"} icon={Calendar} color="#f59e0b" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-fyp-text">{proposal.title}</h3>
              <p className="text-[13px] text-fyp-text-secondary mt-1">{proposal.groupNo || "No group no."} · {proposal.domain || "General"}</p>
            </div>
            {proposal.repoUrl && (
              <a href={proposal.repoUrl} target="_blank" rel="noreferrer" className="text-fyp-blue text-[13px] flex items-center gap-1 hover:underline">
                View repo <ExternalLink size={12} />
              </a>
            )}
          </div>

          <div className="mb-4">
            <StatusBadge label={proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)} color={statusColor} />
          </div>

          {proposal.status === "rejected" && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/20 border border-red-500/25 text-red-400 text-[13px]">
              <strong>Rejected:</strong> {(proposal as unknown as { rejectionReason?: string }).rejectionReason || "No reason provided."}
            </div>
          )}

          <p className="text-[13px] text-fyp-text-secondary leading-relaxed mb-4">
            {showDetails ? proposal.description : `${proposal.description.slice(0, 150)}...`}
          </p>

          <button onClick={() => setShowDetails((prev) => !prev)} className="text-fyp-blue text-[13px] flex items-center gap-1 hover:underline mb-4">
            {showDetails ? "Show less" : "Read more"}
          </button>

          {proposal.supervisorPreference && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-fyp-elevated border border-fyp-border mb-4">
              <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 bg-fyp-green/20 text-fyp-green text-[13px] font-semibold">
                {proposal.supervisorPreference.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
              </div>
              <div>
                <p className="text-[13px] font-medium text-fyp-text">{proposal.supervisorPreference.name}</p>
                <p className="text-xs text-fyp-text-muted">{proposal.supervisorPreference.email}</p>
              </div>
            </div>
          )}

          {teamMembers.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Users size={14} className="text-fyp-text-muted" />
                <span className="text-[13px] text-fyp-text-secondary">Team Members</span>
              </div>
              <div className="space-y-2">
                {teamMembers.map((member) => (
                  <div key={member._id} className="flex items-center gap-3 p-3 rounded-xl bg-fyp-elevated border border-fyp-border">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-fyp-blue/20 text-fyp-blue text-[11px] font-semibold">
                      {member.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-fyp-text">{member.name}</p>
                      <p className="text-xs text-fyp-text-muted">{member.rollNumber || "—"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle size={15} className="text-fyp-text-muted" />
            <h3 className="text-[15px] font-semibold text-fyp-text">Proposal Status</h3>
          </div>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-fyp-elevated border border-fyp-border text-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: `${statusColor}20` }}>
                <CheckCircle2 size={22} color={statusColor} />
              </div>
              <p className="text-[15px] font-semibold text-fyp-text capitalize">{proposal.status}</p>
              <p className="text-[12px] text-fyp-text-muted mt-1">
                {proposal.status === "pending" && "Awaiting coordinator review."}
                {proposal.status === "approved" && "Your proposal has been approved!"}
                {proposal.status === "rejected" && "Your proposal was rejected."}
              </p>
            </div>
            {proposal.status !== "approved" && (
              <button 
                onClick={() => setShowForm(true)} 
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm text-fyp-text-secondary border border-fyp-border hover:bg-fyp-elevated transition-all"
              >
                <Upload size={13} /> {proposal.status === "rejected" ? "Submit Revised Proposal" : "Edit Proposal"}
              </button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
