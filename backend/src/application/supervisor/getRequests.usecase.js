/**
 * Use case: Get all supervision requests (proposals) directed at this supervisor.
 */
async function getRequests(proposalRepo, supervisorId) {
  const proposals = await proposalRepo.findBySupervisorPreference(supervisorId);
  return proposals;
}

module.exports = getRequests;
