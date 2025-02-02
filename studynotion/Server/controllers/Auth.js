const User = require('../models/User');
const OTP=require('../models/OTP');
const otpGenerator = require('otp-generator');
const bcrypt = require('bcrypt');
const Profile = require('../models/Profile');
const jwt = require('jsonwebtoken');
const { payload } = require('googleapis/build/src/apis/drive');
require('dotenv').config();

//send otp
exports.sendOTP = async (req, res) => {
   try{
     //fetch email from req ki body
     const { email } = req.body;
     //check if user already exists
     const checkUserPresent = await User.findOne({ email });
     if (checkUserPresent) {
         return res.status(401).json({ success:false, message: 'User already exists', });
     }
     //generate otp
        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
        console.log(otp);
        //check if otp already exists
        const result = await OTP.findOne({otp:otp}) ;
        while(result){
            otp = otpGenerator(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
            const result = await OTP.findOne({otp:otp}) ;
        }
        const otpPayload = {   email, otp, };
        //save otp in db
        const otpBody= await OTP.create(otpPayload);
        console.log(otpBody);
        //return response
        res.status(200).json({ success:true, message: 'OTP sent successfully', otp:otp, });

   }

   
        catch (err) {
            console.error('Error sending email:', err);
        }
        
    
};

//signUp
exports.signUp = async (req, res) => {
    try {
        // Destructure data from request body
        const { firstName, lastName, email, password, confirmPassword, accountType, contactNumber, otp } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !email || !password || !confirmPassword  || !otp || !accountType) {
            return res.status(403).json({ success: false, message: 'Please fill all fields' });
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(403).json({ success: false, message: 'Passwords do not match' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(401).json({ success: false, message: 'User already exists' });
        }

        // Find most recent OTP
        const recentOtp = await OTP.findOne({ email }).sort({ createdAt: -1 }).limit(1);
        console.log(recentOtp);

        // Validate OTP
        if (!recentOtp) {
            return res.status(400).json({ success: false, message: 'Please enter OTP' });
        }

        if (recentOtp.otp !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create profile with default or null values where necessary
        const profileDetails = await Profile.create({ 
            gender: null, 
            dateOfBirth: null, 
            about: null, 
            contactNumber: null 
        });

        // Create user in the database
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            accountType,
            contactNumber,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}${lastName}`,
        });

        // Return success response
        return res.status(200).json({ success: true, message: 'User created successfully', user });
    } catch (err) {
        console.error(err);  // Log the error for better debugging
        return res.status(500).json({ success: false, message: `Fail to signup: ${err.message}` });
    }
};


//login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate request data
        if (!email || !password) {
            return res.status(403).json({ success: false, message: 'Please fill all fields' });
        }

        // Check if the user exists
        const user = await User.findOne({ email }).populate('additionalDetails');
        if (!user) {
            return res.status(401).json({ success: false, message: 'User not registered, please sign up first' });
        }

        // Check password validity
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Wrong Password' });
        }

        // Generate JWT token
        const payload = { email: user.email, id: user._id, accountType: user.accountType };

        // Log SECRET_KEY value for debugging
        console.log('SECRET_KEY:', process.env.SECRET_KEY);

        // Check if SECRET_KEY is loaded correctly
        if (!process.env.SECRET_KEY) {
            return res.status(500).json({ success: false, message: 'Missing SECRET_KEY in environment variables' });
        }

        const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '2h' });

        // Attach token to user object and remove password field before sending response
        user.token = token;
        user.password = undefined;

        // Set cookie with JWT token and send response
        const option = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        };

        res.cookie('token', token, option).status(200).json({ success: true, message: 'User logged in successfully', user, token });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: `Error: ${err.message}` });
    }
};


//change password
exports.changePassword = async (req, res) => {
    try {
        //data from req ki body
        const { email, oldPassword, newPassword, confirmPassword } = req.body;
        //validate
        if(!email || !oldPassword || !newPassword || !confirmPassword){
            return res.status(403).json({ success:false, message: 'Please fill all fields', });
        }
        //check if user exists
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({ success:false, message: 'User not found', });
        }
        //check old password
        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if(!isPasswordValid){
            return res.status(401).json({ success:false, message: 'Invalid credentials', });
        }
        //2 passwords match
        if(newPassword !== confirmPassword){
            return res.status(403).json({ success:false, message: 'Passwords do not match', });
        }
        //hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        //update password
        await User.updateOne({email}, {password: hashedPassword});
        //return response
        return res.status(200).json({ success:true, message: 'Password changed successfully', });

    }
    catch(err){
        console.error(err);
        return res.status(500).json({ success:false, message: err.message, });
    }
};

