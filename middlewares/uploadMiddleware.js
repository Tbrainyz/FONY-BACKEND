const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const multer = require("multer");

// Memory storage for multer to get file buffer
const storage = multer.memoryStorage();
const multerUpload = multer({ storage });

const upload = async (req, res, next) => {
  // Parse multipart/form-data
  multerUpload.single("image")(req, res, async (err) => {
    if (err) return res.status(400).json({ message: "Multer error", error: err });

    // If no file, skip Cloudinary
    if (!req.file || !req.file.buffer) return next();

    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "task-manager" }, // Change folder if needed
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    try {
      const result = await streamUpload(req.file.buffer);
      req.file.cloudinaryUrl = result.secure_url; // Attach Cloudinary URL to req.file
      next();
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      res.status(500).json({ message: "Failed to upload image", error: error.message });
    }
  });
};

module.exports = upload;