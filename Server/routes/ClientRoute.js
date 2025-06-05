
const express = require('express');
const clientController = require('../controllers/ClientController');

const router = express.Router();

router.get('/', clientController.getAllClients);

router.post('/', clientController.createClient);

router.delete('/:id', clientController.deleteClientById);

module.exports = router;
