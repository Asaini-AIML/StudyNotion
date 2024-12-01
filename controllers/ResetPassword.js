const User = require('../models/User');
const mailSender = require('../utils/mailSender');
const bcrypt = require('bcrypt');
//reset password token
exports.resetPasswordToken = async (req, res) => {
  try{
      // getemail from req.body
      const  email  = req.body;
      //check if user exists
      const user=await User.findOne({email});
      if(!user){
          return res.json({success:false,message:'your email is not registered'});
      }
      //generate token
      const token = crypto.randomUUID();
      //update user by adding token and expiry time
      const updatedDetails=await User.findByIdAndUpdate({email:email},{token,resetPasswordExpires:Date.now()+3000000},{new:true});
      //create url
      const url=`http://localhost:3000/update-password/${token}`;
      //send email
      await mailSender({
          email:email,
          subject:'Password reset token',
          message:`Password reset ${url}`
      });
      //return success message
      return res.json({success:true,message:'mail sent successfully'}); 
  
  }
    catch(err){
        return res.json({success:false,message:'something went wrong'});
    }
};

//reset password
exports.resetPassword = async (req, res) => {
  try{
      //get token and password from req.body
      const {token,password,confirmPassword} = req.body;
     //validation
     if(password!==confirmPassword){
         return res.json({success:false,message:'passwords do not match'});
        }
    //get userdetails from db using token
        const userDetails=await User.findOne({token:token});
        //if no entry -invalid token
        if(!userDetails){
            return res.json({success:false,message:'invalid token'});
        }
        //token time check
        if(userDetails.resetPasswordExpires<Date.now()){
            return res.json({success:false,message:'token expired'});
      
        }
        //hash password
        const hashedPassword = await bcrypt.hash(password,10);
        //update password
        await User.findByIdAndUpdate({token:token},{password:hashedPassword},{new:true});

      //return success message
      return res.json({success:true,message:'password updated successfully'}); 
  
  }
    catch(err){
        return res.json({success:false,message:'something went wrong'});
    }
};
