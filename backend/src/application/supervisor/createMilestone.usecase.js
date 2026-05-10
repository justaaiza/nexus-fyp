/**
 * Use case: Create a new milestone.
 */
async function createMilestone(milestoneRepo, { title, description, deadline, phase, type, assignedTo, supervisorId }) {
  const milestone = await milestoneRepo.create({
    title,
    description,
    deadline,
    phase,
    type,
    assignedTo,
    createdBy: supervisorId,
  });
  return milestone;
}

module.exports = createMilestone;
