const AppError = require('../../utils/AppError');
const { validateGrade, validateFeedbackComment, ensureSubmissionNotAlreadyGradedBy } = require('../../domain/rules/gradingRules');

/**
 * Use case: Submit feedback and grade for a student submission.
 */
async function submitFeedback(feedbackRepo, submissionRepo, { submissionId, supervisorId, comment, grade }) {
  const submission = await submissionRepo.findById(submissionId);
  if (!submission) {
    throw new AppError('Submission not found.', 404);
  }

  validateFeedbackComment(comment);
  validateGrade(grade);

  const existingFeedback = await feedbackRepo.findBySubmissionAndGiver(submissionId, supervisorId);
  ensureSubmissionNotAlreadyGradedBy(existingFeedback);

  const feedback = await feedbackRepo.create({
    submission: submissionId,
    givenBy: supervisorId,
    comment,
    grade,
  });

  /* Mark the submission as graded */
  await submissionRepo.updateById(submissionId, { status: 'graded' });

  return feedback;
}

module.exports = submitFeedback;
