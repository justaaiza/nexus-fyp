const AppError = require('../../utils/AppError');
const { ensureSupervisorOwnsResource } = require('../../domain/rules/eligibilityRules');

/**
 * Use case: Update an existing milestone.
 */
async function updateMilestone(milestoneRepo, { milestoneId, supervisorId, updateData }) {
  const milestone = await milestoneRepo.findById(milestoneId);
  if (!milestone) {
    throw new AppError('Milestone not found.', 404);
  }

  ensureSupervisorOwnsResource(milestone.createdBy._id || milestone.createdBy, supervisorId);

  const updated = await milestoneRepo.updateById(milestoneId, updateData);
  return updated;
}

module.exports = updateMilestone;
