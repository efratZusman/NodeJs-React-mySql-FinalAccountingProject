const multer = require('multer');
const path = require('path');
const fs = require('fs');

function ensureDirExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath;
    if (req.baseUrl.includes('clients')) {
      uploadPath = path.join(__dirname, '../images');
    } else if (req.baseUrl.includes('information')) {
      uploadPath = path.join(__dirname, '../uploads/information');
    } else if (req.baseUrl.includes('newsletters')) {
      uploadPath = path.join(__dirname, '../uploads/newsletters');
    } else {
      uploadPath = path.join(__dirname, '../uploads/other');
    }
    ensureDirExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const clientImageFileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('רק קבצי תמונה מותרים'), false);
  }
};

const articleFileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('רק קבצי Word או PDF מותרים'), false);
  }
};

const newsletterHtmlFileFilter = (req, file, cb) => {
  const allowedTypes = ['text/html'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('רק קבצי HTML מותרים'), false);
  }
};

const uploadClientImage = multer({ storage, fileFilter: clientImageFileFilter });

const uploadArticleFile = multer({ storage, fileFilter: articleFileFilter });

const uploadNewsletterHtml = multer({ storage, fileFilter: newsletterHtmlFileFilter });

module.exports = {
  uploadClientImage,
  uploadArticleFile,
  uploadNewsletterHtml
};
