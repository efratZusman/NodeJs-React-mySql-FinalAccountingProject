const express = require('express');
const newsletterController = require('../controllers/NewsletterController');
const { uploadNewsletterHtml } = require('../middleware/MulterConfig');
const  getUserFromSession  = require('../middleware/getUserFromSession');
const isAdmin  = require('../middleware/isAdmin');
const validateNewsletter = require('../middleware/validateNewsletter');

const adminOnly = [getUserFromSession, isAdmin];

const router = express.Router();

router.get('/', newsletterController.getAllNewsletters);
router.post('/', [...adminOnly, validateNewsletter, newsletterController.createNewsletter]);
router.put('/:id', [...adminOnly,newsletterController.updateNewsletterById]);
router.delete('/:id', [...adminOnly,newsletterController.deleteNewsletterById]);
router.post('/upload-html',  [...adminOnly,uploadNewsletterHtml.single('file'),  newsletterController.uploadNewsletterFromHtml]);

module.exports = router;
