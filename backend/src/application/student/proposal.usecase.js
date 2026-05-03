const MongoProposalRepository = require('../../adapters/db/repositories/MongoProposalRepository');
const proposalRepository = new MongoProposalRepository();
const MongoUserRepository = require('../../adapters/db/repositories/MongoUserRepository');
const userRepository = new MongoUserRepository();
const { canStudentSubmitProposal } = require('../../domain/rules/eligibility');

// ─── Submit Proposal ─────────────────────────────────────────────────────────
const submitProposal = async (studentId, { title, description, teamMembers, supervisorPreference, domain, techStack, repoUrl, groupNo }) => {
  const user = await userRepository.findById(studentId);
  if (!user) throw Object.assign(new Error('User not found.'), { statusCode: 404 });

  const { allowed, reason } = canStudentSubmitProposal(user);
  if (!allowed) throw Object.assign(new Error(reason), { statusCode: 403 });

  // Only one active proposal per student
  const existing = await proposalRepository.findBySubmittedBy(studentId);
  if (existing && existing.length > 0) throw Object.assign(new Error('You have already submitted a proposal.'), { statusCode: 409 });

  const proposal = await proposalRepository.create({
    title,
    description,
    teamMembers: teamMembers || [],
    supervisorPreference: supervisorPreference || null,
    submittedBy: studentId,
    domain: domain || null,
    techStack: techStack || [],
    repoUrl: repoUrl || null,
    groupNo: groupNo || null,
    status: 'pending',
  });

  return proposalRepository.findById(proposal._id);
};

// ─── Get Own Proposal ─────────────────────────────────────────────────────────
const getMyProposal = async (studentId) => {
  const proposals = await proposalRepository.findBySubmittedBy(studentId);
  if (!proposals || proposals.length === 0) throw Object.assign(new Error('No proposal found.'), { statusCode: 404 });
  return proposals[0];
};

module.exports = { submitProposal, getMyProposal };
