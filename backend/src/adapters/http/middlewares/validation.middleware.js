const { validationResult } = require('express-validator');

/**
 * validate — Reads express-validator errors and short-circuits with 400
 * if any validation rule fails. Place AFTER your validation rules array.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed.',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

module.exports = validate;
