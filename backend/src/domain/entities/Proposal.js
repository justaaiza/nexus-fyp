/**
 * Proposal domain entity.
 * Represents a student group's FYP proposal.
 */
class Proposal {
  constructor({ id, title, description, teamMembers, supervisorPreference, submittedBy, status, rejectionReason, createdAt }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.teamMembers = teamMembers || [];
    this.supervisorPreference = supervisorPreference;
    this.submittedBy = submittedBy;
    this.status = status || 'pending'; // pending | approved | rejected
    this.rejectionReason = rejectionReason || null;
    this.createdAt = createdAt || new Date();
  }

  isPending() {
    return this.status === 'pending';
  }

  isApproved() {
    return this.status === 'approved';
  }

  isRejected() {
    return this.status === 'rejected';
  }
}

module.exports = Proposal;
