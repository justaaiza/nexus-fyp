const MongoUserRepository = require('../../db/repositories/MongoUserRepository');
const MongoProposalRepository = require('../../db/repositories/MongoProposalRepository');
const MongoMilestoneRepository = require('../../db/repositories/MongoMilestoneRepository');
const MongoSubmissionRepository = require('../../db/repositories/MongoSubmissionRepository');
const MongoFeedbackRepository = require('../../db/repositories/MongoFeedbackRepository');

const getRequests = require('../../../application/supervisor/getRequests.usecase');
const acceptRequest = require('../../../application/supervisor/acceptRequest.usecase');
const rejectRequest = require('../../../application/supervisor/rejectRequest.usecase');
const createMilestone = require('../../../application/supervisor/createMilestone.usecase');
const getMilestones = require('../../../application/supervisor/getMilestones.usecase');
const updateMilestone = require('../../../application/supervisor/updateMilestone.usecase');
const deleteMilestone = require('../../../application/supervisor/deleteMilestone.usecase');
const getSubmissions = require('../../../application/supervisor/getSubmissions.usecase');
const getSubmissionById = require('../../../application/supervisor/getSubmissionById.usecase');
const submitFeedback = require('../../../application/supervisor/submitFeedback.usecase');
const getFeedback = require('../../../application/supervisor/getFeedback.usecase');
const getProfile = require('../../../application/supervisor/getProfile.usecase');
const updateProfile = require('../../../application/supervisor/updateProfile.usecase');

const userRepo = new MongoUserRepository();
const proposalRepo = new MongoProposalRepository();
const milestoneRepo = new MongoMilestoneRepository();
const submissionRepo = new MongoSubmissionRepository();
const feedbackRepo = new MongoFeedbackRepository();

class SupervisorController {
  /* ── Supervision Requests ── */

  async getRequests(req, res, next) {
    try {
      const proposals = await getRequests(proposalRepo, req.user._id);
      res.status(200).json({ success: true, data: proposals });
    } catch (error) {
      next(error);
    }
  }

  async acceptRequest(req, res, next) {
    try {
      const proposal = await acceptRequest(proposalRepo, {
        proposalId: req.params.proposalId,
        supervisorId: req.user._id,
      });
      res.status(200).json({ success: true, data: proposal });
    } catch (error) {
      next(error);
    }
  }

  async rejectRequest(req, res, next) {
    try {
      const proposal = await rejectRequest(proposalRepo, {
        proposalId: req.params.proposalId,
        supervisorId: req.user._id,
        rejectionReason: req.body.rejectionReason,
      });
      res.status(200).json({ success: true, data: proposal });
    } catch (error) {
      next(error);
    }
  }

  /* ── Milestones ── */

  async createMilestone(req, res, next) {
    try {
      const milestone = await createMilestone(milestoneRepo, {
        ...req.body,
        supervisorId: req.user._id,
      });
      res.status(201).json({ success: true, data: milestone });
    } catch (error) {
      next(error);
    }
  }

  async getMilestones(req, res, next) {
    try {
      const milestones = await getMilestones(milestoneRepo, req.user._id);
      res.status(200).json({ success: true, data: milestones });
    } catch (error) {
      next(error);
    }
  }

  async updateMilestone(req, res, next) {
    try {
      const milestone = await updateMilestone(milestoneRepo, {
        milestoneId: req.params.id,
        supervisorId: req.user._id,
        updateData: req.body,
      });
      res.status(200).json({ success: true, data: milestone });
    } catch (error) {
      next(error);
    }
  }

  async deleteMilestone(req, res, next) {
    try {
      const result = await deleteMilestone(milestoneRepo, {
        milestoneId: req.params.id,
        supervisorId: req.user._id,
      });
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  /* ── Submissions ── */

  async getSubmissions(req, res, next) {
    try {
      const submissions = await getSubmissions(proposalRepo, submissionRepo, req.user._id);
      res.status(200).json({ success: true, data: submissions });
    } catch (error) {
      next(error);
    }
  }

  async getSubmissionById(req, res, next) {
    try {
      const submission = await getSubmissionById(submissionRepo, req.params.id);
      res.status(200).json({ success: true, data: submission });
    } catch (error) {
      next(error);
    }
  }

  /* ── Feedback ── */

  async submitFeedback(req, res, next) {
    try {
      const feedback = await submitFeedback(feedbackRepo, submissionRepo, {
        submissionId: req.params.submissionId,
        supervisorId: req.user._id,
        comment: req.body.comment,
        grade: req.body.grade,
      });
      res.status(201).json({ success: true, data: feedback });
    } catch (error) {
      next(error);
    }
  }

  async getFeedback(req, res, next) {
    try {
      const feedbackList = await getFeedback(feedbackRepo, req.params.submissionId);
      res.status(200).json({ success: true, data: feedbackList });
    } catch (error) {
      next(error);
    }
  }

  /* ── Profile ── */

  async getProfile(req, res, next) {
    try {
      const user = await getProfile(userRepo, req.user._id);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const user = await updateProfile(userRepo, {
        userId: req.user._id,
        updateData: req.body,
      });
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SupervisorController();
