const express = require('express');
const userController = require('../controllers/UserController');
const getUserFromSession = require('../middleware/getUserFromSession');
const validateRegister = require('../middleware/validateRegister'); 

const router = express.Router();

router.post('/register', validateRegister, userController.registerUser); 
router.post('/login', userController.loginUser);
router.post('/logout', userController.logoutUser); 
router.get('/me', getUserFromSession,userController.getCurrentUser);  
router.patch('/subscribe-updates', getUserFromSession, userController.updateWantsUpdates);

module.exports = router;
