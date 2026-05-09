const AnnouncementModel = require('../../adapters/db/models/AnnouncementModel');

const getUserNotifications = async (userId, userRole) => {
  // Map user role to audience type. Example: student -> students
  let audienceType;
  if (userRole === 'student') audienceType = 'students';
  else if (userRole === 'supervisor') audienceType = 'supervisors';
  else if (userRole === 'jury') audienceType = 'jury';
  else audienceType = 'admin'; // Admin might just see all, but mostly for end users

  const query = {
    $or: [{ audience: 'all' }]
  };
  if (audienceType) {
    query.$or.push({ audience: audienceType });
  }

  const announcements = await AnnouncementModel.find(query)
    .populate('postedBy', 'name email')
    .sort({ pinned: -1, createdAt: -1 })
    .lean();

  return announcements.map((ann) => {
    // Check if the current user has read it
    const isRead = ann.readBy && ann.readBy.some((id) => id.toString() === userId.toString());
    delete ann.readBy; // don't expose everyone who read it
    return { ...ann, isRead };
  });
};

const markAsRead = async (userId, announcementId) => {
  const ann = await AnnouncementModel.findById(announcementId);
  if (!ann) throw Object.assign(new Error('Announcement not found'), { statusCode: 404 });
  
  if (!ann.readBy.includes(userId)) {
    ann.readBy.push(userId);
    await ann.save();
  }
  return { success: true };
};

const markAllAsRead = async (userId, userRole) => {
  let audienceType;
  if (userRole === 'student') audienceType = 'students';
  else if (userRole === 'supervisor') audienceType = 'supervisors';
  else if (userRole === 'jury') audienceType = 'jury';
  
  const query = {
    $or: [{ audience: 'all' }]
  };
  if (audienceType) {
    query.$or.push({ audience: audienceType });
  }
  
  await AnnouncementModel.updateMany(
    { ...query, readBy: { $ne: userId } },
    { $push: { readBy: userId } }
  );
  return { success: true };
};

module.exports = {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
};
