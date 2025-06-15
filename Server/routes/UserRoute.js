
const express = require('express');
const userController = require('../controllers/UserController');
const getUserFromSession = require('../middleware/getUserFromSession');
const router = express.Router();

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/logout', userController.logoutUser); // אם יש
router.get('/me', userController.getCurrentUser);  // כאן!
router.patch('/subscribe-updates', getUserFromSession, userController.updateWantsUpdates);


// Get user by username
// router.get('/:username', userController.getUserByUsername);

// Update user by username
// router.put('/:username', userController.updateUserByUsername);

// Delete user by username
// router.delete('/:username', userController.deleteUserByUsername);

// Get all users
// router.get('/', userController.getAllUsers);

// Create user
// router.patch('/:username', userController.partialUpdateUserByUsername);

module.exports = router;
