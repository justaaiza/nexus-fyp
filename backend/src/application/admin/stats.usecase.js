const UserModel = require('../../adapters/db/models/UserModel');
const ProposalModel = require('../../adapters/db/models/ProposalModel');
const PanelModel = require('../../adapters/db/models/PanelModel');

// ─── Dashboard Stats ──────────────────────────────────────────────────────────
const getDashboardStats = async () => {
  const [totalStudents, pendingApprovals, activeProposals, totalPanels] = await Promise.all([
    UserModel.countDocuments({ role: 'student' }),
    UserModel.countDocuments({ isApproved: false, role: { $ne: 'admin' } }),
    ProposalModel.countDocuments({ status: 'approved' }),
    PanelModel.countDocuments({}),
  ]);

  return {
    totalStudents,
    pendingApprovals,
    activeProposals,
    upcomingDefenses: totalPanels,
  };
};

module.exports = { getDashboardStats };
