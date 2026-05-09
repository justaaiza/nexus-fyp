const { getUserNotifications, markAsRead, markAllAsRead } = require('../../../application/shared/notification.usecase');

class NotificationController {
  async getNotifications(req, res, next) {
    try {
      const notifications = await getUserNotifications(req.user.id, req.user.role);
      res.status(200).json({ success: true, data: notifications });
    } catch (error) {
      next(error);
    }
  }

  async markAsReadHandler(req, res, next) {
    try {
      await markAsRead(req.user.id, req.params.id);
      res.status(200).json({ success: true });
    } catch (error) {
      next(error);
    }
  }

  async markAllAsReadHandler(req, res, next) {
    try {
      await markAllAsRead(req.user.id, req.user.role);
      res.status(200).json({ success: true });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new NotificationController();
