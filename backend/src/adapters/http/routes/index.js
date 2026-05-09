const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const supervisorRoutes = require('./supervisor.routes');
const juryRoutes = require('./jury.routes');
const studentRoutes = require('./student.routes');
const adminRoutes = require('./admin.routes');
const notificationRoutes = require('./notification.routes');

router.use('/auth', authRoutes);
router.use('/supervisor', supervisorRoutes);
router.use('/jury', juryRoutes);
router.use('/student', studentRoutes);
router.use('/admin', adminRoutes);
router.use('/notifications', notificationRoutes);

module.exports = router;
