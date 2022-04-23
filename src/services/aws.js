const aws = require("aws-sdk")

const s3 = new aws.S3({
    region:"eu-west-2",
    accessKeyId:process.env.UPLOAD_AWS_KEY,
    secretAccessKey:process.env.UPLOAD_AWS_PASS
})

exports.S3 = s3
