const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const {
  getUsers, approveUserHandler, rejectUserHandler, deleteUserHandler,
  getProposals, approveProposalHandler, rejectProposalHandler,
  createPanelHandler, getPanels, updatePanelHandler, deletePanelHandler,
  createAnnouncementHandler, getAnnouncements, deleteAnnouncementHandler, togglePinHandler,
  getStats,
} = require('../controllers/AdminController');

const verifyToken = require('../middlewares/auth.middleware');
const authorizeRoles = require('../middlewares/role.middleware');
const validate = require('../middlewares/validation.middleware');

// All admin routes require authentication and the 'admin' role
router.use(verifyToken, authorizeRoles('admin'));

// ── Dashboard Stats ────────────────────────────────────────────────────────────
// GET /api/admin/stats
router.get('/stats', getStats);

// ── User Management ────────────────────────────────────────────────────────────
// GET /api/admin/users?role=student
router.get('/users', getUsers);
// PATCH /api/admin/users/:id/approve
router.patch('/users/:id/approve', approveUserHandler);
// PATCH /api/admin/users/:id/reject
router.patch('/users/:id/reject', rejectUserHandler);
// DELETE /api/admin/users/:id
router.delete('/users/:id', deleteUserHandler);

// ── Proposal Management ───────────────────────────────────────────────────────
// GET /api/admin/proposals?status=pending
router.get('/proposals', getProposals);
// PATCH /api/admin/proposals/:id/approve
router.patch('/proposals/:id/approve', approveProposalHandler);
// PATCH /api/admin/proposals/:id/reject
router.patch(
  '/proposals/:id/reject',
  [body('reason').optional().trim()],
  validate,
  rejectProposalHandler
);

// ── Panel Management ──────────────────────────────────────────────────────────
// POST /api/admin/panels
router.post(
  '/panels',
  [
    body('name').trim().notEmpty().withMessage('Panel name is required.'),
    body('juryMembers').isArray({ min: 3 }).withMessage('At least 3 jury members are required.'),
    body('assignedGroups').isArray({ min: 1 }).withMessage('At least 1 group must be assigned.'),
  ],
  validate,
  createPanelHandler
);
// GET /api/admin/panels
router.get('/panels', getPanels);
// PUT /api/admin/panels/:id
router.put('/panels/:id', updatePanelHandler);
// DELETE /api/admin/panels/:id
router.delete('/panels/:id', deletePanelHandler);

// ── Announcements ─────────────────────────────────────────────────────────────
// POST /api/admin/announcements
router.post(
  '/announcements',
  [
    body('title').trim().notEmpty().withMessage('Title is required.'),
    body('content').trim().notEmpty().withMessage('Content is required.'),
    body('audience').optional().isIn(['all', 'students', 'supervisors', 'jury']),
    body('type').optional().isIn(['info', 'warning', 'success']),
  ],
  validate,
  createAnnouncementHandler
);
// GET /api/admin/announcements
router.get('/announcements', getAnnouncements);
// PATCH /api/admin/announcements/:id/pin
router.patch('/announcements/:id/pin', togglePinHandler);
// DELETE /api/admin/announcements/:id
router.delete('/announcements/:id', deleteAnnouncementHandler);

// ── Extension Point for Partner ───────────────────────────────────────────────
// TODO (Partner): Add supervisor-facing admin routes here (e.g., assign supervisor to proposal)
// TODO (Partner): Add jury-facing admin routes here (e.g., GET /api/admin/jury-scores)

module.exports = router;
