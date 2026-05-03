const ISubmissionRepository = require('../../../ports/repositories/ISubmissionRepository');
const SubmissionModel = require('../models/SubmissionModel');

class MongoSubmissionRepository extends ISubmissionRepository {
  async create(data) {
    return SubmissionModel.create(data);
  }

  async findById(id) {
    return SubmissionModel.findById(id)
      .populate('milestone', 'title deadline phase')
      .populate('submittedBy', 'name email rollNumber');
  }

  async findByUserId(userId) {
    return SubmissionModel.find({ submittedBy: userId })
      .populate('milestone', 'title deadline phase description')
      .sort({ submittedAt: -1 });
  }

  async findAll(filters = {}) {
    const query = {};
    if (filters.milestone) query.milestone = filters.milestone;
    if (filters.status) query.status = filters.status;
    return SubmissionModel.find(query)
      .populate('milestone', 'title deadline phase')
      .populate('submittedBy', 'name email rollNumber')
      .sort({ submittedAt: -1 });
  }

  async update(id, data) {
    return SubmissionModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }
}

module.exports = new MongoSubmissionRepository();
