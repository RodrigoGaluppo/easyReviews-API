const ReviewModel = require("../models/Review")

exports.get = async (req,res) => {
    const {review_id} = req.params
    
    ReviewModel.findByPk(review_id)

    .then((review)=>{
        if(review){     
            return res.json({
                review
            })
        }else{
            res.status(400)
            return res.json({message:"review does not exist"}) 
        }
    }) 
    .catch((err)=>{ 
        
        res.status(400)
        return res.json({message:"review does not exist"})
    })    
}

exports.update = async (req,res) => {
    const {review_id,score,comment} = req.body
    const user_id = req.user.id
    
    // making sure that the score is limited between 1-10
    if(!!score && !(score >= 1 && score <= 10))
    {
        res.status(400)
        return res.json({message:"score must be between 1-10"})
    }

    ReviewModel.findOne({where:{user_review:user_id,id:review_id}})
    .then((review)=>{
        if(review){

            review.update({
                comment,
                score
            })
            review.save()
            
            return res.json({
                review
            })
        }else{
            res.status(400)
            return res.json({message:"review does not exist"}) 
        }
    }) 
    .catch((err)=>{ 
        
        res.status(400)
        return res.json({message:"review does not exist"})
    })    
}

exports.delete = async (req,res) => {
    const review_id = req.body.review_id
    const user_id = req.user.id
    
    ReviewModel.findOne({where:{user_review:user_id,id:review_id}})
    .then((review)=>{
        if(review){

            const resReview = {
                review_id:review.id,
            }
            review.destroy()
            review.save()
            return res.json(resReview)
        }else{
            res.status(400)
            return res.json({message:"review does not exist"}) 
        }
    }) 
    .catch((err)=>{ 
        res.status(400)
        return res.json({message:"review does not exist"})
    })   
}

exports.create = async (req,res) => {
    const {company_to_review,comment,score} = req.body
    const user_review = req.user.id

    // making sure that the score is limited between 1-10
    if(!!score && !(score >= 1 && score <= 10))
    {
        res.status(400)
        return res.json({message:"score must be between 1-10"})
    }

    // verify wheter review alredy exists or not
    try{
        const userHasAlredyReviewed = await ReviewModel.findOne({where:{user_review,company_to_review}})

        if(userHasAlredyReviewed)
        {
            return res.status(400).json({
                message:"you can only review once"
            })
        }
    }
    catch(e)
    {
        console.log(e);
        return res.status(500).json({
            message:"internal server error"
        })
    }

    // insert new review
    try{
        const newReview = await ReviewModel.create({
            user_review,
            company_to_review,
            comment,
            score,
        })
        newReview.save()
        
        return res.json({
            newReview
        })
    }
    catch(e)
    {
        console.log(e);
        return res.status(500).json({
            message:"internal server error"
        })
    }
   
}

exports.list = async (req,res) => {
    const {company_id} = req.params

    try{
        const reviews = ReviewModel.findAll({where:{company_to_review:company_id}})
        return res.json({reviews})
    }
    catch(e)
    {
        return res.status(500).json({
            message:"internal server error"
        })
    }

}
