/**
 * Use case: Get all milestones created by this supervisor.
 */
async function getMilestones(milestoneRepo, supervisorId) {
  return milestoneRepo.findByCreatedBy(supervisorId);
}

module.exports = getMilestones;
