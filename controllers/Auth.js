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

   
    catch(err){
        console.error(err);
     return res.status(500).json({ success:false, message: err.message, });
    }
};

//signUp
exports.signUp = async (req, res) => {
    try {
        //data from req ki body
        const { firstName,lastName,email, password,confirmPassword,accountType,contactNumber,otp } = req.body;
        //validate 
        if(!firstName || !lastName || !email || !password || !confirmPassword  || !contactNumber || !otp){
            return res.status(403).json({ success:false, message: 'Please fill all fields', });
        }
        //2 passwords match
        if(password !== confirmPassword){
            return res.status(403).json({ success:false, message: 'Passwords do not match', });
        }
        //check if user already exists
        const exitingUser = await User.findOne({email});
        if(exitingUser){
            return res.status(401).json({ success:false, message: 'User already exists', });
        }
     //find most recent otp
     const recentOtp = await OTP.findOne({email}).sort({createdAt:-1}).limit(1);
        console.log(recentOtp);
      //validate otp
      if(recentOtp.length === 0){
            return res.status(400).json({ success:false, message: 'Please enter OTP', });
        }

       else if(recentOtp.otp !== otp){
            return res.status(400).json({ success:false, message: 'Invalid OTP', });
        }
        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        //create user in db
        const profileDetails = await Profile.create({gender:null,dateOfBirth:null,about:null,contactNumber:null});
        const user = await User.create({firstName,lastName,email,password:hashedPassword,accountType,contactNumber,additionalDetails:profileDetails._id,image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName}${lastName}`,});
        //return response
        return res.status(200).json({ success:true, message: 'User created successfully',user });


    }
    catch(err){
        console.error(err);
        return res.status(500).json({ success:false, message: err.message, });
    }
};

//login
exports.login = async (req, res) => {
    try {
        //data from req ki body
        const { email, password } = req.body;
        //validate
        if(!email || !password){
            return res.status(403).json({ success:false, message: 'Please fill all fields', });
        }
        //check if user exists
        const user = await User.findOne({email}).populate('additionalDetails');
        if(!user){
            return res.status(401).json({ success:false, message: 'user not register please signUp first', });
        }
        //check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(401).json({ success:false, message: 'Invalid credentials', });
        }
        //generate token
        if(await bcrypt.compare(password, user.password)){
            const payload = { email: user.email, id: user._id, accountType: user.accountType };
            const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '2h' });
            user.token = token;
            user.password = undefined;

        
        //create cookie
        const option = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        };
        res.cookie('token', token, option).status(200).json({ success:true, message: 'User logged in successfully', user,token });
    }
        else{
            return res.status(401).json({ success:false, message: 'password incorrect', });
        }

    }
    catch(err){
        console.error(err);
        return res.status(500).json({ success:false, message: err.message, });
    }
}

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

