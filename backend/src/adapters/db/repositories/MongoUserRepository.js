const IUserRepository = require('../../../ports/repositories/IUserRepository');
const UserModel = require('../models/UserModel');

class MongoUserRepository extends IUserRepository {
  async findById(id) {
    return UserModel.findById(id).lean();
  }

  async findByIdWithPassword(id) {
    return UserModel.findById(id).select('+password').lean();
  }

  async findByEmail(email) {
    return UserModel.findOne({ email }).lean();
  }

  async findByEmailWithPassword(email) {
    return UserModel.findOne({ email }).select('+password').lean();
  }

  async findAll(filter = {}) {
    return UserModel.find(filter).sort({ createdAt: -1 }).lean();
  }

  async create(userData) {
    const user = await UserModel.create(userData);
    const { password, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  }

  async updateById(id, data) {
    return UserModel.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
  }

  async deleteById(id) {
    return UserModel.findByIdAndDelete(id).lean();
  }

  async countByFilter(filter = {}) {
    return UserModel.countDocuments(filter);
  }
}

module.exports = MongoUserRepository;
