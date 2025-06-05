const express = require('express');
const newsletterController = require('../controllers/NewsletterController');

const router = express.Router();
router.get('/', newsletterController.getAllNewsletters);
router.post('/', newsletterController.createNewsletter);
router.put('/:id', newsletterController.updateNewsletterById);
router.delete('/:id', newsletterController.deleteNewsletterById);
module.exports = router;
