const UpdateService = require('../service/NewsletterService');

// Get all todos
exports.getAllNewsletters = async (req, res) => {
    try {
        const newsletters = await NewsletterService.getAllNewsletters();
        res.status(200).json(newsletters);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create new todo
exports.createNewsletter = async (req, res) => {
    try {
        console.log(req.body);
        const newNewsletter = await NewsletterService.createNewsletter(req.body);
        res.status(201).json(newNewsletter);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update todo by ID
exports.updateNewsletterById = async (req, res) => {
    try {
        console.log(req.params.id);
        console.log(req.body);
        const updated = await NewsletterService.updateNewsletterById(req.params.id, req.body);
        if (!updated) {
            return res.status(404).json({ message: 'Newsletter not found' });
        }
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete todo by ID
exports.deleteNewsletterById = async (req, res) => {
    try {
        const deleted = await NewsletterService.deleteNewsletterById(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Newsletter not found' });
        }
        res.status(200).json({ message: 'Newsletter deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


