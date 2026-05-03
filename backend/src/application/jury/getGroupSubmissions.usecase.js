const AppError = require('../../utils/AppError');

/**
 * Use case: Get all submissions for a student group (proposal).
 * The groupId is actually a Proposal ID — we get team members from the proposal,
 * then fetch all submissions by those users.
 */
async function getGroupSubmissions(proposalRepo, submissionRepo, groupId) {
  const proposal = await proposalRepo.findById(groupId);
  if (!proposal) {
    throw new AppError('Student group (proposal) not found.', 404);
  }

  const studentIds = proposal.teamMembers.map((m) => (m._id || m).toString());
  if (studentIds.length === 0) {
    return [];
  }

  return submissionRepo.findByMultipleUsers(studentIds);
}

module.exports = getGroupSubmissions;
