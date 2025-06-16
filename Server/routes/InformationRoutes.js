const express = require('express');
const router = express.Router();
const { uploadArticleFile } = require('../middleware/MulterConfig');
const informationController = require('../controllers/InformationController');
const  getUserFromSession  = require('../middleware/getUserFromSession');
const  isAdmin  = require('../middleware/isAdmin');

const adminOnly = [getUserFromSession, isAdmin];

router.post('/upload-file', [...adminOnly,uploadArticleFile.single('file'), informationController.uploadInformationFile]);
router.get('/', informationController.getAllinformation);
// router.post('/', informationController.createInformation);
router.get('/:id', informationController.getInformationById);
router.put('/:id', [...adminOnly,informationController.updateInformationById]);
router.delete('/:id', [...adminOnly,informationController.deleteInformationById]);

module.exports = router;
