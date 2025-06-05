const UpdateService = require('../service/ClientService');

// Get all todos
exports.getAllClients = async (req, res) => {
    try {
        const clients = await ClientService.getAllNewsletters();
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create new todo
exports.createClient = async (req, res) => {
    try {
        console.log(req.body);
        const newClient = await ClientService.createClient(req.body);
        res.status(201).json(newClient);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete todo by ID
exports.deleteClientById = async (req, res) => {
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


