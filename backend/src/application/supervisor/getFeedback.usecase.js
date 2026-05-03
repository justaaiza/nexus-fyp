/**
 * Use case: Get feedback already given on a specific submission.
 */
async function getFeedback(feedbackRepo, submissionId) {
  return feedbackRepo.findBySubmission(submissionId);
}

module.exports = getFeedback;
