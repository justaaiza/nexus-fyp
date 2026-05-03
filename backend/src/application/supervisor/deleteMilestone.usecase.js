const AppError = require('../../utils/AppError');
const { ensureSupervisorOwnsResource } = require('../../domain/rules/eligibilityRules');

/**
 * Use case: Delete a milestone.
 */
async function deleteMilestone(milestoneRepo, { milestoneId, supervisorId }) {
  const milestone = await milestoneRepo.findById(milestoneId);
  if (!milestone) {
    throw new AppError('Milestone not found.', 404);
  }

  ensureSupervisorOwnsResource(milestone.createdBy._id || milestone.createdBy, supervisorId);

  await milestoneRepo.deleteById(milestoneId);
  return { message: 'Milestone deleted successfully.' };
}

module.exports = deleteMilestone;
