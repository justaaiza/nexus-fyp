const MongoUserRepository = require('../../adapters/db/repositories/MongoUserRepository');
const MongoProposalRepository = require('../../adapters/db/repositories/MongoProposalRepository');
const MongoPanelRepository = require('../../adapters/db/repositories/MongoPanelRepository');

const userRepo = new MongoUserRepository();
const proposalRepo = new MongoProposalRepository();
const panelRepo = new MongoPanelRepository();

/**
 * Use case: Gather aggregate stats for the admin dashboard.
 * Uses repository interfaces instead of direct model access.
 */
const getDashboardStats = async () => {
  const [totalStudents, pendingApprovals, activeProposals, panels] = await Promise.all([
    userRepo.countByFilter({ role: 'student' }),
    userRepo.countByFilter({ isApproved: false, role: { $ne: 'admin' } }),
    proposalRepo.countByFilter({ status: 'approved' }),
    panelRepo.findAll(),
  ]);

  return {
    totalStudents,
    pendingApprovals,
    activeProposals,
    upcomingDefenses: panels.length,
  };
};

module.exports = { getDashboardStats };
