const multer = require("multer")
const multerConfig = require("../config/multer")
const upload = multer(multerConfig)
const sharp = require("sharp")
const { extname } = require("path")
const { S3 } = require("../services/aws")

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
    
            const fileName = `${req.user.id}_${Date.now()}${extname(req.file.originalname)}`

            /* resizing image */
            sharp(req.file.buffer)
            .resize(400,400)
            .toBuffer()
            .then((buffer)=>{

                /* saving in CDN */
                S3.putObject({
                    Bucket:"app-avaliame",
                    Key:fileName,
                    ACL:"public-read",
                    Body:buffer
                }).promise()

                .then(()=>{
    
                    req.file.filename = fileName
    
                    next()
                })
                .catch(()=>{
                    
                    return res.status(500).json({message:"could not upload file"})
                })
            })
            .catch((err)=>{
                console.log(err);
                return res.status(500).json({message:"could not upload file"})
            })
            
            
            
        }

        
    })
}