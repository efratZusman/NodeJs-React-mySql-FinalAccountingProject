const NewsletterService = require('../service/NewsletterService');
const fs = require('fs').promises;
const path = require('path');

exports.getAllNewsletters = async (req, res) => {
  try {
    const newsletters = await NewsletterService.getAllNewsletters();
    const newslettersWithFullUrl = newsletters.map(newsletter => ({
      ...newsletter,
      filePath: newsletter.filePath ? `${process.env.BASE_URL || 'http://localhost:3000'}${newsletter.filePath}` : null
    }));
    res.status(200).json(newslettersWithFullUrl);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createNewsletter = async (req, res) => {
  try {
    const newNewsletter = await NewsletterService.createNewsletter(req.body);
    res.status(201).json(newNewsletter);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateNewsletterById = async (req, res) => {
  try {
    const updated = await NewsletterService.updateNewsletterById(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Newsletter not found' });
    }
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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

exports.uploadNewsletterFromHtml = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const { title, date } = req.body;

    if (!title || !date) {
      return res.status(400).json({ message: 'Title and date are required' });
    }
let relativePath = null; 
    if (req.file) {

       relativePath = path.relative(path.join(__dirname, '../uploads'), req.file.path).replace(/\\/g, '/');
      relativePath = '/uploads/' + relativePath; 
    }

    const newNewsletter = await NewsletterService.createNewsletter({
      title,
      date,
      filePath: relativePath,
    });
    res.status(201).json({
      ...newNewsletter,
      filePath: filePath ? `${process.env.BASE_URL || 'http://localhost:3000'}${filePath}` : null
    });
    // res.status(201).json(newNewsletter);
  } catch (error) {
    console.error('Error uploading newsletter HTML:', error);
    res.status(500).json({ error: error.message });
  }
};



