/**
 * supervisor.routes.js
 *
 * ─── EXTENSION POINT FOR PARTNER ────────────────────────────────────────────
 * This file is intentionally minimal. Your partner (handling Supervisor and
 * Jury roles) should add their routes here.
 *
 * Suggested endpoints to implement:
 *  POST   /api/supervisor/milestones               — Create a milestone
 *  PUT    /api/supervisor/milestones/:id           — Update milestone
 *  DELETE /api/supervisor/milestones/:id           — Delete milestone
 *  GET    /api/supervisor/requests                 — View supervision requests
 *  PATCH  /api/supervisor/requests/:id/accept      — Accept request
 *  PATCH  /api/supervisor/requests/:id/reject      — Reject request
 *  GET    /api/supervisor/submissions              — View student submissions
 *  POST   /api/supervisor/submissions/:id/feedback — Post feedback + grade
 *
 * The MilestoneModel, SubmissionModel, FeedbackModel, and all repositories
 * are already in place — just wire them up here.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const express = require('express');
const router = express.Router();

const verifyToken = require('../middlewares/auth.middleware');
const authorizeRoles = require('../middlewares/role.middleware');

// All supervisor routes require authentication + 'supervisor' role
router.use(verifyToken, authorizeRoles('supervisor'));

// TODO (Partner): Add supervisor route handlers below
// Example:
// const SupervisorController = require('../controllers/SupervisorController');
// router.get('/milestones', SupervisorController.getMilestones);

router.get('/', (req, res) => {
  res.json({ success: true, message: 'Supervisor API — routes to be implemented by partner.' });
});

module.exports = router;
