const express = require('express');
const upload = require('../middleware/MulterConfig');
const clientController = require('../controllers/ClientController');

const router = express.Router();

router.get('/', clientController.getAllClients);
router.post('/', upload.single('logo'), clientController.createClient);
router.delete('/:id', clientController.deleteClient); // <-- fixed

module.exports = router;
