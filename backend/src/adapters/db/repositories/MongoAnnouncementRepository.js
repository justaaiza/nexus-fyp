const IAnnouncementRepository = require('../../../ports/repositories/IAnnouncementRepository');
const AnnouncementModel = require('../models/AnnouncementModel');

class MongoAnnouncementRepository extends IAnnouncementRepository {
  async findById(id) {
    return AnnouncementModel.findById(id)
      .populate('postedBy', 'name email role')
      .lean();
  }

  async findAll(filter = {}) {
    return AnnouncementModel.find(filter)
      .populate('postedBy', 'name email role')
      .sort({ createdAt: -1 })
      .lean();
  }

  async create(announcementData) {
    const announcement = await AnnouncementModel.create(announcementData);
    return announcement.toObject();
  }

  async updateById(id, data) {
    return AnnouncementModel.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .populate('postedBy', 'name email role')
      .lean();
  }

  async deleteById(id) {
    return AnnouncementModel.findByIdAndDelete(id).lean();
  }
}

module.exports = MongoAnnouncementRepository;
