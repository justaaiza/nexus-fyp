const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');
const verifyToken = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validation.middleware');
const { registerSchema, loginSchema } = require('../validators/auth.validator');

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.get('/me', verifyToken, authController.getMe);

module.exports = router;
