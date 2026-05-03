const Joi = require('joi');

const panelParamsSchema = {
  params: Joi.object({
    panelId: Joi.string().hex().length(24).required(),
  }),
};

const groupSubmissionsSchema = {
  params: Joi.object({
    groupId: Joi.string().hex().length(24).required(),
  }),
};

const submissionParamsSchema = {
  params: Joi.object({
    submissionId: Joi.string().hex().length(24).required(),
  }),
};

const submitGradeSchema = {
  body: Joi.object({
    comment: Joi.string().trim().min(1).required(),
    grade: Joi.number().min(0).max(100).required(),
  }),
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
  panelParamsSchema,
  groupSubmissionsSchema,
  submissionParamsSchema,
  submitGradeSchema,
  updateProfileSchema,
};
