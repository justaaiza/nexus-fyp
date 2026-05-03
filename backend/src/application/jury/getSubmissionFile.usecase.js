const AppError = require('../../utils/AppError');

/**
 * Use case: Get a specific submission file for review.
 */
async function getSubmissionFile(submissionRepo, submissionId) {
  const submission = await submissionRepo.findById(submissionId);
  if (!submission) {
    throw new AppError('Submission not found.', 404);
  }
  return submission;
}

module.exports = getSubmissionFile;
