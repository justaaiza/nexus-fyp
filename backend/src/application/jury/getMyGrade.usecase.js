/**
 * Use case: View grade and feedback already submitted by this jury member for a submission.
 */
async function getMyGrade(feedbackRepo, { submissionId, juryUserId }) {
  const feedback = await feedbackRepo.findBySubmissionAndGiver(submissionId, juryUserId);
  return feedback; // null if not yet graded
}

module.exports = getMyGrade;
