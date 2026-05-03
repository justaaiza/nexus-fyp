const announcementRepository = require('../../adapters/db/repositories/MongoAnnouncementRepository');

// ─── Create Announcement ──────────────────────────────────────────────────────
const createAnnouncement = async (adminId, { title, content, audience, type }) => {
  const announcement = await announcementRepository.create({
    title,
    content,
    audience: audience || 'all',
    type: type || 'info',
    postedBy: adminId,
    pinned: false,
  });
  return announcement;
};

// ─── List Announcements ───────────────────────────────────────────────────────
const listAnnouncements = async () => {
  return announcementRepository.findAll();
};

// ─── Delete Announcement ──────────────────────────────────────────────────────
const deleteAnnouncement = async (id) => {
  const doc = await announcementRepository.delete(id);
  if (!doc) throw Object.assign(new Error('Announcement not found.'), { statusCode: 404 });
};

// ─── Toggle Pin ────────────────────────────────────────────────────────────────
const togglePin = async (id) => {
  const AnnouncementModel = require('../../adapters/db/models/AnnouncementModel');
  const doc = await AnnouncementModel.findById(id);
  if (!doc) throw Object.assign(new Error('Announcement not found.'), { statusCode: 404 });
  return announcementRepository.update(id, { pinned: !doc.pinned });
};

module.exports = { createAnnouncement, listAnnouncements, deleteAnnouncement, togglePin };
