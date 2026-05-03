const AppError = require('../../utils/AppError');

/**
 * Domain rules for grading and feedback.
 * Pure business logic — no framework dependencies.
 */

const GRADE_MIN = 0;
const GRADE_MAX = 100;

function validateGrade(grade) {
  if (typeof grade !== 'number' || grade < GRADE_MIN || grade > GRADE_MAX) {
    throw new AppError(`Grade must be a number between ${GRADE_MIN} and ${GRADE_MAX}`, 400);
  }
}

function validateFeedbackComment(comment) {
  if (!comment || typeof comment !== 'string' || comment.trim().length === 0) {
    throw new AppError('Feedback comment is required and cannot be empty', 400);
  }
}

function ensureSubmissionNotAlreadyGradedBy(existingFeedback) {
  if (existingFeedback) {
    throw new AppError('You have already submitted feedback for this submission', 409);
  }
}

module.exports = {
  GRADE_MIN,
  GRADE_MAX,
  validateGrade,
  validateFeedbackComment,
  ensureSubmissionNotAlreadyGradedBy,
};
