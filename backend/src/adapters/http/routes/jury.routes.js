/**
 * jury.routes.js
 *
 * ─── EXTENSION POINT FOR PARTNER ────────────────────────────────────────────
 * This file is intentionally minimal. Your partner (handling Jury role)
 * should add their routes here.
 *
 * Suggested endpoints to implement:
 *  GET    /api/jury/projects                  — View assigned projects (via Panel)
 *  GET    /api/jury/deliverables              — View project deliverables
 *  POST   /api/jury/submissions/:id/score     — Submit scores + feedback
 *  GET    /api/jury/scores                    — View all jury scores
 *
 * The FeedbackModel, PanelModel, SubmissionModel are already in place.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const express = require('express');
const router = express.Router();

const verifyToken = require('../middlewares/auth.middleware');
const authorizeRoles = require('../middlewares/role.middleware');

router.use(verifyToken, authorizeRoles('jury'));

// TODO (Partner): Add jury route handlers below
router.get('/', (req, res) => {
  res.json({ success: true, message: 'Jury API — routes to be implemented by partner.' });
});

module.exports = router;
