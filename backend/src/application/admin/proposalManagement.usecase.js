const proposalRepository = require('../../adapters/db/repositories/MongoProposalRepository');

// ─── List All Proposals ───────────────────────────────────────────────────────
const listProposals = async (filters = {}) => {
  return proposalRepository.findAll(filters);
};

// ─── Approve Proposal ─────────────────────────────────────────────────────────
const approveProposal = async (proposalId) => {
  const proposal = await proposalRepository.findById(proposalId);
  if (!proposal) throw Object.assign(new Error('Proposal not found.'), { statusCode: 404 });

  return proposalRepository.update(proposalId, { status: 'approved', rejectionReason: null });
};

// ─── Reject Proposal ──────────────────────────────────────────────────────────
const rejectProposal = async (proposalId, reason) => {
  const proposal = await proposalRepository.findById(proposalId);
  if (!proposal) throw Object.assign(new Error('Proposal not found.'), { statusCode: 404 });

  return proposalRepository.update(proposalId, {
    status: 'rejected',
    rejectionReason: reason || 'No reason provided.',
  });
};

module.exports = { listProposals, approveProposal, rejectProposal };
