const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const s3Client = require("@config/s3");

const bucketName = process.env.AWS_BUCKET;

const ALLOWED_TYPES = new Set(["jpeg", "jpg", "png", "gif", "webp", "heic", "heif"]);

const S3HandleJsonImage = async (user, newImageData) => {
    //
    if (!newImageData?.includes("base64")) return;
    // 
    const mimeMatch = newImageData.match(/^data:image\/(\w+);base64,/);
    if (!mimeMatch) throw new Error("Invalid base64 image format.");
    const type = mimeMatch[1].toLowerCase();
    if (!ALLOWED_TYPES.has(type)) {
        throw new Error(`Image type not allowed: ${type}`);
    }
    // 
    const fileKey = `pfp/${Date.now()}-${Math.floor(Math.random() * 1e9)}.${type}`;
    const buffer = Buffer.from(
        newImageData.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
    );
    await s3Client.send(
        new PutObjectCommand({
            Bucket: bucketName,
            Key: fileKey,
            Body: buffer,
            ContentType: `image/${type}`,
        })
    );
    //
    if (user.imagePath) {
        try {
            await s3Client.send(
                new DeleteObjectCommand({
                    Bucket: bucketName,
                    Key: user.imagePath,
                })
            );
        } catch (delErr) {
            console.warn(`[S3 Cleanup Warning]: Could not delete old image "${user.imagePath}": ${delErr.message}`);
        }
    }
    //
    user.imagePath = fileKey;
    await user.save();
};

module.exports = S3HandleJsonImage;