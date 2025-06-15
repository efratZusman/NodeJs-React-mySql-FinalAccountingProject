const ClientService = require('../service/ClientService');
const path = require('path');

// Get all clients
exports.getAllClients = async (req, res) => {
    try {
        const clients = await ClientService.getAllClients();
        const clientsWithFullUrl = clients.map(client => ({
            ...client,
            logo_url: client.logo_url ? `${process.env.BASE_URL || 'http://localhost:3000'}${client.logo_url}` : null
        }));
        res.status(200).json(clientsWithFullUrl);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create new client
exports.createClient = async (req, res) => {
    try {
        const { client_name } = req.body;
        let logo_url = null;
        if (req.file) {
            const relativePath = '/images/' + req.file.filename;
            logo_url = relativePath; // שומרים יחסית בלבד בDB
        }
        const client = await ClientService.createClient({
            client_name,
            logo_url
        });
        res.status(201).json({
            ...client,
            logo_url: logo_url ? `${process.env.BASE_URL || 'http://localhost:3000'}${logo_url}` : null
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete client by ID
exports.deleteClient = async (req, res) => {
    try {
        const deleted = await ClientService.deleteClientById(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.status(200).json({ message: 'Client deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
