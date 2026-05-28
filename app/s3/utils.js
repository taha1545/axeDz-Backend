require("dotenv").config();

const { DeleteObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3Client = require("@config/s3");
const upload = require("./upload");


const bucketName = process.env.AWS_BUCKET;

const deleteFile = async (fileKey) => {
    if (!fileKey) throw new Error("File key is required for deletion");
    try {
        await s3Client.send(
            new DeleteObjectCommand({ Bucket: bucketName, Key: fileKey })
        );
        return { success: true, deleted: fileKey };
    } catch (error) {
        console.error(`[S3 Delete Error] key=${fileKey}:`, error.message);
        throw new Error("Could not delete file from storage.");
    }
};


const getSignedFileUrl = async (fileKey, expiresIn = 3600) => {
    try {
        if (!fileKey) throw new Error("File key is required to generate URL");
        //
        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: fileKey,
        });
        //
        const url = await getSignedUrl(s3Client, command, { expiresIn });
        return { success: true, url };
        
    } catch (error) {
        console.error(`[S3 Signed URL Error]: ${error.message}`);
        throw new Error("Could not generate secure URL.");
    }
};

// 
module.exports = {
    upload,
    deleteFile,
    getSignedFileUrl,
};