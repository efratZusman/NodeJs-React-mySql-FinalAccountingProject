const InformationService = require('../service/InformationService');

exports.getAllInformations = async (req, res) => {
    try {
        const informations = await InformationService.getAllInformations();
        res.status(200).json(informations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createInformation = async (req, res) => {
    try {
        const newInformation = await InformationService.createInformation(req.body);
        res.status(201).json(newInformation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateInformationById = async (req, res) => {
    try {
        const informations = await InformationService.updateInformationById(req.params.id, req.body);
        if (!informations) {
            return res.status(404).json({ message: 'Informations not found' });
        }
        res.status(200).json(informations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteInformationById = async (req, res) => {
    try {
        const deleted = await InformationService.deleteInformationById(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Information not found' });
        }
        res.status(200).json({ message: 'Information deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


