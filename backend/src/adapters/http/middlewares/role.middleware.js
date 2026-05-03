const AppError = require('../../../utils/AppError');

/**
 * Middleware: authorizeRoles
 * Restricts access to specific roles.
 * Usage: authorizeRoles('supervisor', 'admin')
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Authentication required.', 401));
    }
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to access this resource.', 403));
    }
    next();
  };
};

module.exports = authorizeRoles;
