const milestoneRepository = require('../../adapters/db/repositories/MongoMilestoneRepository');
const submissionRepository = require('../../adapters/db/repositories/MongoSubmissionRepository');
const MilestoneModel = require('../../adapters/db/models/MilestoneModel');
const { canStudentSubmitToMilestone } = require('../../domain/rules/eligibility');
const MilestoneEntity = require('../../domain/entities/Milestone');

// ─── Get All Milestones (student view) ───────────────────────────────────────
const getMilestones = async () => {
  return milestoneRepository.findAll({});
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
  return submissionRepository.findByUserId(studentId);
};

module.exports = { getMilestones, submitDeliverable, getMySubmissions };
