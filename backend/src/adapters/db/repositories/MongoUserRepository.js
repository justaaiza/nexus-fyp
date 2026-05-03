const IUserRepository = require('../../../ports/repositories/IUserRepository');
const UserModel = require('../models/UserModel');

class MongoUserRepository extends IUserRepository {
  async create(data) {
    return UserModel.create(data);
  }

  async findById(id) {
    return UserModel.findById(id);
  }

  async findByEmail(email) {
    return UserModel.findOne({ email }).select('+password');
  }

  async findAll(filters = {}) {
    const query = {};
    if (filters.role) query.role = filters.role;
    if (filters.isApproved !== undefined) query.isApproved = filters.isApproved;
    return UserModel.find(query).sort({ createdAt: -1 });
  }

  async update(id, data) {
    return UserModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id) {
    return UserModel.findByIdAndDelete(id);
  }
}

module.exports = new MongoUserRepository();
