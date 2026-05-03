const express = require('express');
const router = express.Router();
const juryController = require('../controllers/JuryController');
const verifyToken = require('../middlewares/auth.middleware');
const authorizeRoles = require('../middlewares/role.middleware');
const validate = require('../middlewares/validation.middleware');
const {
  panelParamsSchema,
  groupSubmissionsSchema,
  submissionParamsSchema,
  submitGradeSchema,
  updateProfileSchema,
} = require('../validators/jury.validator');

/* All routes require authentication + jury role */
router.use(verifyToken, authorizeRoles('jury'));

/* ── Panels ── */
router.get('/panels/me', juryController.getMyPanels);
router.get('/panels/:panelId/groups', validate(panelParamsSchema), juryController.getPanelGroups);

/* ── Submissions ── */
router.get('/submissions/:groupId', validate(groupSubmissionsSchema), juryController.getGroupSubmissions);
router.get('/submissions/:submissionId/file', validate(submissionParamsSchema), juryController.getSubmissionFile);

/* ── Grading ── */
router.post('/submissions/:submissionId/grade', validate(submitGradeSchema), juryController.submitGrade);
router.get('/submissions/:submissionId/grade', validate(submissionParamsSchema), juryController.getMyGrade);

/* ── Profile ── */
router.get('/profile', juryController.getProfile);
router.put('/profile', validate(updateProfileSchema), juryController.updateProfile);

module.exports = router;
