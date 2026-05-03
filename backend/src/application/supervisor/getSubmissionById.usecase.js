const AppError = require('../../utils/AppError');

/**
 * Use case: Get a specific submission by ID.
 */
async function getSubmissionById(submissionRepo, submissionId) {
  const submission = await submissionRepo.findById(submissionId);
  if (!submission) {
    throw new AppError('Submission not found.', 404);
  }
  return submission;
}

module.exports = getSubmissionById;
