// ============================================================
// Domain Entity: Submission
// ============================================================

class Submission {
  constructor({ id, milestone, submittedBy, fileUrl, fileType, submittedAt, status }) {
    this.id = id;
    this.milestone = milestone;           // ref: Milestone
    this.submittedBy = submittedBy;       // ref: User
    this.fileUrl = fileUrl;
    this.fileType = fileType;             // pdf | zip
    this.submittedAt = submittedAt || new Date();
    this.status = status || 'submitted';  // submitted | graded
  }

  isGraded() { return this.status === 'graded'; }
}

module.exports = Submission;
