const express = require('express');
const getUserFromSession = require('../middleware/getUserFromSession');

const updatesController = require('../controllers/UpdatesController');

const router = express.Router();

router.get('/', updatesController.getAllUpdates);
router.get('/subsriptions', getUserFromSession, updatesController.getUpdatesSubscriptionByUser);
router.post('/', updatesController.createUpdate);
router.post('/subscribe', getUserFromSession, updatesController.createUpdateSubscription);
router.put('/:id', updatesController.updateUpdateById);
router.delete('/:id', updatesController.deleteUpdateById);
router.delete('/unsubscribe/:id', updatesController.deleteUpdateSubscription);

module.exports = router;
