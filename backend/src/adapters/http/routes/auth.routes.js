const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const { register, login, me } = require('../controllers/AuthController');
const verifyToken = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validation.middleware');

// POST /api/auth/register
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required.'),
    body('email').isEmail().withMessage('Valid email is required.').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
    body('role').isIn(['student', 'supervisor', 'admin', 'jury']).withMessage('Invalid role.'),
  ],
  validate,
  register
);

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required.').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required.'),
  ],
  validate,
  login
);

// GET /api/auth/me  (protected)
router.get('/me', verifyToken, me);

module.exports = router;
