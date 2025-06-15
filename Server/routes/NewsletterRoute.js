const express = require('express');
const newsletterController = require('../controllers/NewsletterController');
const upload = require('../middleware/MulterConfig');

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
  upload.single('file'), // שימוש במולטר
  newsletterController.uploadNewsletterFromHtml
);

module.exports = router;
