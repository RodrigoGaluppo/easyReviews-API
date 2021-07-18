const multer = require("multer")
const Sequelize = require("sequelize")
const ReviewModel = require("../models/Review")
const CompanyModel = require("../models/Company")
const UserModel = require("../models/User")
const sharp = require("sharp")
const {resolve} = require("path")

const Op = Sequelize.Op

exports.update = async (req,res) => {
    const {name,city,description,img_name,company_id,country,site_url} = req.body
    const user_id = req.user.id
    
    CompanyModel.findOne({where:{user_id:user_id,id:company_id}})
    .then((company)=>{
        if(company){

            company.update({
                name: !!name ? name : company.name,
                city: !!city ? city : company.city,
                country: !!country ? country : company.country,
                description: !!description ? description : company.description,
                site_url: !!site_url ? site_url : company.site_url,
                img_name: !!img_name ? img_name : company.img_name,
            })
            company.save()
            
            return res.json({
                company
            })
        }else{
            res.status(400)
            return res.json({message:"company does not exist"}) 
        }
    }) 
    .catch((err)=>{ 
        console.log(err);
        res.status(400)
        return res.json({message:"company does not exist"})
    })    
}

exports.delete = async (req,res) => {
    const company_id = req.params.company_id
    const user_id = req.user.id
    
    CompanyModel.findOne({where:{user_id:user_id,id:company_id}})
    .then((company)=>{
        if(company){

            const resCompany = {
                company_id:company.id,
            }
            company.destroy()
            company.save()
            return res.json(resCompany)
        }else{
            res.status(400)
            return res.json({message:"company does not exist"}) 
        }
    }) 
    .catch((err)=>{ 
        res.status(400)
        return res.json({message:"company does not exist"})
    })   
}

exports.create = async (req,res) => {
    const {name,city,description,img_name,country,site_url} = req.body
    const user_id = req.user.id

    try{
        const newCompany = await CompanyModel.create({
            user_id,
            name,
            city,
            description,
            img_name,
            country,
            site_url,
            img_name:"company.jpg"
        })

        return res.json({
            newCompany
        })
    }
    catch(e)
    {
        
        return res.status(500).json({
            message:"internal server error"
        })
    }
   
}

exports.get = async (req,res) => {

    const {company_id} = req.params
    let responseReviews = []

    let company

    try{
         company = await CompanyModel.findByPk(company_id)
    }
    catch(e)
    {
        
        return res.status(500).json({
            message:"internal server error"
        })
    }


    if(!!company)
    {
        /* searching company */
        ReviewModel.findAll({where:{company_to_review:company_id}})
        
        .then(reviews=>{

            let averageScore = 0
            /* getting reviews */
            reviews = reviews.map((review)=>{

                averageScore += review.score

                return(
                    {
                        id:review.id,
                        user_review:review.user_review,
                        company_to_review:review.company_to_review,
                        score:review.score,
                        comment:review.comment
                    }
                )
            })

            /* getting userReviews info */
            let userReviewsInfo = new Promise(function(myResolve, myReject) {
                let c = 0; // counter of reviews
                
                // if there arent reviews 
                if(reviews.length == 0)
                    myResolve()
                
                averageScore = Number((averageScore / reviews.length).toFixed(2))
                
                /* getting userReviews info */
                reviews.forEach(review=>{
                    UserModel.findByPk(review.user_review)
        
                    .then(user=>{
                        
                        review.user_review = {
                            user_id:user.id,
                            name:user.name,
                            img_url:user.img_url
                        }

                        responseReviews[c] = review
    
                        c++
                        
                        if(c == reviews.length)
                            myResolve()
        
                    })
                })
                
            });
        
            userReviewsInfo
            .then(()=>{
                return res.json({
                    id:company.id,
                    name:company.name,
                    city:company.city,
                    description:company.description,
                    img_url:company.img_url,
                    site_url:company.site_url,
                    averageScore,
                    reviews:responseReviews
                }  )
            })
            .catch(err=>{
                console.log(err);
                return res.status(400).json({message:"could not load company info"})
            })

        })
        .catch(()=>{
            return res.status(400).json({message:"could not load company info"})
        })
    }
    else{
        return res.status(400).json({
            message:"company does not exist"
        })
    }
        
}

exports.list = async (req,res) => {
    

    response = []

    let {page,name} = req.params

    console.log(page);

    if(!page)
        page = 0

    const limit = 10;

    /* searching for companies */
    try{
        let companies

        if(name)
        {
            companies = await CompanyModel.findAll({
                where:{
                    name:{
                        [Op.like]: `%${name}%`
                    },
               
                },limit,offset:limit * page
        })
        }
        else{
            companies = await CompanyModel.findAll({limit,offset:limit * page})
        }

        companiesObj = companies.map((company)=>
             (
                {
                    id:company.id,
                    name:company.name,
                    city:company.city,
                    description:company.description,
                    img_url:company.img_url,
                    site_url:company.site_url,
                    averageScore:0
                }    
            )
        )

    }
    catch(e)
    {
        console.log(e);
        return res.status(500).json({
            message:"internal server error"
        })
    }

    if(companiesObj.length === 0)
        return res.status(404).json({
            message:"not found"
        })

    /*  calculating the average of the scores */
    let myPromise = new Promise(function(myResolve, myReject) {
        let c = 0;

        companiesObj.forEach(company=>{
            ReviewModel.findAll({where:{company_to_review:company.id}})

            .then(reviews=>{
                
                let sum = 0

                reviews.forEach(review=>{
                    sum += review.score
                })

                if(reviews.length > 0 ) 
                    company.averageScore = Number((sum / reviews.length).toFixed(2))
                
                response[c] = company

                c++
                
                if(c == companiesObj.length)
                        myResolve()

            })
        })
        
    });

    myPromise.then(()=>{
        return res.json({
            companies:response
        })
    })

}

exports.listByUserId = async (req,res) => {
    
    response = []

    const {id} = req.user

    /* searching for companies */
    try{
        let companies

        companies = await CompanyModel.findAll({where:{
            user_id:id
        }})

        companiesObj = companies.map((company)=>
             (
                {
                    id:company.id,
                    name:company.name,
                    city:company.city,
                    description:company.description,
                    img_url:company.img_url,
                    site_url:company.site_url,
                    averageScore:0
                }    
            )
        )

    }
    catch(e)
    {
        console.log(e);
        return res.status(500).json({
            message:"internal server error"
        })
    }
    
    if(companiesObj.length == 0)
        return res.json({companies:response})

    /*  calculating the average of the scores */
    let myPromise = new Promise(function(myResolve, myReject) {
        let c = 0;

        companiesObj.forEach(company=>{
            ReviewModel.findAll({where:{company_to_review:company.id}})

            .then(reviews=>{
                
                let sum = 0

                reviews.forEach(review=>{
                    sum += review.score
                })

                if(reviews.length > 0 ) 
                    company.averageScore = Number((sum / reviews.length).toFixed(2))
                
                response[c] = company

                c++
                
                if(c == companiesObj.length)
                        myResolve()

            })
        })
        
    });

    myPromise.then(()=>{
        return res.json({
            companies:response
        })
    })

}

exports.upload = async (req,res)=> {

    
    const fileName = req.file.filename

    const {company_id} = req.body

    try{
        const company = await CompanyModel.findByPk(company_id)

        if(company)
        {
            company.update({
                img_name:fileName
            })
            
            try{
                await company.save()
            }
            catch(e){
                ()=>{
                    console.log(e);
                    return res.status(400).json({
                        message:"copmany does not exist"
                    })
                }
            }
            
            try{
                
                await sharp(req.file.path)
                .resize(200,200,{fit:"contain"})
                .toFile("test.jpeg")
            }
            catch(e)
            {
                console.log(e);
            }

            return res.json({
                company:{
                    name:company.name,
                    city:company.city,
                    country:company.country,
                    img_name:fileName,
                    description:company.description
                }
            })
        }
        
        else{
            return res.status(400).json({
                message:"copmany does not exist"
            })
        }

    }

    catch(e)
    {
        
        return res.status(500).json({
            message:"internal server error"
        })
    }


    return res.json(fileName)

}

