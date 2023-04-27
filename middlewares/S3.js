// const S3 = require("aws-sdk/clients/s3")
// require('dotenv').config()
// const fs = require("fs")
// const bucketName = process.env.AWS_BUCKET_NAME
// const region = process.env.AWS_REGION
// const accessKeyID = process.env.AWS_ACCESS_KEY_ID 
// const secretKey = process.env.AWS_SECRET_ACCESS_KEY 

// const s3 = new S3({
//     region,
//     accessKeyID,
//     secretKey
// })

// function uploadS3(file){
//     const fileStream = fs.createReadStream(file.path)
//     const uploadParams = {
//         Bucket: bucketName,
//         Body: fileStream,
//         Key: file.filename
//     }

//     return s3.upload(uploadParams).promise()
// }

// function getFileS3(fileKey){
//     const downloadParams = {
//         Key: fileKey,
//         Bucket: bucketName
//     }

//     return s3.getObject(downloadParams).createReadStream()
// }
// exports.getFileS3 = getFileS3
// exports.uploadS3 = uploadS3
const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand  } = require("@aws-sdk/client-s3")

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner")

require('dotenv').config()

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY_ID 
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY 

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey
  }
})




exports.uploadFile = function uploadFile(fileBuffer, fileName, mimetype) {
  const uploadParams = {
    Bucket: bucketName,
    Body: fileBuffer,
    Key: fileName,
    ContentType: mimetype
  }

  return s3Client.send(new PutObjectCommand(uploadParams));
}

exports.deleteFile =  function deleteFile(fileName) {
  const deleteParams = {
    Bucket: bucketName,
    Key: fileName,
  }

  return s3Client.send(new DeleteObjectCommand(deleteParams));
}

exports.getObjectSignedUrl = async function getObjectSignedUrl(key) {
  const params = {
    Bucket: bucketName,
    Key: key
  }

  // https://aws.amazon.com/blogs/developer/generate-presigned-url-modular-aws-sdk-javascript/
  const command = new GetObjectCommand(params);
  const seconds = 60000
  const url = await getSignedUrl(s3Client, command);

  return url
}