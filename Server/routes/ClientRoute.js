const express = require('express');
const { uploadClientImage } = require('../middleware/MulterConfig');
const clientController = require('../controllers/ClientController');
const getUserFromSession = require('../middleware/getUserFromSession');
const  isAdmin  = require('../middleware/isAdmin');
const adminOnly = [getUserFromSession, isAdmin];
const router = express.Router();

router.get('/', clientController.getAllClients);
router.post('/', [...adminOnly, uploadClientImage.single('logo'), clientController.createClient]);
router.delete('/:id',[...adminOnly, clientController.deleteClient]);

module.exports = router;
