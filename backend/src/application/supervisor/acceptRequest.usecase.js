const AppError = require('../../utils/AppError');
const { ensureProposalIsPending, ensureProposalTargetsSupervisor } = require('../../domain/rules/eligibilityRules');

/**
 * Use case: Accept a supervision request (approve the proposal from supervisor side).
 */
async function acceptRequest(proposalRepo, { proposalId, supervisorId }) {
  const proposal = await proposalRepo.findById(proposalId);
  if (!proposal) {
    throw new AppError('Proposal not found.', 404);
  }

  ensureProposalTargetsSupervisor(proposal, supervisorId);
  ensureProposalIsPending(proposal);

  const updated = await proposalRepo.updateById(proposalId, { status: 'approved' });
  return updated;
}

module.exports = acceptRequest;
