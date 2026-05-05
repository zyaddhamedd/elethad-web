const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const router = express.Router();
const verifyToken = require('../middleware/auth');

const allowedUploadTypes = new Set(['categories', 'products', 'orders']);

function getUploadType(type = 'categories') {
  return allowedUploadTypes.has(type) ? type : 'categories';
}

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const type = getUploadType(req.query.type);
    return {
      folder: `elethad/${type}`,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ fetch_format: 'auto', quality: 'auto', width: 1200, crop: 'limit' }],
    };
  },
});

const fileFilter = (req, file, cb) => {
  // Accept image files only
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpg, jpeg, png, webp) are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// Upload image endpoint
router.post('/upload', verifyToken, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // req.file.path contains the Cloudinary secure_url
  const imageUrl = req.file.path;
  res.json({ 
    success: true, 
    imageUrl: imageUrl,
    filename: req.file.filename // Cloudinary stores public_id here
  });
});

module.exports = router;
