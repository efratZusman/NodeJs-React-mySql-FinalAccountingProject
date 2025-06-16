const express = require('express');
const { uploadClientImage } = require('../middleware/MulterConfig');
const clientController = require('../controllers/ClientController');

const router = express.Router();

router.get('/', clientController.getAllClients);
router.post('/', uploadClientImage.single('logo'), clientController.createClient);
router.delete('/:id', clientController.deleteClient);

module.exports = router;
