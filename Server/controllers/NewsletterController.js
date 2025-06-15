const NewsletterService = require('../service/NewsletterService');
const fs = require('fs').promises;
const path = require('path');


// Get all newsletters
exports.getAllNewsletters = async (req, res) => {
  try {
    const newsletters = await NewsletterService.getAllNewsletters();
    res.status(200).json(newsletters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create newsletter (normal JSON body with content string or path)
exports.createNewsletter = async (req, res) => {
  try {
    const newNewsletter = await NewsletterService.createNewsletter(req.body);
    res.status(201).json(newNewsletter);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update newsletter by ID
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

// Delete newsletter by ID
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

// Upload newsletter from HTML file
exports.uploadNewsletterFromHtml = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = req.file.path; // הנתיב המלא של הקובץ ששמור
    const { title, date } = req.body;

    if (!title || !date) {
      // במידה ואין כותרת או תאריך, מחזירים שגיאה
      return res.status(400).json({ message: 'Title and date are required' });
    }

   const relativePath = path.relative(path.join(__dirname, '../uploads'), req.file.path).replace(/\\/g, '/');


    // שומרים את הנתיב של הקובץ בשדה content במסד הנתונים
    const newNewsletter = await NewsletterService.createNewsletter({
      title,
      date,
      filePath: relativePath,
    });

    res.status(201).json(newNewsletter);
  } catch (error) {
    console.error('Error uploading newsletter HTML:', error);
    res.status(500).json({ error: error.message });
  }
};
