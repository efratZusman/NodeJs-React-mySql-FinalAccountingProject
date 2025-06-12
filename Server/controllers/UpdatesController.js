const UpdateService = require('../service/UpdateService');

// Get all todos
exports.getAllUpdates = async (req, res) => {
    try {
        const updates = await UpdateService.getAllUpdates();
        res.status(200).json(updates);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create new todo
exports.createUpdate = async (req, res) => {
    try {
        console.log(req.body);
        const newUpdate = await UpdateService.createUpdate(req.body);
        res.status(201).json(newUpdate);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update todo by ID
exports.updateUpdateById = async (req, res) => {
    try {
        console.log(req.params.id, "id_update");
        console.log(req.body, "body_update");
        const updated = await UpdateService.updateUpdateById(req.params.id, req.body);
        if (!updated) {
            return res.status(404).json({ message: 'Update not found' });
        }
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete todo by ID
exports.deleteUpdateById = async (req, res) => {
    try {
        const deleted = await UpdateService.deleteUpdateById(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Update not found' });
        }
        res.status(200).json({ message: 'Update deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.createUpdateSubscription = async (req, res) => {
  try {
        console.log(req.body);
        const newUpdateSub = await UpdateService.createUpdateSubscription(req.body.update_id, req.userId);
        res.status(201).json(newUpdateSub);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all todos
exports.getUpdatesSubscriptionByUser = async (req, res) => {
    try {
        
        const updateSubs = await UpdateService.getUpdatesSubscriptionByUser(req.userId);
        res.status(200).json(updateSubs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteUpdateSubscription = async (req, res) => {
    try {
        const deleted = await UpdateService.deleteUpdateSubscription(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'UpdateSubscription not found' });
        }
        res.status(200).json({ message: 'UpdateSubscription deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


