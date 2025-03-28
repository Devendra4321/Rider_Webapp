const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: process.env.CLOUDINARY_PROD_FOLDER_NAME,
    format: async () => "jpeg",
    public_id: (req, file) => Date.now(),
  },
});

const upload = multer({ storage });

module.exports = upload;
