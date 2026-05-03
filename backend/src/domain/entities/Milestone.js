// ============================================================
// Domain Entity: Milestone
// ============================================================

class Milestone {
  constructor({ id, title, description, deadline, phase, createdBy, assignedTo, createdAt }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.deadline = deadline;
    this.phase = phase || 'FYP-1';   // FYP-1 | FYP-2
    this.createdBy = createdBy;       // ref: User (supervisor)
    this.assignedTo = assignedTo || []; // ref: User[] (students / groups)
    this.createdAt = createdAt || new Date();
  }

  isPastDeadline() {
    return new Date() > new Date(this.deadline);
  }
}

module.exports = Milestone;
