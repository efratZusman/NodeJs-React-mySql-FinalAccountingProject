const express = require('express');
const router = express.Router();
const { uploadArticleFile } = require('../middleware/MulterConfig');
const informationController = require('../controllers/InformationController');

router.post('/upload-file', uploadArticleFile.single('file'), informationController.uploadInformationFile);
router.get('/', informationController.getAllinformation);
router.post('/', informationController.createInformation);
router.get('/:id', informationController.getInformationById);
router.put('/:id', informationController.updateInformationById);
router.delete('/:id', informationController.deleteInformationById);

module.exports = router;
