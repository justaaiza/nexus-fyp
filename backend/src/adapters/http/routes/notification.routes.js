const express = require('express');
const router = express.Router();
const authorize = require('../middlewares/auth.middleware');
const notificationController = require('../controllers/NotificationController');

router.use(authorize); // Require authentication for all notification routes

router.get('/', (req, res, next) => notificationController.getNotifications(req, res, next));
router.post('/read-all', (req, res, next) => notificationController.markAllAsReadHandler(req, res, next));
router.post('/:id/read', (req, res, next) => notificationController.markAsReadHandler(req, res, next));

module.exports = router;
