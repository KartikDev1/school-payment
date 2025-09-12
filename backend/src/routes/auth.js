const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validateRequest');
const authController = require('../controllers/authController');
const router = express.Router();

router.post('/register',
  [ body('email').isEmail(), body('password').isLength({ min: 6 }) ],
  validate, authController.register);

router.post('/login',
  [ body('email').isEmail(), body('password').exists() ],
  validate, authController.login);

module.exports = router;
