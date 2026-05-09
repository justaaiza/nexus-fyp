const fs = require('fs');
const path = './src/application/student/proposal.usecase.js';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "module.exports = { submitProposal, getMyProposal };",
`
// ─── Edit Proposal ────────────────────────────────────────────────────────────
const editProposal = async (studentId, proposalId, payload) => {
  const proposal = await proposalRepository.findById(proposalId);
  if (!proposal) throw Object.assign(new Error('Proposal not found.'), { statusCode: 404 });
  
  const isMember = proposal.submittedBy._id.toString() === studentId.toString() || 
                   proposal.teamMembers.some(m => m._id.toString() === studentId.toString());
  if (!isMember) throw Object.assign(new Error('Access denied.'), { statusCode: 403 });
  
  if (proposal.status !== 'pending') {
    throw Object.assign(new Error('Cannot edit a proposal that is already approved or rejected.'), { statusCode: 400 });
  }
  
  if (payload.teamMembers) {
    if (payload.teamMembers.length < 1 || payload.teamMembers.length > 2) {
      throw Object.assign(new Error('Group must have 2 to 3 members in total (you + 1 or 2 others).'), { statusCode: 400 });
    }
  }

  const updated = await proposalRepository.updateById(proposalId, {
    title: payload.title || proposal.title,
    description: payload.description || proposal.description,
    domain: payload.domain || proposal.domain,
    techStack: payload.techStack || proposal.techStack,
    repoUrl: payload.repoUrl || proposal.repoUrl,
    groupNo: payload.groupNo || proposal.groupNo,
    teamMembers: payload.teamMembers || proposal.teamMembers.map(m => m._id),
    supervisorPreference: payload.supervisorPreference || proposal.supervisorPreference?._id || null,
  });

  return updated;
};

// ─── Get Available Students & Supervisors ────────────────────────────────────
const getAvailableOptions = async () => {
  // Students who are approved and not in any team
  const allProposals = await proposalRepository.findAll();
  const busyStudentIds = new Set();
  
  allProposals.forEach(p => {
    if (p.submittedBy) busyStudentIds.add(p.submittedBy._id.toString());
    if (p.teamMembers) {
      p.teamMembers.forEach(m => busyStudentIds.add(m._id.toString()));
    }
  });

  const students = await userRepository.findAll({ role: 'student', isApproved: true });
  const availableStudents = students.filter(s => !busyStudentIds.has(s._id.toString()));

  const supervisors = await userRepository.findAll({ role: 'supervisor', isApproved: true });

  return { availableStudents, supervisors };
};

module.exports = { submitProposal, getMyProposal, editProposal, getAvailableOptions };
`
);

// update submitProposal validation
content = content.replace(
  "  if (existing && existing.length > 0) throw Object.assign(new Error('You have already submitted a proposal.'), { statusCode: 409 });",
  "  if (existing && existing.length > 0) throw Object.assign(new Error('You have already submitted a proposal.'), { statusCode: 409 });\n\n  if (!teamMembers || teamMembers.length < 1 || teamMembers.length > 2) {\n    throw Object.assign(new Error('Group must have 2 to 3 members in total (you + 1 or 2 others).'), { statusCode: 400 });\n  }"
);

// update getMyProposal condition
content = content.replace(
  "const proposals = await proposalRepository.findBySubmittedBy(studentId);",
  "// Get all proposals. A student might be a teamMember instead of the submitter.\n  let proposals = await proposalRepository.findBySubmittedBy(studentId);\n  if (!proposals || proposals.length === 0) {\n    const all = await proposalRepository.findAll();\n    proposals = all.filter(p => p.teamMembers.some(m => m._id.toString() === studentId.toString()));\n  }"
)

fs.writeFileSync(path, content, 'utf8');
console.log("Updated usecase.");
