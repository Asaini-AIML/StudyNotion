const Course=require('../models/Course');
const Tag=require('../models/Tags');
const User=require('../models/User');
const {uploadImageTOCloudinary}=require('../utils/imageUploader');

//create course
exports.createCourse=async(req,res)=>{
    try{
        //fetch data
       const {courseName,courseDescription,whatYouWillLearn,price,tag}=req.body;
       //get thumbnail
         const thumbnail=req.files.thumbnailImage;
    //validation
    if(!courseName || !courseDescription || !whatYouWillLearn || !price || !tags || !thumbnail){
        return res.json({success:false,message:'All fields are required'});
    }
    //check for instructor
    const userId=req.user.id;
    const instructorDetails=await User.findById(userId);
    console.log(instructorDetails);
    if(!instructorDetails){
        return res.status(404).json({success:false,message:'Instructor not found'});

    }
    //check given tag is valid or not
    const tagDetails=await Tag.findById(tag);
    if(!tagDetails){
        return res.status(404).json({success:false,message:'Tag not found'});
    }
    //upload image to cloudinary
    const thumbnailImage=await uploadImageTOCloudinary(thumbnail,process.env.FOLDER_NAME);
    //create new course entry
    const newCourse=new Course({
        courseName,
       courseDescription,
        whatYouWillLearn:whatYouWillLearn.split(','),
        price,
        instructor:instructorDetails._id,
        tag:tagDetails._id,

        image:thumbnailImage.secure_url
    });
    //aad the new course to the user schema of instructor
    await User.findByIdAndUpdate(
        { _id:instructorDetails._id}
    ,{
        $push:{
            courses:newCourse._id
        }
    },
    {new:true}
    );
    //update the tag schema
    await Tag.findByIdAndUpdate(
        {_id:tagDetails._id},
        {
            $push:{
                courses:newCourse._id
            }
        },
        {new:true}
    );
    //return response
    return res.status(200).json({success:true,message:'Course created successfully',data:newCourse});


}
    catch(err){
        console.log(err);
        return res.status(500).json({success:false,message:'faild to create course',err:err.message});
    }

};

//get all courses
exports.getAllCourses=async(req,res)=>{
    try{
        //get all courses
        const allCourses=await Course.find({},{courseName:true,price:true,instructor:true,thumbnail:true,ratingAndReview:true,studentsEnrolled:true}).populate('instructor').exec();
        //return courses
        return res.status(200).json({success:true,message:'Courses fetched successfully',data:allCourses});
    }
    catch(err){
        console.log(err);
        return res.status(500).json({success:false,message:'Failed to fetch courses',err:err.message});
    }
};


//get coursedetails
exports.getCourseDetails=async(req,res)=>{
    try{
        //get courseId
        const {courseId}=req.body;
        //get course details
        const courseDetails=await Course.find({_id:courseId}).populate({path:'instructor',populate:{path:"additionalDetails"}}).populate('category').populate('ratingAndreviews').populate({path:'courseContent',populate:{path:'subSection'}}).exec();
        //validate course
        if(!courseDetails){
            return res.status(404).json({success:false,message:`Course not found with Id ${courseId}`});
        }
        //return course details
        return res.status(200).json({success:true,message:'Course details fetched successfully',data:courseDetails});
    }
    catch(err){
        console.log(err);
        return res.status(500).json({success:false,message:'Failed to fetch course details',err:err.message});
    }
};