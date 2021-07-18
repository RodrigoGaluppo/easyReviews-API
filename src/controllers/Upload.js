const multer = require("multer")
const multerConfig = require("../config/multer")
const upload = multer(multerConfig)
const sharp = require("sharp")
const path = require("path")

exports.single = async (req,res,next)=>{
    const uploadSingle = upload.single("profile_img")

    return uploadSingle(req,res,(errors)=>{
        if(errors)
        {
            console.log(errors);
            return res.status(400).json({
                error:[errors]
            })
        }
        

        next()
    })
}