const fs = require('fs');
const path = require('path');

const write = (p, content) => {
  const full = path.join(__dirname, 'src', p);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
};

write('adapters/db/models/GroupModel.js', `const mongoose = require('mongoose');
const groupSchema = new mongoose.Schema({
  leader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
  }],
  status: { type: String, enum: ['forming', 'formed'], default: 'forming' }
}, { timestamps: true });
module.exports = mongoose.model('Group', groupSchema);`);

write('adapters/db/repositories/MongoGroupRepository.js', `const Group = require('../models/GroupModel');
class MongoGroupRepository {
  async create(data) { return Group.create(data); }
  async findById(id) { return Group.findById(id).populate('leader members.user'); }
  async findByUserId(userId) {
    return Group.find({ $or: [{ leader: userId }, { 'members.user': userId }] }).populate('leader members.user');
  }
  async updateById(id, data) { return Group.findByIdAndUpdate(id, data, { new: true }).populate('leader members.user'); }
  async deleteById(id) { return Group.findByIdAndDelete(id); }
}
module.exports = MongoGroupRepository;`);

write('application/student/group.usecase.js', `const MongoGroupRepository = require('../../adapters/db/repositories/MongoGroupRepository');
const groupRepository = new MongoGroupRepository();
const MongoUserRepository = require('../../adapters/db/repositories/MongoUserRepository');
const userRepository = new MongoUserRepository();

const createGroup = async (studentId, memberIds) => {
  if (memberIds.length < 1 || memberIds.length > 2) throw Object.assign(new Error('Group must have 2 to 3 members in total.'), { statusCode: 400 });
  const existing = await groupRepository.findByUserId(studentId);
  if (existing.length > 0) throw Object.assign(new Error('You are already in a group or have pending requests.'), { statusCode: 400 });
  
  for (let id of memberIds) {
    const user = await userRepository.findById(id);
    if (!user || user.role !== 'student') throw Object.assign(new Error('Invalid member ID.'), { statusCode: 400 });
    const memberExisting = await groupRepository.findByUserId(id);
    if (memberExisting.length > 0) throw Object.assign(new Error(\`User \${user.name} is already in a group.\`), { statusCode: 400 });
  }

  const members = memberIds.map(id => ({ user: id, status: 'pending' }));
  const group = await groupRepository.create({ leader: studentId, members, status: 'forming' });
  return groupRepository.findById(group._id);
};

const getMyGroup = async (studentId) => {
  const groups = await groupRepository.findByUserId(studentId);
  if (!groups || groups.length === 0) throw Object.assign(new Error('No group found.'), { statusCode: 404 });
  return groups[0];
};

const respondToGroupRequest = async (studentId, groupId, accept) => {
  const group = await groupRepository.findById(groupId);
  if (!group) throw Object.assign(new Error('Group not found.'), { statusCode: 404 });
  
  const member = group.members.find(m => m.user._id.toString() === studentId.toString());
  if (!member) throw Object.assign(new Error('Not part of this group.'), { statusCode: 403 });
  
  member.status = accept ? 'accepted' : 'rejected';
  
  if (!accept) {
    // If someone rejects, we delete the group so they can form another one? Or just keep it rejected.
    // Let's delete the group to free everyone.
    await groupRepository.deleteById(groupId);
    return { status: 'deleted' };
  } else {
    // Check if all accepted
    const allAccepted = group.members.every(m => m.status === 'accepted');
    if (allAccepted) group.status = 'formed';
    await groupRepository.updateById(groupId, { members: group.members, status: group.status });
    return group;
  }
};

module.exports = { createGroup, getMyGroup, respondToGroupRequest };`);

write('adapters/http/controllers/GroupController.js', `const { createGroup, getMyGroup, respondToGroupRequest } = require('../../../application/student/group.usecase');

const postGroup = async (req, res) => {
  try {
    const group = await createGroup(req.user._id, req.body.memberIds);
    res.status(201).json({ success: true, data: group });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

const getGroup = async (req, res) => {
  try {
    const group = await getMyGroup(req.user._id);
    res.status(200).json({ success: true, data: group });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

const respondGroup = async (req, res) => {
  try {
    const group = await respondToGroupRequest(req.user._id, req.params.groupId, req.body.accept);
    res.status(200).json({ success: true, data: group });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

module.exports = { postGroup, getGroup, respondGroup };`);
