const AppError = require('../../utils/AppError');
const { validateGrade, validateFeedbackComment, ensureSubmissionNotAlreadyGradedBy } = require('../../domain/rules/gradingRules');

/**
 * Use case: Record a grade and feedback for a submission during/after defense.
 */
async function submitGrade(feedbackRepo, submissionRepo, { submissionId, juryUserId, comment, grade, rubric }) {
  const submission = await submissionRepo.findById(submissionId);
  if (!submission) {
    throw new AppError('Submission not found.', 404);
  }

  validateFeedbackComment(comment);
  validateGrade(grade);

  const existing = await feedbackRepo.findBySubmissionAndGiver(submissionId, juryUserId);
  ensureSubmissionNotAlreadyGradedBy(existing);

  const feedback = await feedbackRepo.create({
    submission: submissionId,
    givenBy: juryUserId,
    comment,
    grade,
    rubric,
  });

  /* Mark submission as graded */
  await submissionRepo.updateById(submissionId, { status: 'graded' });

  return feedback;
}

module.exports = submitGrade;
