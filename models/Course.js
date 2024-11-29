const mongoose = require('mongoose');
const courseSchema = new mongoose.Schema({
    courseName: {
        type: String,
       
    },
    courseDescription: {
        type: String,
        required: [true, 'Please provide your course description'],
    },
    instructor:{
        type :mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: [true, 'Please provide your instructor'],
    },
   whatYouWillLearn: {
        type: String,
        required: [true, 'Please provide what you will learn'],
    },
    courseContant:[ {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Section',
        required: [true, 'Please provide your course content'],
    }],
    ratingAndReview:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'RatingAndReview'
        }
    ],
    price:{
        type: Number,
        required: [true, 'Please provide your price'],
    },
    thumbnail: {
        type: String,
        required: [true, 'Please provide your thumbnail'],
    },
    tag:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Tag',
    },
    studentsEnrolled:[
        {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'Please provide your enrolled students'],
            ref: 'User'
        }
    ],
    
    
});

module.exports = mongoose.model('Course', courseSchema);