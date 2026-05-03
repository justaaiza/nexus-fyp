const Joi = require('joi');

const registerSchema = {
  body: Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    email: Joi.string().email().lowercase().trim().required(),
    password: Joi.string().min(6).max(128).required(),
    role: Joi.string().valid('student', 'supervisor', 'admin', 'jury').required(),
    rollNumber: Joi.string().trim().allow(null, '').optional(),
    department: Joi.string().trim().allow(null, '').optional(),
  }),
};

const loginSchema = {
  body: Joi.object({
    email: Joi.string().email().lowercase().trim().required(),
    password: Joi.string().required(),
  }),
};

module.exports = { registerSchema, loginSchema };
