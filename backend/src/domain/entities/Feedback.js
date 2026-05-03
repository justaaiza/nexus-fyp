// ============================================================
// Domain Entity: Feedback
// ============================================================

class Feedback {
  constructor({ id, submission, givenBy, comment, grade, createdAt }) {
    this.id = id;
    this.submission = submission;   // ref: Submission
    this.givenBy = givenBy;         // ref: User (supervisor | jury)
    this.comment = comment;
    this.grade = grade ?? null;     // numeric grade
    this.createdAt = createdAt || new Date();
  }
}

module.exports = Feedback;
