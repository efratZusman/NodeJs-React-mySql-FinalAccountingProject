

const informationService = require('../service/InformationService');

exports.getAllinformation = async (req, res) => {
    try {
        const information = await informationService.getAllinformation();
        res.status(200).json(information);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getInformationById = async (req, res) => {
    try {
        const info = await informationService.getInformationById(req.params.id);
        if (!info) return res.status(404).json({ message: 'Information not found' });
        res.status(200).json(info);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createInformation = async (req, res) => {
    try {
        const newInformation = await informationService.createInformation(req.body);
        res.status(201).json(newInformation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateInformationById = async (req, res) => {
    try {
        const updatedInfo = await informationService.updateInformationById(req.params.id, req.body);
        if (!updatedInfo) {
            return res.status(404).json({ message: 'Information not found' });
        }
        res.status(200).json(updatedInfo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.deleteInformationById = async (req, res) => {
    try {
        const deleted = await informationService.deleteInformationById(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Information not found' });
        }
        res.status(200).json({ message: 'Information deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

