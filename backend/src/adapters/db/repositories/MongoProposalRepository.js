const IProposalRepository = require('../../../ports/repositories/IProposalRepository');
const ProposalModel = require('../models/ProposalModel');

class MongoProposalRepository extends IProposalRepository {
  async findById(id) {
    return ProposalModel.findById(id)
      .populate('teamMembers', 'name email rollNumber')
      .populate('supervisorPreference', 'name email department')
      .populate('submittedBy', 'name email rollNumber')
      .lean();
  }

  async findAll(filter = {}) {
    return ProposalModel.find(filter)
      .populate('teamMembers', 'name email rollNumber')
      .populate('supervisorPreference', 'name email department')
      .populate('submittedBy', 'name email rollNumber')
      .sort({ createdAt: -1 })
      .lean();
  }

  async findBySupervisorPreference(supervisorId) {
    return ProposalModel.find({ supervisorPreference: supervisorId })
      .populate('teamMembers', 'name email rollNumber')
      .populate('submittedBy', 'name email rollNumber')
      .sort({ createdAt: -1 })
      .lean();
  }

  async findBySubmittedBy(userId) {
    return ProposalModel.find({ submittedBy: userId })
      .populate('teamMembers', 'name email rollNumber')
      .populate('supervisorPreference', 'name email department')
      .populate('submittedBy', 'name email rollNumber')
      .lean();
  }

  async create(proposalData) {
    const proposal = await ProposalModel.create(proposalData);
    return proposal.toObject();
  }

  async updateById(id, data) {
    return ProposalModel.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .populate('teamMembers', 'name email rollNumber')
      .populate('supervisorPreference', 'name email department')
      .populate('submittedBy', 'name email rollNumber')
      .lean();
  }

  async deleteById(id) {
    return ProposalModel.findByIdAndDelete(id).lean();
  }

  async countByFilter(filter = {}) {
    return ProposalModel.countDocuments(filter);
  }
}

module.exports = MongoProposalRepository;
