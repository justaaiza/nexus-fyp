const IPanelRepository = require('../../../ports/repositories/IPanelRepository');
const PanelModel = require('../models/PanelModel');

class MongoPanelRepository extends IPanelRepository {
  async create(data) {
    return PanelModel.create(data);
  }

  async findById(id) {
    return PanelModel.findById(id)
      .populate('juryMembers', 'name email department')
      .populate({ path: 'assignedGroups', populate: { path: 'submittedBy', select: 'name email rollNumber' } });
  }

  async findAll() {
    return PanelModel.find()
      .populate('juryMembers', 'name email department')
      .populate({ path: 'assignedGroups', select: 'title groupNo submittedBy status' })
      .sort({ createdAt: -1 });
  }

  async update(id, data) {
    return PanelModel.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .populate('juryMembers', 'name email department')
      .populate({ path: 'assignedGroups', select: 'title groupNo' });
  }

  async delete(id) {
    return PanelModel.findByIdAndDelete(id);
  }
}

module.exports = new MongoPanelRepository();
