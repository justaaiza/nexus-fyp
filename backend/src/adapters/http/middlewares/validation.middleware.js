const AppError = require('../../../utils/AppError');

/**
 * Middleware: validate
 * Validates req.body against a Joi schema.
 * Optionally validates req.params and req.query as well.
 *
 * @param {Object} schema - { body?: JoiSchema, params?: JoiSchema, query?: JoiSchema }
 */
const validate = (schema) => {
  return (req, res, next) => {
    const targets = ['body', 'params', 'query'];
    for (const target of targets) {
      if (schema[target]) {
        const { error, value } = schema[target].validate(req[target], {
          abortEarly: false,
          stripUnknown: true,
        });
        if (error) {
          const message = error.details.map((d) => d.message).join(', ');
          return next(new AppError(message, 400));
        }
        req[target] = value;
      }
    }
    next();
  };
};

module.exports = validate;
