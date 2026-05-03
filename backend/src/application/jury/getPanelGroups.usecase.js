const AppError = require('../../utils/AppError');

/**
 * Use case: Get student groups assigned to a specific panel.
 * Validates that the jury member is actually part of this panel.
 */
async function getPanelGroups(panelRepo, { panelId, juryUserId }) {
  const panel = await panelRepo.findById(panelId);
  if (!panel) {
    throw new AppError('Panel not found.', 404);
  }

  const isMember = panel.juryMembers.some(
    (member) => (member._id || member).toString() === juryUserId.toString()
  );
  if (!isMember) {
    throw new AppError('You are not assigned to this panel.', 403);
  }

  return panel.assignedGroups;
}

module.exports = getPanelGroups;
