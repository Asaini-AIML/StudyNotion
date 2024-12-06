const { instance } = require('../config');
const Course = require('../models/Course');
const User = require('../models/User');
const mailSender = require('../utils/mailSender');
const { courseEnrollmentEmail } = require('../mail/template/courseEnrollmentEmail');
const { default: mongoose } = require('mongoose');
const crypto = require('crypto');

//capture the payment and initiate the course enrollment
exports.capturePayment = async (req, res) => {

    //get userId and courseId from req.body
    const { courseId } = req.body;
    const userId = req.user.id;
    //validation
    //valid courseId
    if (!courseId) {
        return res.status(400).json({ success: false, message: 'courseId is required' });
    }
    //valid courseDetails
    let course
    try {
        course = await Course.findById(courseId);
        if (!course) {
            return res.status(400).json({ success: false, message: 'course not found' });
        }
        //user already pay for the same course
        const uid = new mongoose.Types.ObjectId(userId);
        if (!course.studentsEnrolled.includes(uid)) {
            return res.status(400).json({ success: false, message: 'user already enrolled in this course' });
        }
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'something went wrong while fetching course' });
    }
    //order creation
    const amount = course.price;
    const currency = 'INR';
    const options = {
        amount: amount * 100,
        currency,
        receipt: `receipt_${userId}_${courseId}`,
        notes: {
            userId,
            courseId
        },

    };
    try {
        //intiate payment
        const paymentResponse = await instance.orders.create(options);
        console.log(paymentResponse);
        //return response
        return res.status(200).json({
            success: true,
            courseName: course.courseName,
            courseDescription: course.courseDescription,
            thumbnail: course.thumbnail,
            orderId: paymentResponse.id,
            currency: paymentResponse.currency,
            amount: paymentResponse.amount,

        });

    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'something went wrong while creating order' });
    }
};

//verify signature of razorpay and server
exports.verifySignature = async (req, res) => {
    const webhookSecret = "12345678";
    const signature = req.headers['x-razorpay-signature'];
    const shasum = crypto.createHmac('sha256', webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');
    if (digest === signature) {
        console.log('Payment is authorized');
        const { courseId, userId } = req.body.payload.payment.entity.notes;
        try {
            //fullfill the action

            //find the course and enrolll the student in it 
            const enrolledCourse = await Course.findOneAndUpdate(
                { _id: courseId },
                { $push: { studentsEnrolled: userId } },
                { new: true }
            );
            if (!enrolledCourse) {
                return res.status(400).json({ success: false, message: 'course not found' });
            }
            //find the student andedd the course to thier listt enrolled courses me  
            const enrolledStudents = await User.findOneAndUpdate(
                { _id: userId },
                { $push: { enrolledCourses: courseId } },
                { new: true }
            );
            console.log(enrolledStudents);
            // mail sender
            const emailResponse = await mailSender(
                enrolledStudents.email,
                'congratulations! you have successfully enrolled in the course',
            );
            console.log(emailResponse);
            //return response
            return res.status(200).json({ success: true, message: 'payment successfull and student enrolled in the course' });

        }

        catch (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'something went wrong while enrolling student' });
        }



    }
    else {
        console.log('Payment is not authorized');
        return res.status(400).json({ success: false, message: 'payment not authorized' });
    }
}
