const express = require('express');
const multer = require('multer');
const path = require('path');
const clientController = require('../controllers/ClientController');

const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../images'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

router.get('/', clientController.getAllClients);
router.post('/', upload.single('logo'), clientController.createClient);
router.delete('/:id', clientController.deleteClient); // <-- fixed

module.exports = router;
