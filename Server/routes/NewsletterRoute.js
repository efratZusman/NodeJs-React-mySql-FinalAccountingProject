const express = require('express');
const newsletterController = require('../controllers/NewsletterController');
const { uploadNewsletterHtml } = require('../middleware/MulterConfig');

const router = express.Router();

// קבלת כל הניוזלטרים
router.get('/', newsletterController.getAllNewsletters);

// יצירת ניוזלטר (לא HTML)
router.post('/', newsletterController.createNewsletter);

// עדכון לפי מזהה
router.put('/:id', newsletterController.updateNewsletterById);

// מחיקה לפי מזהה
router.delete('/:id', newsletterController.deleteNewsletterById);

// העלאת קובץ HTML של ניוזלטר
router.post(
  '/upload-html',
  uploadNewsletterHtml.single('file'),
  newsletterController.uploadNewsletterFromHtml
);

module.exports = router;
