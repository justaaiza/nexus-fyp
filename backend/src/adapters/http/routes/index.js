const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const supervisorRoutes = require('./supervisor.routes');
const juryRoutes = require('./jury.routes');

router.use('/auth', authRoutes);
router.use('/supervisor', supervisorRoutes);
router.use('/jury', juryRoutes);

/*
 * ─────────────────────────────────────────────────────────
 *  TODO — EXTENSION POINTS FOR PARTNER
 * ─────────────────────────────────────────────────────────
 *
 *  Student routes:
 *    const studentRoutes = require('./student.routes');
 *    router.use('/student', studentRoutes);
 *
 *  Admin / Coordinator routes:
 *    const adminRoutes = require('./admin.routes');
 *    router.use('/admin', adminRoutes);
 *
 *  Create the corresponding route files in this directory,
 *  following the same pattern as supervisor.routes.js and
 *  jury.routes.js (verifyToken + authorizeRoles guard).
 * ─────────────────────────────────────────────────────────
 */

module.exports = router;
