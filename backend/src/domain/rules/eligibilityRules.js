const AppError = require('../../utils/AppError');

/**
 * Domain rules for supervision eligibility and request handling.
 * Pure business logic — no framework dependencies.
 */

const VALID_ROLES = ['student', 'supervisor', 'admin', 'jury'];

function isValidRole(role) {
  return VALID_ROLES.includes(role);
}

function ensureUserApproved(user) {
  if (!user.isApproved) {
    throw new AppError('Your account has not been approved yet', 403);
  }
}

function ensureSupervisorOwnsResource(resourceCreatorId, supervisorId) {
  if (resourceCreatorId.toString() !== supervisorId.toString()) {
    throw new AppError('You do not have permission to modify this resource', 403);
  }
}

function ensureProposalIsPending(proposal) {
  if (proposal.status !== 'pending') {
    throw new AppError(`Proposal has already been ${proposal.status}`, 400);
  }
}

function ensureProposalTargetsSupervisor(proposal, supervisorId) {
  if (!proposal.supervisorPreference || proposal.supervisorPreference.toString() !== supervisorId.toString()) {
    throw new AppError('This proposal is not addressed to you', 403);
  }
}

module.exports = {
  VALID_ROLES,
  isValidRole,
  ensureUserApproved,
  ensureSupervisorOwnsResource,
  ensureProposalIsPending,
  ensureProposalTargetsSupervisor,
};
