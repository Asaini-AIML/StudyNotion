const Course=require('../models/Course');
const Tag=require('../models/Category');
const User=require('../models/User');
const {uploadImageToCloudinary}=require('../utils/imageUploader');
const Category = require("../models/Category")
const { convertSecondsToDuration } = require("../utils/secToDuration")
//create course
exports.createCourse = async (req, res) => {
    try {
      // Get user ID from request object
      const userId = req.user.id
  
      // Get all required fields from request body
      let {
        courseName,
        courseDescription,
        whatYouWillLearn,
        price,
        tag: _tag,
        category,
        status,
        instructions: _instructions,
      } = req.body
      // Get thumbnail image from request files
      const thumbnail = req.files.thumbnailImage
  
      // Convert the tag and instructions from stringified Array to Array
      // Don't parse 'tag' or 'instructions' unless they are JSON strings
let tag = _tag; // tag is already a simple string, no need for JSON.parse()
let instructions = []; // You can keep instructions as an array of strings

// If instructions is sent as a JSON string, you can parse it
try {
  instructions = JSON.parse(_instructions);
} catch (error) {
  // handle if _instructions is not a valid JSON string
  instructions = [_instructions];  // treat as a single instruction if it's not JSON
}

// Rest of your code...

  
      console.log("tag", tag)
      console.log("instructions", instructions)
  
      // Check if any of the required fields are missing
      if (
        !courseName ||
        !courseDescription ||
        !whatYouWillLearn ||
        !price ||
        !tag.length ||
        !thumbnail ||
        !category ||
        !instructions.length
      ) {
        return res.status(400).json({
          success: false,
          message: "All Fields are Mandatory",
        })
      }
      if (!status || status === undefined) {
        status = "Draft"
      }
      // Check if the user is an instructor
      const instructorDetails = await User.findById(userId, {
        accountType: "Instructor",
      })
  
      if (!instructorDetails) {
        return res.status(404).json({
          success: false,
          message: "Instructor Details Not Found",
        })
      }
  
      // Check if the tag given is valid
      const categoryDetails = await Category.findById(category)
      if (!categoryDetails) {
        return res.status(404).json({
          success: false,
          message: "Category Details Not Found",
        })
      }
      // Upload the Thumbnail to Cloudinary
      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      )
      console.log(thumbnailImage)
      // Create a new course with the given details
      const newCourse = await Course.create({
        courseName,
        courseDescription,
        instructor: instructorDetails._id,
        whatYouWillLearn: whatYouWillLearn,
        price,
        tag,
        category: categoryDetails._id,
        thumbnail: thumbnailImage.secure_url,
        status: status,
        instructions,
      })
  
      // Add the new course to the User Schema of the Instructor
      await User.findByIdAndUpdate(
        {
          _id: instructorDetails._id,
        },
        {
          $push: {
            courses: newCourse._id,
          },
        },
        { new: true }
      )
      // Add the new course to the Categories
      const categoryDetails2 = await Category.findByIdAndUpdate(
        { _id: category },
        {
          $push: {
            courses: newCourse._id,
          },
        },
        { new: true }
      )
      console.log("HEREEEEEEEE", categoryDetails2)
      // Return the new course and a success message
      res.status(200).json({
        success: true,
        data: newCourse,
        message: "Course Created Successfully",
      })
    } catch (error) {
      // Handle any errors that occur during the creation of the course
      console.error(error)
      res.status(500).json({
        success: false,
        message: "Failed to create course",
        error: error.message,
      })
    }
  }

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
exports.getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body
    const courseDetails = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
          select: "-videoUrl",
        },
      })
      .exec()

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      })
    }

    // if (courseDetails.status === "Draft") {
    //   return res.status(403).json({
    //     success: false,
    //     message: `Accessing a draft course is forbidden`,
    //   });
    // }

    let totalDurationInSeconds = 0
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}