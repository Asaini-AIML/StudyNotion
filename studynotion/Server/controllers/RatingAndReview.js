const Course = require('../models/Course');
const RatingAndReview=require('../models/RatingAndReview');
//create rating
exports.createRating=async(req,res)=>{
    try{
        //get user id
        const userId=req.user.id;
        //fetched from req body
        const {courseId,rating,review}=req.body;
        //check if user is enrolled or not
        const cpurseDetails=await Course.findOne({_id:courseId,studentsEnrolled:{$elemMatch:{$eq:userId}}});
        if(!courseDetails){
            return res.status(400).json({success:false,message:'user not enrolled in this course'});
        }
        //check if user alredy reviewed
        const alredyreviewDetails=await RatingAndReview.findOne({
            course:courseId,
            user:userId
        })
        if(alredyreviewDetails){
            return res.status(400).json({success:false,message:'user already reviewed this course'});
        }

        //creating rating and review
        const ratingReview=await RatingAndReview.create({
            course:courseId,
            user:userId,
            rating,
            review
        });
        //update course with this rating and review
        const updatedCourseDetails =await Course.findByIdAndUpdate(
            {_id:courseId},
            {
                $push:{
                    ratingAndReview:ratingReview,
                }
            },
            {new:true}
        );
        console.log(updatedCourseDetails);
        //return response
        return res.status(201).json({success:true,message:'rating and review created successfully',data:ratingReview});
        

    }
    catch(err){
        console.error(err);
        return res.status(500).json({success:false,message:'something went wrong while creating rating'});
    }
};

//get Avg rating
exports.getAverageRating=async(req,res)=>{
    try{
        //get courseId
        const courseId=req.body.courseId;
        //get avg rating
        const result=await RatingAndReview.aggregate([
            {
                $match:{
                    course:new mongoose.Types.ObjectId(courseId)
                }
            },
            {
                $group:{
                    _id:null,
                    avgRating:{$avg:'$rating'}
                }
            }
        ]);
        //return rating
        if(result.length>0){
            return res.status(200).json({success:true,averageRating:result[0].avgRating});
       //if no rating reviewexist
         
    }
    return res.status(200).json({success:true,averageRating:0});
}
    catch(err){
        console.error(err);
        return res.status(500).json({success:false,message:'something went wrong while fetching avg rating'});
    }
};



//get allrating 

exports.getAllRating=async(req,res)=>{
    try{
        const allReviews = await RatingAndReview.find({}).sort({rating:"desc"}).populate({path:'user',select:'firstName lastName email image'}).populate({path:'course',select:'CourseName'}).exec();
        return res.status(200).json({success:true,message:'all review fetched',data:allReviews});

    }
    catch(err){
        console.error(err);
        return res.status(500).json({success:false,message:error.message});
    }
}

