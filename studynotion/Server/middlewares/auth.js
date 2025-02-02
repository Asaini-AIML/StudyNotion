const jwt= require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User');

//auth middleware
exports.auth = async (req, res, next) => {
    try {
        //get token from header
       const token = req.cookies.token||req.body.token||req.headers('Authorization').replace('Bearer ','');
        //check if not token
        if (!token) {
            return res.status(401).json({ success: false, message: 'No token, authorization denied' });
        }
        //verify token
      try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        req.user=decoded;
      }
        catch(err){ 
            console.error(err);
            return res.status(401).json({ success: false, message: 'Invalid token' });
        }
        next();
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'something went wrong while validating token' });
    }
}

//isStudent middleware
exports.isStudent = async (req, res, next) => {
    try {
        if (req.user.accountType !== 'Student') {
            return res.status(403).json({ success: false, message: 'You are not authorized to access this route. this route is protected for student only' });
        }
        next();

    }
        catch(err){
            console.error(err);
            return res.status(500).json({ success: false, message: 'user can not be varyfying' });

        }
    }
//isInstructor middleware
exports.isInstructor = async (req, res, next) => {
    try {
        if (req.user.accountType !== 'Instructor') {
            return res.status(403).json({ success: false, message: 'You are not authorized to access this route. this route is protected for instructor only' });
        }
        next();
    }
    catch(err){
        console.error(err);
        return res.status(500).json({ success: false, message: 'user can not be varyfying' });

    }
}

//isAdmin middleware
exports.isAdmin = async (req, res, next) => {
    try {
        if (req.user.accountType !== 'Admin') {
            return res.status(403).json({ success: false, message: 'You are not authorized to access this route. this route is protected for admin only' });
        }
        next();
    }
    catch(err){
        console.error(err);
        return res.status(500).json({ success: false, message: 'user can not be varyfying' });

    }
}