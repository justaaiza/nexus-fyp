const IMilestoneRepository = require('../../../ports/repositories/IMilestoneRepository');
const MilestoneModel = require('../models/MilestoneModel');

class MongoMilestoneRepository extends IMilestoneRepository {
  async findById(id) {
    return MilestoneModel.findById(id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email rollNumber')
      .lean();
  }

  async findAll(filter = {}) {
    return MilestoneModel.find(filter)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email rollNumber')
      .sort({ deadline: 1 })
      .lean();
  }

  async findByCreatedBy(supervisorId) {
    return MilestoneModel.find({ createdBy: supervisorId })
      .populate('assignedTo', 'name email rollNumber')
      .sort({ deadline: 1 })
      .lean();
  }

  async findByAssignedTo(userId) {
    return MilestoneModel.find({ assignedTo: userId })
      .populate('createdBy', 'name email')
      .sort({ deadline: 1 })
      .lean();
  }

  async create(milestoneData) {
    const milestone = await MilestoneModel.create(milestoneData);
    return MilestoneModel.findById(milestone._id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email rollNumber')
      .lean();
  }

  async updateById(id, data) {
    return MilestoneModel.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email rollNumber')
      .lean();
  }

  async deleteById(id) {
    return MilestoneModel.findByIdAndDelete(id).lean();
  }
}

module.exports = MongoMilestoneRepository;
