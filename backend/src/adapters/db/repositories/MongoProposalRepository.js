const IProposalRepository = require('../../../ports/repositories/IProposalRepository');
const ProposalModel = require('../models/ProposalModel');

class MongoProposalRepository extends IProposalRepository {
  async create(data) {
    return ProposalModel.create(data);
  }

  async findById(id) {
    return ProposalModel.findById(id)
      .populate('submittedBy', 'name email rollNumber')
      .populate('teamMembers', 'name email rollNumber')
      .populate('supervisorPreference', 'name email');
  }

  async findByUserId(userId) {
    return ProposalModel.findOne({ submittedBy: userId })
      .populate('submittedBy', 'name email rollNumber')
      .populate('teamMembers', 'name email rollNumber')
      .populate('supervisorPreference', 'name email');
  }

  async findAll(filters = {}) {
    const query = {};
    if (filters.status) query.status = filters.status;
    return ProposalModel.find(query)
      .populate('submittedBy', 'name email rollNumber department')
      .populate('teamMembers', 'name email rollNumber')
      .populate('supervisorPreference', 'name email')
      .sort({ createdAt: -1 });
  }

  async update(id, data) {
    return ProposalModel.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .populate('submittedBy', 'name email rollNumber')
      .populate('teamMembers', 'name email rollNumber')
      .populate('supervisorPreference', 'name email');
  }

  async delete(id) {
    return ProposalModel.findByIdAndDelete(id);
  }
}

module.exports = new MongoProposalRepository();
