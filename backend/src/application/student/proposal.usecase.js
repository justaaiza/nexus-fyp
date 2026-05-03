const proposalRepository = require('../../adapters/db/repositories/MongoProposalRepository');
const userRepository = require('../../adapters/db/repositories/MongoUserRepository');
const { canStudentSubmitProposal } = require('../../domain/rules/eligibility');

// ─── Submit Proposal ─────────────────────────────────────────────────────────
const submitProposal = async (studentId, { title, description, teamMembers, supervisorPreference, domain, techStack, repoUrl, groupNo }) => {
  const user = await userRepository.findById(studentId);
  if (!user) throw Object.assign(new Error('User not found.'), { statusCode: 404 });

  const { allowed, reason } = canStudentSubmitProposal(user);
  if (!allowed) throw Object.assign(new Error(reason), { statusCode: 403 });

  // Only one active proposal per student
  const existing = await proposalRepository.findByUserId(studentId);
  if (existing) throw Object.assign(new Error('You have already submitted a proposal.'), { statusCode: 409 });

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
  const proposal = await proposalRepository.findByUserId(studentId);
  if (!proposal) throw Object.assign(new Error('No proposal found.'), { statusCode: 404 });
  return proposal;
};

module.exports = { submitProposal, getMyProposal };
