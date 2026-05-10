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

  const MongoGroupRepository = require('../../adapters/db/repositories/MongoGroupRepository');
  const groupRepo = new MongoGroupRepository();
  const groups = await groupRepo.findByUserId(studentId);
  if (!groups || groups.length === 0 || groups[0].status !== 'formed') {
    throw Object.assign(new Error('You must form a group before submitting a proposal.'), { statusCode: 400 });
  }

  const group = groups[0];
  const members = group.members.map(m => m.user._id);
  if (group.leader.toString() !== studentId.toString() && !members.some(id => id.toString() === studentId.toString())) {
    members.push(studentId);
  }
  const allTeamMembers = [...new Set([group.leader._id.toString(), ...members.map(m => m.toString())])];

  const proposal = await proposalRepository.create({
    title,
    description,
    teamMembers: allTeamMembers.filter(id => id.toString() !== studentId.toString()),
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
  // Get all proposals. A student might be a teamMember instead of the submitter.
  let proposals = await proposalRepository.findBySubmittedBy(studentId);
  if (!proposals || proposals.length === 0) {
    const all = await proposalRepository.findAll();
    proposals = all.filter(p => p.teamMembers.some(m => m._id.toString() === studentId.toString()));
  }
  if (!proposals || proposals.length === 0) throw Object.assign(new Error('No proposal found.'), { statusCode: 404 });
  return proposals[0];
};


// ─── Edit Proposal ────────────────────────────────────────────────────────────
const editProposal = async (studentId, proposalId, payload) => {
  const proposal = await proposalRepository.findById(proposalId);
  if (!proposal) throw Object.assign(new Error('Proposal not found.'), { statusCode: 404 });
  
  const isMember = proposal.submittedBy._id.toString() === studentId.toString() || 
                   proposal.teamMembers.some(m => m._id.toString() === studentId.toString());
  if (!isMember) throw Object.assign(new Error('Access denied.'), { statusCode: 403 });
  
  if (proposal.status === 'approved') {
    throw Object.assign(new Error('Cannot edit an approved proposal.'), { statusCode: 400 });
  }

  if (proposal.status !== 'pending' && proposal.status !== 'rejected') {
    throw Object.assign(new Error('Cannot edit this proposal.'), { statusCode: 400 });
  }

  if (payload.teamMembers) {
    if (payload.teamMembers.length < 1 || payload.teamMembers.length > 2) {
      throw Object.assign(new Error('Group must have 2 to 3 members in total (you + 1 or 2 others).'), { statusCode: 400 });
    }
  }

  const supervisorPref =
    payload.supervisorPreference !== undefined && payload.supervisorPreference !== ''
      ? payload.supervisorPreference
      : proposal.supervisorPreference?._id || proposal.supervisorPreference || null;

  const updateFields = {
    title: payload.title || proposal.title,
    description: payload.description || proposal.description,
    domain: payload.domain || proposal.domain,
    techStack: payload.techStack || proposal.techStack,
    repoUrl: payload.repoUrl || proposal.repoUrl,
    groupNo: payload.groupNo || proposal.groupNo,
    teamMembers: payload.teamMembers || proposal.teamMembers.map(m => m._id),
    supervisorPreference: supervisorPref,
  };

  if (proposal.status === 'rejected') {
    updateFields.status = 'pending';
    updateFields.rejectionReason = null;
  }

  const updated = await proposalRepository.updateById(proposalId, updateFields);

  return updated;
};

// ─── Get Available Students & Supervisors ────────────────────────────────────
const getAvailableOptions = async () => {
  // Students who are approved and not in any team
  const MongoGroupRepository = require('../../adapters/db/repositories/MongoGroupRepository');
  const groupRepo = new MongoGroupRepository();
  const allGroups = await groupRepo.findByUserId(); // Find all actually. Wait findByUserId() expects a user ID. We need findAll.
  // Wait, I didn't implement findAll in MongoGroupRepository. Let's just use the Mongoose model directly for this quick query.
  const Group = require('../../adapters/db/models/GroupModel');
  const allGroupsRaw = await Group.find({});
  
  const busyStudentIds = new Set();
  
  allGroupsRaw.forEach(g => {
    if (g.leader) busyStudentIds.add(g.leader.toString());
    if (g.members) {
      g.members.forEach(m => busyStudentIds.add(m.user.toString()));
    }
  });

  const students = await userRepository.findAll({ role: 'student' });
  const availableStudents = students.filter(s => !busyStudentIds.has(s._id.toString()));

  const supervisors = await userRepository.findAll({ role: 'supervisor' });

  return { availableStudents, supervisors };
};

module.exports = { submitProposal, getMyProposal, editProposal, getAvailableOptions };

