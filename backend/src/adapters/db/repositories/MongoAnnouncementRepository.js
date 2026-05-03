const IAnnouncementRepository = require('../../../ports/repositories/IAnnouncementRepository');
const AnnouncementModel = require('../models/AnnouncementModel');

class MongoAnnouncementRepository extends IAnnouncementRepository {
  async create(data) {
    return AnnouncementModel.create(data);
  }

  async findAll() {
    return AnnouncementModel.find()
      .populate('postedBy', 'name email')
      .sort({ pinned: -1, createdAt: -1 });
  }

  async update(id, data) {
    return AnnouncementModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id) {
    return AnnouncementModel.findByIdAndDelete(id);
  }
}

module.exports = new MongoAnnouncementRepository();
