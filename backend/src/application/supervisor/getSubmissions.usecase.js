/**
 * Use case: Get all submissions by students supervised by this supervisor.
 * Finds all approved proposals where this supervisor is the preference,
 * collects team member IDs, then fetches their submissions.
 */
async function getSubmissions(proposalRepo, submissionRepo, supervisorId) {
  const proposals = await proposalRepo.findBySupervisorPreference(supervisorId);
  const approvedProposals = proposals.filter((p) => p.status === 'approved');

  const studentIds = new Set();
  for (const proposal of approvedProposals) {
    // Include the submitter (group leader)
    if (proposal.submittedBy) {
      studentIds.add((proposal.submittedBy._id || proposal.submittedBy).toString());
    }
    // Include all team members
    for (const member of proposal.teamMembers) {
      studentIds.add((member._id || member).toString());
    }
  }

  if (studentIds.size === 0) {
    return [];
  }

  return submissionRepo.findByMultipleUsers([...studentIds]);
}

module.exports = getSubmissions;
