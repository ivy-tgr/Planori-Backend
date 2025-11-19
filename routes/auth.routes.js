const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticateUser } = require('../middleware/authenticate');

router.post('/verify', authenticateUser, authController.verify);
router.post('/register', authenticateUser, authController.register);

module.exports = router;