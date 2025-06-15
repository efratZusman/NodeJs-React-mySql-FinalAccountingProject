const multer = require('multer');
const path = require('path');
const fs = require('fs');

// בודק אם התיקייה קיימת, ואם לא — יוצר אותה
function ensureDirExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isHtml = file.mimetype === 'text/html';
    const uploadPath = isHtml
      ? path.join(__dirname, '../uploads/newsletters')
      : path.join(__dirname, '../images');

    ensureDirExists(uploadPath); // ודא שהתיקייה קיימת

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'text/html'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('סוג קובץ לא נתמך'), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
