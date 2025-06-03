const express = require('express');
const updatesController = require('../controllers/UpdatesController');

const router = express.Router();
router.get('/', updatesController.getAllUpdates);
router.post('/', updatesController.createUpdate);
router.put('/:id', updatesController.updateUpdateById);
router.delete('/:id', updatesController.deleteUpdateById);
module.exports = router;
