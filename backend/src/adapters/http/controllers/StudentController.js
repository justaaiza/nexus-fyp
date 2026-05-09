const { submitProposal, getMyProposal, editProposal, getAvailableOptions } = require('../../../application/student/proposal.usecase');
const { getMilestones, submitDeliverable, getMySubmissions, deleteSubmission } = require('../../../application/student/milestone.usecase');
const { getMyFeedback } = require('../../../application/student/feedback.usecase');
const { getProfile, updateProfile } = require('../../../application/student/profile.usecase');

// ── Proposals ─────────────────────────────────────────────────────────────────
const postProposal = async (req, res) => {
  try {
    const proposal = await submitProposal(req.user._id, req.body);
    res.status(201).json({ success: true, data: proposal });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

const updateProposal = async (req, res) => {
  try {
    const proposal = await editProposal(req.user._id, req.params.proposalId, req.body);
    res.status(200).json({ success: true, data: proposal });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

const getProposalOptions = async (req, res) => {
  try {
    const options = await getAvailableOptions();
    res.status(200).json({ success: true, data: options });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

const getProposal = async (req, res) => {
  try {
    const proposal = await getMyProposal(req.user._id);
    res.status(200).json({ success: true, data: proposal });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

// ── Milestones ────────────────────────────────────────────────────────────────
const listMilestones = async (req, res) => {
  try {
    const milestones = await getMilestones();
    res.status(200).json({ success: true, data: milestones });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

const uploadSubmission = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }
    const submission = await submitDeliverable(req.params.milestoneId, req.user._id, req.file);
    res.status(201).json({ success: true, data: submission });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

const getSubmissions = async (req, res) => {
  try {
    const submissions = await getMySubmissions(req.user._id);
    res.status(200).json({ success: true, data: submissions });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

const removeSubmission = async (req, res) => {
  try {
    await deleteSubmission(req.params.submissionId, req.user._id);
    res.status(200).json({ success: true, message: 'Submission deleted.' });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

// ── Feedback ──────────────────────────────────────────────────────────────────
const getFeedback = async (req, res) => {
  try {
    const feedback = await getMyFeedback(req.user._id);
    res.status(200).json({ success: true, data: feedback });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

// ── Profile ───────────────────────────────────────────────────────────────────
const getStudentProfile = async (req, res) => {
  try {
    const user = await getProfile(req.user._id);
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

const updateStudentProfile = async (req, res) => {
  try {
    const user = await updateProfile(req.user._id, req.body);
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

module.exports = {
  postProposal,
  updateProposal,
  getProposalOptions,
  getProposal,
  listMilestones,
  uploadSubmission,
  getSubmissions,
  removeSubmission,
  getFeedback,
  getStudentProfile,
  updateStudentProfile,
};
