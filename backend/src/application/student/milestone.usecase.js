const MongoMilestoneRepository = require('../../adapters/db/repositories/MongoMilestoneRepository');
const milestoneRepository = new MongoMilestoneRepository();
const MongoSubmissionRepository = require('../../adapters/db/repositories/MongoSubmissionRepository');
const submissionRepository = new MongoSubmissionRepository();
const MilestoneModel = require('../../adapters/db/models/MilestoneModel');
const { canStudentSubmitToMilestone } = require('../../domain/rules/eligibility');
const MilestoneEntity = require('../../domain/entities/Milestone');

// ─── Get All Milestones (student view) ───────────────────────────────────────
const getMilestones = async (studentId) => {
  return milestoneRepository.findByAssignedTo(studentId);
};

// ─── Submit Deliverable Against a Milestone ───────────────────────────────────
const submitDeliverable = async (milestoneId, studentId, fileInfo) => {
  const milestoneDoc = await milestoneRepository.findById(milestoneId);
  if (!milestoneDoc) throw Object.assign(new Error('Milestone not found.'), { statusCode: 404 });

  // Wrap in domain entity to use business rules
  const milestone = new MilestoneEntity({
    id: milestoneDoc._id,
    title: milestoneDoc.title,
    description: milestoneDoc.description,
    deadline: milestoneDoc.deadline,
    phase: milestoneDoc.phase,
    createdBy: milestoneDoc.createdBy,
    assignedTo: milestoneDoc.assignedTo,
  });

  // Uncomment to enforce deadline:
  // const { allowed, reason } = canStudentSubmitToMilestone(milestone);
  // if (!allowed) throw Object.assign(new Error(reason), { statusCode: 403 });

  // Detect file type from extension
  const ext = fileInfo.originalname.split('.').pop().toLowerCase();
  const validTypes = { pdf: 'pdf', zip: 'zip', mp4: 'mp4' };
  const fileType = validTypes[ext] || 'pdf';

  const submission = await submissionRepository.create({
    milestone: milestoneId,
    submittedBy: studentId,
    fileUrl: `/uploads/${fileInfo.filename}`,
    fileName: fileInfo.originalname,
    fileSize: fileInfo.size,
    fileType,
    status: 'submitted',
  });

  return submissionRepository.findById(submission._id);
};

// ─── Get Own Submissions ──────────────────────────────────────────────────────
const getMySubmissions = async (studentId) => {
  const MongoGroupRepository = require('../../adapters/db/repositories/MongoGroupRepository');
  const groupRepo = new MongoGroupRepository();
  const groups = await groupRepo.findByUserId(studentId);
  
  let memberIds = [studentId];
  if (groups && groups.length > 0) {
    const group = groups[0];
    memberIds = [...new Set([group.leader._id.toString(), ...group.members.map(m => m.user._id.toString())])];
  }
  
  return submissionRepository.findByMultipleUsers(memberIds);
};

// ─── Delete Own Submission ────────────────────────────────────────────────────
const deleteSubmission = async (submissionId, studentId) => {
  const submission = await submissionRepository.findById(submissionId);
  if (!submission) throw Object.assign(new Error('Submission not found.'), { statusCode: 404 });
  if (submission.submittedBy._id.toString() !== studentId.toString() && submission.submittedBy.toString() !== studentId.toString()) {
    throw Object.assign(new Error('Unauthorized to delete this submission.'), { statusCode: 403 });
  }
  // Optional: check if graded, and if so, don't allow deletion
  if (submission.status === 'graded') {
    throw Object.assign(new Error('Cannot delete a graded submission.'), { statusCode: 403 });
  }

  await submissionRepository.deleteById(submissionId);
  return { success: true };
};

module.exports = { getMilestones, submitDeliverable, getMySubmissions, deleteSubmission };
