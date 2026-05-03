// ============================================================
// Domain Rules: Eligibility & Business Invariants
// No framework dependencies — pure JS functions.
// ============================================================

/**
 * A student can only submit a proposal if their account is approved.
 * @param {import('../entities/User')} user
 * @returns {{ allowed: boolean, reason?: string }}
 */
function canStudentSubmitProposal(user) {
  if (user.role !== 'student') {
    return { allowed: false, reason: 'Only students can submit proposals.' };
  }
  if (!user.isApproved) {
    return { allowed: false, reason: 'Your account is pending coordinator approval.' };
  }
  return { allowed: true };
}

/**
 * A student can only submit to a milestone that is not past its deadline.
 * @param {import('../entities/Milestone')} milestone
 * @returns {{ allowed: boolean, reason?: string }}
 */
function canStudentSubmitToMilestone(milestone) {
  if (milestone.isPastDeadline()) {
    return { allowed: false, reason: 'The deadline for this milestone has passed.' };
  }
  return { allowed: true };
}

/**
 * A panel must have at least the minimum number of jury members.
 * @param {string[]} juryMemberIds
 * @param {number} min
 * @returns {{ valid: boolean, reason?: string }}
 */
function validatePanelSize(juryMemberIds, min = 3) {
  if (!juryMemberIds || juryMemberIds.length < min) {
    return { valid: false, reason: `A panel must have at least ${min} jury members.` };
  }
  return { valid: true };
}

/**
 * A panel must have at least one assigned group.
 * @param {string[]} groupIds
 * @returns {{ valid: boolean, reason?: string }}
 */
function validatePanelGroups(groupIds) {
  if (!groupIds || groupIds.length === 0) {
    return { valid: false, reason: 'A panel must be assigned at least one group.' };
  }
  return { valid: true };
}

module.exports = {
  canStudentSubmitProposal,
  canStudentSubmitToMilestone,
  validatePanelSize,
  validatePanelGroups,
};
