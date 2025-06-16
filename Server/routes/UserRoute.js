const express = require('express');
const userController = require('../controllers/UserController');
const getUserFromSession = require('../middleware/getUserFromSession');
const validateRegister = require('../middleware/validateRegister'); // הוסף שורה זו

const router = express.Router();

router.post('/register', validateRegister, userController.registerUser); // הוסף את המידלוור כאן
router.post('/login', userController.loginUser);
router.post('/logout', userController.logoutUser); 
router.get('/me', getUserFromSession,userController.getCurrentUser);  
router.patch('/subscribe-updates', getUserFromSession, userController.updateWantsUpdates);

module.exports = router;
