import cloudinary from "cloudinary";
import sharp from "sharp";
import multer from "multer";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// In-memory file storage configuration
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Please upload only images!"), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

const uploadFiles = upload.array("images", 10); // Handle up to 10 images, Can be change it to the project requirement!

const uploadImages = (req, res, next) => {
  uploadFiles(req, res, (err) => {
    if (
      err instanceof multer.MulterError &&
      err.code === "LIMIT_UNEXPECTED_FILE"
    ) {
      return res.status(400).json({ message: "Too many files to upload!" });
    }
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader
      .upload_stream({ folder: "items" }, (error, uploadFile) => {
        if (error) reject(error);
        else {
          resolve(uploadFile.secure_url);
        }
      })
      .end(buffer);
  });
};

const resizeImages = async (req, res, next) => {
  if (!req.files) return next();

  req.body.images = [];

  try {
    for (const file of req.files) {
      const buffer = await sharp(file.buffer)
        .resize(700)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toBuffer();

      const imageUrl = await uploadToCloudinary(buffer); // ✅ wrapped in a promise
      req.body.images.push(imageUrl);
    }

    next();
  } catch (error) {
    console.error("Error resizing and uploading images:", error);
    res.status(500).json({ message: "Error processing images", error });
  }
};

export { resizeImages, uploadImages };
