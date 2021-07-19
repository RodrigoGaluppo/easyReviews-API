const UserModel = require("../models/User")
const next = require("express")
const verify = require("jsonwebtoken").verify
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv/config")
const aws = require("aws-sdk")
const salt = bcrypt.genSaltSync(5)
const JWTSECRET = process.env.JWTSECRET

exports.auth = async (req,res,next)=>{
    
    const JWTSECRET = process.env.JWTSECRET
    const authToken = req.headers["authorization"]

    if(!!authToken){
        const bearer = authToken.split(" ")
        const token = bearer[1]
        
        if(JWTSECRET){
            try{
                const decoded = await verify(token,JWTSECRET)   
                         
                if(decoded){
                    const { sub } = decoded 
                    req.user = {
                        id:sub
                    }
                    
                    next()
                }
            }catch(e){
                return res.status(401).json({message:"Invalid Token"})
            }
        }
        
    }else{
        res.status(403)
        return res.json({message:"authentication is required"})
    }

}

exports.login =  async (req,res)=>{

    const {email,password} = req.body
    const user = await UserModel.findOne({where:{email}})

    if(user){

    
        if(bcrypt.compareSync(password,user.password)){
            
            if(JWTSECRET){
                jwt.sign({user_id:user.id},JWTSECRET,{subject:user.id,expiresIn:"2d"},(err,token)=>{
                    if(err){
                        res.status(500)
                        return res.json({message:"internal error"}).status(500)
                    }
                    
                    const userObj = {
                        id:user.id,
                        username:user.name,
                        email:user.email,
                        img_url:user.img_url
                    }

                    return res.json({token,user:userObj})
                })
                
            }else{
                res.status(500)
                return res.json({message:"internalError"})
            }
            
        }else{
            res.status(404)
            return res.json({message:"invalid Credentials"})
        }
        
    }else{
        res.status(401)
        return res.json({message:"user not found"})
    } 
}

exports.update = async (req,res)=>{
    const user_id = req.user.id
    const {name,email} = req.body
    
    UserModel.findByPk(user_id)
    .then((user)=>{
        if(user){

            user.update({name,email})
            user.save()

            const resUser = {
                id:user.id,
                username:user.name,
                email:user.email,
                img_url:user.img_url
            }
            return res.json({user:resUser})
        }else{
            res.status(400)
            return res.json({message:"user does not exist"}) 
        }
    }) 
    .catch((err)=>{ 
        res.status(400)
        return res.json({message:"user does not exist"})
    })  
}

exports.delete = async (req,res)=>{
    const user_id = req.user.id
    
    UserModel.findByPk(user_id)
    .then((user)=>{
        if(user){

            const resUser = {
                user_id:user.id,
                name:user.name,
                email:user.email
            }
            user.destroy()
            user.save()
            return res.json(resUser)
        }else{
            res.status(400)
            return res.json({message:"user does not exist"}) 
        }
    }) 
    .catch((err)=>{ 
        res.status(400)
        return res.json({message:"user does not exist"})
    })   
}

exports.create = async (req,res)=>{
    const {name,email,password,user_type} = req.body
    
    // making sure that the usertype is only 0 or 1
    if(!!user_type && !(user_type >= 0 && user_type <= 1))
    {
        res.status(400)
        return res.json({message:"user type can be only 0 or 1"})
    }

    // verify wheter user exists or not
    try{
        const userExists = await UserModel.findOne({where:{email}})

        if(userExists)
        {
            return res.status(400).json({
                message:"email already in use"
            })
        }
    }
    catch(e)
    {
        return res.status(500).json({
            message:"internal server error"
        })
    }

    // insert new user
    bcrypt.hash(password,salt, async function(err,hash){
        if(err){
            res.status(400)
            return res.json({message:"an error ocurred"})
        }
        UserModel.create(
        {
            name:name,
            email:email,
            password:hash,
            user_type: !!user_type ? user_type : 0,
            profile_img:"user.png"
        })
        .then((user)=>{
            return res.status(200).json({
                user_id:user.id,
                email:user.email,
                name:user.name,
                img_url:user.img_url
            })
        })
        .catch((err)=>{
            console.log(err);
            return res.status(500).json({
                message:"internal server error"
            })
        })
        
    })
   
}

exports.upload = async (req,res)=> {
    
    const fileName = req.file.filename

    console.log(req.file);

    const {id} = req.user

    let user

    try{
        user = await UserModel.findByPk(id)

    }

    catch(e)
    {
        console.log(e);
        return res.status(500).json({
            message:"internal server error"
        })
    }

    if(user)
    {

        const s3 = new aws.S3({
            region:"eu-west-2",
            accessKeyId:process.env.UPLOAD_AWS_KEY,
            secretAccessKey:process.env.UPLOAD_AWS_PASS
        })

        if(user.profile_img !== "user.png")
        {
            try
            {
                await s3.deleteObject({
                    Bucket:"app-avaliame",
                    Key:user.profile_img
                }).promise()
            }
            catch(err)
            {
                console.log(err);
                return res.status(500).json({message:"could not upload file"})
            }
        }

        await user.update({
            profile_img:fileName
        })
        
        await user.save()

        return res.json({
            user:{
                id,
                username:user.name,
                email:user.email,
                img_url:user.img_url
            }
        })

       
    }
    
    else{
        return res.status(400).json({
            message:"user does not exist"
        })
    }

    return res.json(fileName)

}

