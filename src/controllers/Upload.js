const multer = require("multer")
const multerConfig = require("../config/multer")
const upload = multer(multerConfig)
const sharp = require("sharp")
const aws = require("aws-sdk")
const { extname,resolve } = require("path")

exports.single = async (req,res,next)=>{
    const uploadSingle = upload.single("profile_img")

    return uploadSingle(req,res,(errors)=>{
        if(errors)
        {
            return res.status(400).json({
                error:[errors]
            })
        }
        else
        {
            const s3 = new aws.S3({
                region:"eu-west-2",
                accessKeyId:process.env.UPLOAD_AWS_KEY,
                secretAccessKey:process.env.UPLOAD_AWS_PASS
            })

            const fileName = `${req.user.id}_${Date.now()}${extname(req.file.originalname)}`

            /* resizing image */
            sharp(req.file.buffer)
            .resize(400,400)
            .toBuffer()
            .then((buffer)=>{

                /* saving in CDN */
                s3.putObject({
                    Bucket:"app-avaliame",
                    Key:fileName,
                    ACL:"public-read",
                    Body:buffer
                }).promise()
                .then(()=>{
    
                    req.file.filename = fileName
    
                    next()
                })
                .catch((err)=>{
                    
                    return res.status(500).json({message:"could not upload file"})
                })
            })
            .catch((err)=>{
                
                return res.status(500).json({message:"could not upload file"})
            })
            
            
            
        }

        
    })
}