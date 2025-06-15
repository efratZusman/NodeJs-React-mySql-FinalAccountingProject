const express = require('express');
const getUserFromSession = require('../middleware/getUserFromSession');

const updatesController = require('../controllers/UpdatesController');

const router = express.Router();

router.get('/', updatesController.getAllUpdates);
router.post('/', updatesController.createUpdate);
router.put('/:id', updatesController.updateUpdateById);
router.delete('/:id', updatesController.deleteUpdateById);

router.get('/subsriptions', getUserFromSession, updatesController.getUpdatesSubscriptionByUser);
router.post('/subscribe', getUserFromSession, updatesController.createUpdateSubscription);
router.delete('/unsubscribe/:id', updatesController.deleteUpdateSubscription);

module.exports = router;
