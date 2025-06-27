const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const tokenValidation = require('../middleware/tokenValidation');

// Public routes
router.post('/signup', userController.createUser);
router.post('/login', userController.loginUser);

// Protected routes
router.use(tokenValidation.validateToken);

router.get('/profile', userController.getUserProfile);
router.put('/profile/username', userController.updateUsername);

module.exports = router;