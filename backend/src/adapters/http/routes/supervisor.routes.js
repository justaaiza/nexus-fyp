const express = require('express');
const router = express.Router();
const supervisorController = require('../controllers/SupervisorController');
const verifyToken = require('../middlewares/auth.middleware');
const authorizeRoles = require('../middlewares/role.middleware');
const validate = require('../middlewares/validation.middleware');
const {
  createMilestoneSchema,
  updateMilestoneSchema,
  milestoneParamsSchema,
  proposalParamsSchema,
  submissionParamsSchema,
  submitFeedbackSchema,
  feedbackParamsSchema,
  updateProfileSchema,
} = require('../validators/supervisor.validator');

/* All routes require authentication + supervisor role */
router.use(verifyToken, authorizeRoles('supervisor'));

/* ── Supervision Requests ── */
router.get('/requests', supervisorController.getRequests);
router.patch('/requests/:proposalId/accept', validate(proposalParamsSchema), supervisorController.acceptRequest);
router.patch('/requests/:proposalId/reject', validate(proposalParamsSchema), supervisorController.rejectRequest);

/* ── Milestones ── */
router.post('/milestones', validate(createMilestoneSchema), supervisorController.createMilestone);
router.get('/milestones', supervisorController.getMilestones);
router.put('/milestones/:id', validate(updateMilestoneSchema), supervisorController.updateMilestone);
router.delete('/milestones/:id', validate(milestoneParamsSchema), supervisorController.deleteMilestone);

/* ── Submissions ── */
router.get('/submissions', supervisorController.getSubmissions);
router.get('/submissions/:id', validate(submissionParamsSchema), supervisorController.getSubmissionById);

/* ── Feedback ── */
router.post('/submissions/:submissionId/feedback', validate(submitFeedbackSchema), supervisorController.submitFeedback);
router.get('/submissions/:submissionId/feedback', validate(feedbackParamsSchema), supervisorController.getFeedback);

/* ── Profile ── */
router.get('/profile', supervisorController.getProfile);
router.put('/profile', validate(updateProfileSchema), supervisorController.updateProfile);

module.exports = router;
