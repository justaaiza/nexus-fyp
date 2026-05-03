const IMilestoneRepository = require('../../../ports/repositories/IMilestoneRepository');
const MilestoneModel = require('../models/MilestoneModel');

class MongoMilestoneRepository extends IMilestoneRepository {
  async create(data) {
    return MilestoneModel.create(data);
  }

  async findById(id) {
    return MilestoneModel.findById(id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email rollNumber');
  }

  async findAll(filters = {}) {
    const query = {};
    if (filters.phase) query.phase = filters.phase;
    if (filters.createdBy) query.createdBy = filters.createdBy;
    return MilestoneModel.find(query)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email rollNumber')
      .sort({ deadline: 1 });
  }

  async update(id, data) {
    return MilestoneModel.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .populate('createdBy', 'name email');
  }

  async delete(id) {
    return MilestoneModel.findByIdAndDelete(id);
  }
}

module.exports = new MongoMilestoneRepository();
