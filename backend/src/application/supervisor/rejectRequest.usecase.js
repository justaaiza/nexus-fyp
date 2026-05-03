const AppError = require('../../utils/AppError');
const { ensureProposalIsPending, ensureProposalTargetsSupervisor } = require('../../domain/rules/eligibilityRules');

/**
 * Use case: Reject a supervision request.
 */
async function rejectRequest(proposalRepo, { proposalId, supervisorId, rejectionReason }) {
  const proposal = await proposalRepo.findById(proposalId);
  if (!proposal) {
    throw new AppError('Proposal not found.', 404);
  }

  ensureProposalTargetsSupervisor(proposal, supervisorId);
  ensureProposalIsPending(proposal);

  const updated = await proposalRepo.updateById(proposalId, {
    status: 'rejected',
    rejectionReason: rejectionReason || 'Rejected by supervisor.',
  });
  return updated;
}

module.exports = rejectRequest;
