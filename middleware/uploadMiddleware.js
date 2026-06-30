const fs = require('fs');
const path = require('path');
const multer = require('multer');

const PRODUCT_UPLOAD_DIR = path.join(__dirname, '..', 'uploads', 'products');

if (!fs.existsSync(PRODUCT_UPLOAD_DIR)) {
  fs.mkdirSync(PRODUCT_UPLOAD_DIR, { recursive: true });
}

const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, PRODUCT_UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const extension = path.extname(file.originalname).toLowerCase();
    const safeName = file.originalname
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9-_.]/g, '')
      .replace(/-+/g, '-');
    cb(null, `${timestamp}-${safeName}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported image format. Only JPG, PNG, and WEBP are allowed.'));
  }
};

const productImageUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2 MB
  },
});

module.exports = { productImageUpload, PRODUCT_UPLOAD_DIR };
