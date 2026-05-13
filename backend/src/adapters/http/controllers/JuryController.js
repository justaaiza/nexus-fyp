const MongoUserRepository = require('../../db/repositories/MongoUserRepository');
const MongoPanelRepository = require('../../db/repositories/MongoPanelRepository');
const MongoProposalRepository = require('../../db/repositories/MongoProposalRepository');
const MongoSubmissionRepository = require('../../db/repositories/MongoSubmissionRepository');
const MongoFeedbackRepository = require('../../db/repositories/MongoFeedbackRepository');

const getMyPanels = require('../../../application/jury/getMyPanels.usecase');
const getPanelGroups = require('../../../application/jury/getPanelGroups.usecase');
const getGroupSubmissions = require('../../../application/jury/getGroupSubmissions.usecase');
const getSubmissionFile = require('../../../application/jury/getSubmissionFile.usecase');
const submitGrade = require('../../../application/jury/submitGrade.usecase');
const getMyGrade = require('../../../application/jury/getMyGrade.usecase');
const getProfile = require('../../../application/jury/getProfile.usecase');
const updateProfile = require('../../../application/jury/updateProfile.usecase');

const userRepo = new MongoUserRepository();
const panelRepo = new MongoPanelRepository();
const proposalRepo = new MongoProposalRepository();
const submissionRepo = new MongoSubmissionRepository();
const feedbackRepo = new MongoFeedbackRepository();

class JuryController {
  /* ── Panels ── */

  async getMyPanels(req, res, next) {
    try {
      const panels = await getMyPanels(panelRepo, submissionRepo, feedbackRepo, req.user._id);
      res.status(200).json({ success: true, data: panels });
    } catch (error) {
      next(error);
    }
  }

  async getPanelGroups(req, res, next) {
    try {
      const groups = await getPanelGroups(panelRepo, {
        panelId: req.params.panelId,
        juryUserId: req.user._id,
      });
      res.status(200).json({ success: true, data: groups });
    } catch (error) {
      next(error);
    }
  }

  /* ── Submissions ── */

  async getGroupSubmissions(req, res, next) {
    try {
      const submissions = await getGroupSubmissions(proposalRepo, submissionRepo, req.params.groupId);
      res.status(200).json({ success: true, data: submissions });
    } catch (error) {
      next(error);
    }
  }

  async getSubmissionFile(req, res, next) {
    try {
      const submission = await getSubmissionFile(submissionRepo, req.params.submissionId);
      res.status(200).json({ success: true, data: submission });
    } catch (error) {
      next(error);
    }
  }

  /* ── Grading ── */

  async submitGrade(req, res, next) {
    try {
      const feedback = await submitGrade(feedbackRepo, submissionRepo, {
        submissionId: req.params.submissionId,
        juryUserId: req.user._id,
        comment: req.body.comment,
        grade: req.body.grade,
        rubric: req.body.rubric,
      });
      res.status(201).json({ success: true, data: feedback });
    } catch (error) {
      next(error);
    }
  }

  async getMyGrade(req, res, next) {
    try {
      const feedback = await getMyGrade(feedbackRepo, {
        submissionId: req.params.submissionId,
        juryUserId: req.user._id,
      });
      res.status(200).json({ success: true, data: feedback });
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

module.exports = new JuryController();
