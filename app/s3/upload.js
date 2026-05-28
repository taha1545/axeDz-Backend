const multer = require("multer");
const multerS3 = require("multer-s3");
const path = require("path");

const s3Client = require("@config/s3");

const ALLOWED_EXTENSIONS = /jpeg|jpg|png|gif|webp|heic|heif/;
const ALLOWED_MIME_TYPES = new Set([
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/heic",
    "image/heif",
]);

const generateKey = (folder, file) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    return `${folder}/${uniqueSuffix}${ext}`;
};

const upload = multer({
    storage: multerS3({
        s3: s3Client,
        bucket: process.env.AWS_BUCKET,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
            cb(null, generateKey("pfp", file));
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase().slice(1);
        const mime = file.mimetype.toLowerCase();

        if (ALLOWED_EXTENSIONS.test(ext) && ALLOWED_MIME_TYPES.has(mime)) {
            return cb(null, true);
        }

        const err = new Error(`File type not allowed: ${mime}`);
        err.code = "INVALID_FILE_TYPE";
        err.status = 400;
        cb(err, false);
    },
});

module.exports = { upload, generateKey };