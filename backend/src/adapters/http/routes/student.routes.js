const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();

const {
  postProposal,
  getProposal,
  listMilestones,
  uploadSubmission,
  getSubmissions,
  getFeedback,
  getStudentProfile,
  updateStudentProfile,
} = require('../controllers/StudentController');

const verifyToken = require('../middlewares/auth.middleware');
const authorizeRoles = require('../middlewares/role.middleware');
const validate = require('../middlewares/validation.middleware');
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
  validate,
  postProposal
);

// GET /api/student/proposals/me
router.get('/proposals/me', getProposal);

// ── Milestones ────────────────────────────────────────────────────────────────
// GET /api/student/milestones
router.get('/milestones', listMilestones);

// POST /api/student/milestones/:milestoneId/submit
router.post(
  '/milestones/:milestoneId/submit',
  [param('milestoneId').isMongoId().withMessage('Invalid milestone ID.')],
  validate,
  upload.single('file'),
  uploadSubmission
);

// ── Submissions ───────────────────────────────────────────────────────────────
// GET /api/student/submissions/me
router.get('/submissions/me', getSubmissions);

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
  validate,
  updateStudentProfile
);

module.exports = router;
