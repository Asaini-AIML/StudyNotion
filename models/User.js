const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Please provide your first name'],
        trim:true
    },
    lastName: {
        type: String,
        required: [true, 'Please provide your last name'],
        trim:true
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        trim:true
    },
    password: {
        type: String,
        required: [true, 'Please provide your password']
        
    },
    accountType: {
        type: String,
        enum: ['admin', 'user','instructor'],
        required: [true, 'Please provide your account type']
    },
    additionalDetails: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Please provide your additional details'],
        ref:'Profile'
    },
    courses:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        }
    ],
    image: {
        type: String,
        required: [true, 'Please provide your image']
    },
    courseProgress:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'CourseProgress'
        }
    ]

});

module.exports = mongoose.model('User', userSchema);