const express = require('express');
const infoController = require('../controllers/InformationController');

const router = express.Router();

router.get('/', infoController.getAllInformations);
router.post('/', infoController.createInformation);
// router.get('/:id', infoController.getInformationById);
router.put('/:id', infoController.updateInformationById);
router.delete('/:id', infoController.deleteInformationById);

module.exports = router;
