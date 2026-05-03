/**
 * Feedback domain entity.
 * Represents a supervisor's or jury member's feedback on a submission.
 */
class Feedback {
  constructor({ id, submission, givenBy, comment, grade, createdAt }) {
    this.id = id;
    this.submission = submission;
    this.givenBy = givenBy;
    this.comment = comment;
    this.grade = grade;
    this.createdAt = createdAt || new Date();
  }
}

module.exports = Feedback;
