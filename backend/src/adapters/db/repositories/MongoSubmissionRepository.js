const ISubmissionRepository = require('../../../ports/repositories/ISubmissionRepository');
const SubmissionModel = require('../models/SubmissionModel');

class MongoSubmissionRepository extends ISubmissionRepository {
  async findById(id) {
    return SubmissionModel.findById(id)
      .populate('milestone', 'title description deadline phase')
      .populate('submittedBy', 'name email rollNumber')
      .lean();
  }

  async findAll(filter = {}) {
    return SubmissionModel.find(filter)
      .populate('milestone', 'title description deadline phase')
      .populate('submittedBy', 'name email rollNumber')
      .sort({ submittedAt: -1 })
      .lean();
  }

  async findBySubmittedBy(userId) {
    return SubmissionModel.find({ submittedBy: userId })
      .populate('milestone', 'title description deadline phase')
      .sort({ submittedAt: -1 })
      .lean();
  }

  async findByMilestone(milestoneId) {
    return SubmissionModel.find({ milestone: milestoneId })
      .populate('submittedBy', 'name email rollNumber')
      .sort({ submittedAt: -1 })
      .lean();
  }

  async findByMultipleUsers(userIds) {
    return SubmissionModel.find({ submittedBy: { $in: userIds } })
      .populate('milestone', 'title description deadline phase')
      .populate('submittedBy', 'name email rollNumber')
      .sort({ submittedAt: -1 })
      .lean();
  }

  async create(submissionData) {
    const submission = await SubmissionModel.create(submissionData);
    return submission.toObject();
  }

  async updateById(id, data) {
    return SubmissionModel.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .populate('milestone', 'title description deadline phase')
      .populate('submittedBy', 'name email rollNumber')
      .lean();
  }
}

module.exports = MongoSubmissionRepository;
