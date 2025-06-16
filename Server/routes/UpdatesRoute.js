const express = require('express');
const getUserFromSession = require('../middleware/getUserFromSession');
const updatesController = require('../controllers/UpdatesController');
const { isAdmin } = require('../middleware/isAdmin');

const adminOnly = [getUserFromSession, isAdmin];

const router = express.Router();

router.get('/', updatesController.getAllUpdates);
router.post('/', [...adminOnly,updatesController.createUpdate]);
router.put('/:id', [...adminOnly,updatesController.updateUpdateById]);
router.delete('/:id', [...adminOnly,updatesController.deleteUpdateById]);

router.get('/subsriptions', getUserFromSession, updatesController.getUpdatesSubscriptionByUser);
router.post('/subscribe', getUserFromSession, updatesController.createUpdateSubscription);
router.delete('/unsubscribe/:id', getUserFromSession,updatesController.deleteUpdateSubscription);

module.exports = router;
