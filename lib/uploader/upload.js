const fs = require('fs');
const stream = require('stream');
const path = require("path")

// Configure AWS SDK
// AWS.config.update({
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     region: process.env.AWS_BUCKET_REGION
// });
// const s3 = new AWS.S3();

const uploadFile = (file, fileName, pathName, extension) => {

    // for upload in the local
    return new Promise((resolve, reject) => {
        const uploadDir = path.join(process.cwd(), 'public', 'photos', pathName);
        const filePath = path.join(uploadDir, fileName);

        const writeStream = fs.createWriteStream(filePath);
        writeStream.write(file);
        writeStream.end();

        writeStream.on('finish', () => {
            resolve({
                status: 200,
                imageUrl: filePath,
                message: 'Image uploaded successfully',
            });
        });

        writeStream.on('error', (err) => {
            console.error("Error in the multer upload function", err);
            reject({
                status: 400,
                message: 'Something went wrong. Please try again',
            });
        });
    });

    // for upload in to the aws s3 bucket

    // return new Promise((resolve, reject) => {
    //     const readableStream = new stream.PassThrough();
    //     readableStream.end(file);
    //     const params = {
    //         Bucket: process.env.AWS_BUCKET_NAME,
    //         Key: fileName,
    //         Body: readableStream,
    //         ContentType: `image/${extension}`,
    //         ACL: "public-read",
    //         ResponseContentDisposition: `attachment; filename="${fileName}"`
    //     };

    //     s3.upload(params, (err, data) => {
    //         if (err) {
    //             console.error(err);
    //             reject({
    //                 status: 400,
    //                 message: 'Something went wrong. Please try again',
    //             });
    //         } else {
    //             resolve({
    //                 status: 200,
    //                 imageUrl: data.Location,
    //                 message: 'Image uploaded successfully',
    //             });
    //         }
    //     });
    // });
};

module.exports = { uploadFile };