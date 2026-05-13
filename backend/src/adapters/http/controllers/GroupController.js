const { createGroup, getMyGroup, respondToGroupRequest, inviteMembersToGroup, unsendInvite } = require('../../../application/student/group.usecase');

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

const postInviteMembers = async (req, res) => {
  try {
    const group = await inviteMembersToGroup(req.user._id, req.params.groupId, req.body.memberIds);
    res.status(200).json({ success: true, data: group });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};
const deleteInvite = async (req, res) => {
  try {
    const group = await unsendInvite(req.user._id, req.params.groupId, req.params.memberId);
    res.status(200).json({ success: true, data: group });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

module.exports = { postGroup, getGroup, respondGroup, postInviteMembers, deleteInvite };