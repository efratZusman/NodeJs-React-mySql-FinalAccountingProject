const express = require('express');
const newsletterController = require('../controllers/NewsletterController');
const { uploadNewsletterHtml } = require('../middleware/MulterConfig');
const  getUserFromSession  = require('../middleware/getUserFromSession');
const isAdmin  = require('../middleware/isAdmin');

const adminOnly = [getUserFromSession, isAdmin];

const router = express.Router();

// קבלת כל הניוזלטרים
router.get('/', newsletterController.getAllNewsletters);

// יצירת ניוזלטר (לא HTML)
router.post('/', [...adminOnly,newsletterController.createNewsletter]);

// עדכון לפי מזהה
router.put('/:id', [...adminOnly,newsletterController.updateNewsletterById]);

// מחיקה לפי מזהה
router.delete('/:id', [...adminOnly,newsletterController.deleteNewsletterById]);

// העלאת קובץ HTML של ניוזלטר
router.post('/upload-html',  [...adminOnly,uploadNewsletterHtml.single('file'),  newsletterController.uploadNewsletterFromHtml]);

module.exports = router;
