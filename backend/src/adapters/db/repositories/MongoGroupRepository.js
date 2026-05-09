const Group = require('../models/GroupModel');
class MongoGroupRepository {
  async create(data) { return Group.create(data); }
  async findById(id) { return Group.findById(id).populate('leader members.user'); }
  async findByUserId(userId) {
    return Group.find({ $or: [{ leader: userId }, { 'members.user': userId }] }).populate('leader members.user');
  }
  async updateById(id, data) { return Group.findByIdAndUpdate(id, data, { new: true }).populate('leader members.user'); }
  async deleteById(id) { return Group.findByIdAndDelete(id); }
}
module.exports = MongoGroupRepository;