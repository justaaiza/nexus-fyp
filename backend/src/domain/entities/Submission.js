/**
 * Submission domain entity.
 * Represents a student's deliverable upload against a milestone.
 */
class Submission {
  constructor({ id, milestone, submittedBy, fileUrl, fileType, submittedAt, status }) {
    this.id = id;
    this.milestone = milestone;
    this.submittedBy = submittedBy;
    this.fileUrl = fileUrl;
    this.fileType = fileType; // pdf | zip
    this.submittedAt = submittedAt || new Date();
    this.status = status || 'submitted'; // submitted | graded
  }

  isGraded() {
    return this.status === 'graded';
  }
}

module.exports = Submission;
