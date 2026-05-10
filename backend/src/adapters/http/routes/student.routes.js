const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();

const {
  postProposal,
  getProposal,
  updateProposal,
  getProposalOptions,
  listMilestones,
  uploadSubmission,
  getSubmissions,
  removeSubmission,
  getFeedback,
  getStudentProfile,
  updateStudentProfile,
} = require('../controllers/StudentController');

const { postGroup, getGroup, respondGroup, postInviteMembers } = require('../controllers/GroupController');

const verifyToken = require('../middlewares/auth.middleware');
const authorizeRoles = require('../middlewares/role.middleware');
const checkValidationResult = require('../middlewares/express-validation.middleware');
const upload = require('../middlewares/upload.middleware');

// All student routes require authentication and the 'student' role
router.use(verifyToken, authorizeRoles('student'));

// ── Proposals ─────────────────────────────────────────────────────────────────
// POST /api/student/proposals
router.post(
  '/proposals',
  [
    body('title').trim().notEmpty().withMessage('Proposal title is required.'),
    body('description').trim().notEmpty().withMessage('Description is required.'),
  ],
  checkValidationResult,
  postProposal
);

// GET /api/student/proposals/me
router.get('/proposals/me', getProposal);

// GET /api/student/proposals/options
router.get('/proposals/options', getProposalOptions);

// PUT /api/student/proposals/:proposalId
router.put('/proposals/:proposalId', updateProposal);

// ── Groups ───────────────────────────────────────────────────────────────────
// POST /api/student/groups
router.post('/groups', postGroup);

// GET /api/student/groups/me
router.get('/groups/me', getGroup);

// POST /api/student/groups/:groupId/invite — leader adds more invitees while forming
router.post(
  '/groups/:groupId/invite',
  [
    param('groupId').isMongoId().withMessage('Invalid group ID.'),
    body('memberIds').isArray({ min: 1 }).withMessage('memberIds must be a non-empty array.'),
    body('memberIds.*').isMongoId().withMessage('Invalid member ID.'),
  ],
  checkValidationResult,
  postInviteMembers
);

// PATCH /api/student/groups/:groupId/respond
router.patch('/groups/:groupId/respond', respondGroup);

// ── Milestones ────────────────────────────────────────────────────────────────
// GET /api/student/milestones
router.get('/milestones', listMilestones);

// POST /api/student/milestones/:milestoneId/submit
router.post(
  '/milestones/:milestoneId/submit',
  [param('milestoneId').isMongoId().withMessage('Invalid milestone ID.')],
  checkValidationResult,
  upload.single('file'),
  uploadSubmission
);

// ── Submissions ───────────────────────────────────────────────────────────────
// GET /api/student/submissions/me
router.get('/submissions/me', getSubmissions);

// DELETE /api/student/submissions/:submissionId
router.delete('/submissions/:submissionId', removeSubmission);

// ── Feedback ──────────────────────────────────────────────────────────────────
// GET /api/student/feedback/me
router.get('/feedback/me', getFeedback);

// ── Profile ───────────────────────────────────────────────────────────────────
// GET /api/student/profile
router.get('/profile', getStudentProfile);

// PUT /api/student/profile
router.put(
  '/profile',
  [body('name').optional().trim().notEmpty().withMessage('Name cannot be empty.')],
  checkValidationResult,
  updateStudentProfile
);

module.exports = router;
