const { listUsers, approveUser, rejectUser, deleteUser } = require('../../../application/admin/userManagement.usecase');
const { listProposals, approveProposal, rejectProposal } = require('../../../application/admin/proposalManagement.usecase');
const { createPanel, listPanels, updatePanel, deletePanel } = require('../../../application/admin/panelManagement.usecase');
const { createAnnouncement, listAnnouncements, deleteAnnouncement, togglePin } = require('../../../application/admin/announcement.usecase');
const { getDashboardStats } = require('../../../application/admin/stats.usecase');

// ── Users ─────────────────────────────────────────────────────────────────────
const getUsers = async (req, res) => {
  try {
    const filters = {};
    if (req.query.role) filters.role = req.query.role;
    const users = await listUsers(filters);
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

const approveUserHandler = async (req, res) => {
  try {
    const user = await approveUser(req.params.id);
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

const rejectUserHandler = async (req, res) => {
  try {
    const user = await rejectUser(req.params.id);
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

const deleteUserHandler = async (req, res) => {
  try {
    await deleteUser(req.params.id);
    res.status(200).json({ success: true, message: 'User deleted.' });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

// ── Proposals ─────────────────────────────────────────────────────────────────
const getProposals = async (req, res) => {
  try {
    const filters = {};
    if (req.query.status) filters.status = req.query.status;
    let proposals = await listProposals(filters);

    if (req.query.defenseReady === 'true') {
      const MongoMilestoneRepository = require('../../../adapters/db/repositories/MongoMilestoneRepository');
      const milestoneRepo = new MongoMilestoneRepository();
      const defenseMilestones = await milestoneRepo.findAll({ type: 'defence' });
      
      const defenseStudentIds = new Set();
      defenseMilestones.forEach(m => {
        if (m.assignedTo) {
          m.assignedTo.forEach(student => {
            defenseStudentIds.add(student._id ? student._id.toString() : student.toString());
          });
        }
      });
      
      proposals = proposals.filter(p => {
        const memberIds = [
          p.submittedBy?._id ? p.submittedBy._id.toString() : p.submittedBy?.toString(),
          ...(p.teamMembers || []).map(m => m._id ? m._id.toString() : m.toString())
        ].filter(Boolean);
        return memberIds.some(id => defenseStudentIds.has(id));
      });
    }

    res.status(200).json({ success: true, data: proposals });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

const approveProposalHandler = async (req, res) => {
  try {
    const proposal = await approveProposal(req.params.id);
    res.status(200).json({ success: true, data: proposal });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

const rejectProposalHandler = async (req, res) => {
  try {
    const { reason } = req.body;
    const proposal = await rejectProposal(req.params.id, reason);
    res.status(200).json({ success: true, data: proposal });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

// ── Panels ────────────────────────────────────────────────────────────────────
const createPanelHandler = async (req, res) => {
  try {
    const panel = await createPanel(req.body);
    res.status(201).json({ success: true, data: panel });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

const getPanels = async (req, res) => {
  try {
    const panels = await listPanels();
    res.status(200).json({ success: true, data: panels });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

const updatePanelHandler = async (req, res) => {
  try {
    const panel = await updatePanel(req.params.id, req.body);
    res.status(200).json({ success: true, data: panel });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

const deletePanelHandler = async (req, res) => {
  try {
    await deletePanel(req.params.id);
    res.status(200).json({ success: true, message: 'Panel deleted.' });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

// ── Announcements ─────────────────────────────────────────────────────────────
const createAnnouncementHandler = async (req, res) => {
  try {
    const ann = await createAnnouncement(req.user._id, req.body);
    res.status(201).json({ success: true, data: ann });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

const getAnnouncements = async (req, res) => {
  try {
    const announcements = await listAnnouncements();
    res.status(200).json({ success: true, data: announcements });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

const deleteAnnouncementHandler = async (req, res) => {
  try {
    await deleteAnnouncement(req.params.id);
    res.status(200).json({ success: true, message: 'Announcement deleted.' });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

const togglePinHandler = async (req, res) => {
  try {
    const ann = await togglePin(req.params.id);
    res.status(200).json({ success: true, data: ann });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

// ── Stats ─────────────────────────────────────────────────────────────────────
const getStats = async (req, res) => {
  try {
    const stats = await getDashboardStats();
    res.status(200).json({ success: true, data: stats });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getUsers, approveUserHandler, rejectUserHandler, deleteUserHandler,
  getProposals, approveProposalHandler, rejectProposalHandler,
  createPanelHandler, getPanels, updatePanelHandler, deletePanelHandler,
  createAnnouncementHandler, getAnnouncements, deleteAnnouncementHandler, togglePinHandler,
  getStats,
};
