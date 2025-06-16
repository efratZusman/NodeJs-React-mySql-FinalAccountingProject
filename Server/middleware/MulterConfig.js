const multer = require('multer');
const path = require('path');
const fs = require('fs');

// בודק אם התיקייה קיימת, ואם לא — יוצר אותה
function ensureDirExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Storage כללי (אפשר להפריד אם תרצה)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath;
    // לפי סוג הראוט/קובץ, נחליט לאן לשמור
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

// fileFilter ללקוחות (רק תמונות)
const clientImageFileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('רק קבצי תמונה מותרים'), false);
  }
};

// fileFilter למאמרים (רק וורד או פידיאף)
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

// fileFilter לניוזלטרים (רק HTML)
const newsletterHtmlFileFilter = (req, file, cb) => {
  const allowedTypes = ['text/html'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('רק קבצי HTML מותרים'), false);
  }
};

// Multer ללקוחות
const uploadClientImage = multer({ storage, fileFilter: clientImageFileFilter });

// Multer למאמרים
const uploadArticleFile = multer({ storage, fileFilter: articleFileFilter });

// Multer לניוזלטרים
const uploadNewsletterHtml = multer({ storage, fileFilter: newsletterHtmlFileFilter });

module.exports = {
  uploadClientImage,
  uploadArticleFile,
  uploadNewsletterHtml
};
