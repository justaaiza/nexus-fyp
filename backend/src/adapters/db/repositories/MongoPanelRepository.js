const IPanelRepository = require('../../../ports/repositories/IPanelRepository');
const PanelModel = require('../models/PanelModel');

class MongoPanelRepository extends IPanelRepository {
  async findById(id) {
    return PanelModel.findById(id)
      .populate('juryMembers', 'name email department')
      .populate({
        path: 'assignedGroups',
        populate: [
          { path: 'teamMembers', select: 'name email rollNumber' },
          { path: 'submittedBy', select: 'name email rollNumber' },
          { path: 'supervisorPreference', select: 'name email department' },
        ],
      })
      .lean();
  }

  async findAll(filter = {}) {
    return PanelModel.find(filter)
      .populate('juryMembers', 'name email department')
      .populate({
        path: 'assignedGroups',
        populate: [
          { path: 'teamMembers', select: 'name email rollNumber' },
          { path: 'submittedBy', select: 'name email rollNumber' },
        ],
      })
      .sort({ defenseDate: 1 })
      .lean();
  }

  async findByJuryMember(userId) {
    return PanelModel.find({ juryMembers: userId })
      .populate('juryMembers', 'name email department')
      .populate({
        path: 'assignedGroups',
        populate: [
          { path: 'teamMembers', select: 'name email rollNumber' },
          { path: 'submittedBy', select: 'name email rollNumber' },
          { path: 'supervisorPreference', select: 'name email department' },
        ],
      })
      .sort({ defenseDate: 1 })
      .lean();
  }

  async create(panelData) {
    const panel = await PanelModel.create(panelData);
    return panel.toObject();
  }

  async updateById(id, data) {
    return PanelModel.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .populate('juryMembers', 'name email department')
      .populate('assignedGroups')
      .lean();
  }

  async deleteById(id) {
    return PanelModel.findByIdAndDelete(id).lean();
  }
}

module.exports = MongoPanelRepository;
