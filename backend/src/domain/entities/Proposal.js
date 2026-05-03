// ============================================================
// Domain Entity: Proposal
// ============================================================

class Proposal {
  constructor({ id, title, description, teamMembers, supervisorPreference, submittedBy, status, rejectionReason, createdAt }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.teamMembers = teamMembers || [];
    this.supervisorPreference = supervisorPreference || null;
    this.submittedBy = submittedBy;
    this.status = status || 'pending';   // pending | approved | rejected
    this.rejectionReason = rejectionReason || null;
    this.createdAt = createdAt || new Date();
  }

  isPending()   { return this.status === 'pending'; }
  isApproved()  { return this.status === 'approved'; }
  isRejected()  { return this.status === 'rejected'; }

  approve() {
    this.status = 'approved';
    this.rejectionReason = null;
  }

  reject(reason) {
    this.status = 'rejected';
    this.rejectionReason = reason;
  }
}

module.exports = Proposal;
