import S3 from 'aws-sdk/clients/s3'
import * as dotenv from 'dotenv'

import { v4 } from "uuid";
import { extname } from 'path'

dotenv.config()

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY

const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey
})

export function uploadFile(file) {

    const uploadParams = {
        Bucket: bucketName,
        Body: file.buffer,
        Key: v4() + extname(file.originalname)
    }

    return s3.upload(uploadParams).promise()
}

export function getFile(fileKey) {
    const downloadParams = {
        Key: fileKey,
        Bucket: bucketName
    }

    return s3.getObject(downloadParams).createReadStream().promise()
}