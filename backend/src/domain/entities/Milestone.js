/**
 * Milestone domain entity.
 * Represents a deliverable checkpoint created by a supervisor.
 */
class Milestone {
  constructor({ id, title, description, deadline, phase, type, createdBy, assignedTo }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.deadline = deadline;
    this.phase = phase; // FYP-1 | FYP-2
    this.type = type; // document | defence | code
    this.createdBy = createdBy;
    this.assignedTo = assignedTo || [];
  }

  isOverdue() {
    return new Date() > new Date(this.deadline);
  }
}

module.exports = Milestone;
