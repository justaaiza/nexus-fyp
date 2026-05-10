const Joi = require('joi');

const createMilestoneSchema = {
  body: Joi.object({
    title: Joi.string().trim().min(2).max(200).required(),
    description: Joi.string().trim().min(5).required(),
    deadline: Joi.date().iso().required(),
    phase: Joi.string().valid('FYP-1', 'FYP-2').required(),
    type: Joi.string().valid('document', 'defence', 'code').required(),
    assignedTo: Joi.array().items(Joi.string().hex().length(24)).min(1).required(),
  }),
};

const updateMilestoneSchema = {
  body: Joi.object({
    title: Joi.string().trim().min(2).max(200).optional(),
    description: Joi.string().trim().min(5).optional(),
    deadline: Joi.date().iso().optional(),
    phase: Joi.string().valid('FYP-1', 'FYP-2').optional(),
    type: Joi.string().valid('document', 'defence', 'code').optional(),
    assignedTo: Joi.array().items(Joi.string().hex().length(24)).min(1).optional(),
  }).min(1),
  params: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }),
};

const milestoneParamsSchema = {
  params: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }),
};

const proposalParamsSchema = {
  params: Joi.object({
    proposalId: Joi.string().hex().length(24).required(),
  }),
};

const submissionParamsSchema = {
  params: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }),
};

const submitFeedbackSchema = {
  body: Joi.object({
    comment: Joi.string().trim().min(1).required(),
    grade: Joi.number().min(0).max(100).required(),
  }),
  params: Joi.object({
    submissionId: Joi.string().hex().length(24).required(),
  }),
};

const feedbackParamsSchema = {
  params: Joi.object({
    submissionId: Joi.string().hex().length(24).required(),
  }),
};

const updateProfileSchema = {
  body: Joi.object({
    name: Joi.string().trim().min(2).max(100).optional(),
    department: Joi.string().trim().allow(null, '').optional(),
  }).min(1),
};

module.exports = {
  createMilestoneSchema,
  updateMilestoneSchema,
  milestoneParamsSchema,
  proposalParamsSchema,
  submissionParamsSchema,
  submitFeedbackSchema,
  feedbackParamsSchema,
  updateProfileSchema,
};
