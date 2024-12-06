const Profile = require('../models/Profile');
const User = require('../models/User');

exports.updateProfile = async (req, res) => {
    try{
        //data fetch
        const {dateOfBirth="",about="",contactNumber,gender} = req.body;
        //get user id from req.user
        const id = req.user.id;
        //validation
        if(!contactNumber||!gender||!id){
            return res.status(400).json({ success: false, message: 'all field are required' });
        }
        //find profile
        const userDetails= await User.findById(id);
        const profileId=userDetails.additionalDetails;
        const profile=await Profile.findById(profileId);
        //update profile
        profileDetails.dateOfBirth=dateOfBirth;
        profileDetails.about=about;
        profileDetails.contactNumber=contactNumber;
        profileDetails.gender=gender;
        await profileDetails.save();

        //return response
        return res.status(200).json({ success: true, message: 'profile updated successfully', data: profileDetails });

    }
    catch(err){
        console.error(err);
        return res.status(500).json({ success: false, message: 'something went wrong while updating profile' });
    }
};


exports.deleteProfile = async (req, res) => {
    try{
        // get Id
        const id = req.user.id;
        //validation
        const userDetails= await User.findById(id);
        if(!userDetails){
            return res.status(400).json({ success: false, message: 'user not found' });
        }
       
        
        
        //delete profile
        await Profile.findByIdAndDelete({_id: userDetails.additionalDetails});
        //unenroll user from enrolled courses
        await Course.updateMany({enrolledStudents: id}, {$pull: {enrolledStudents: id}});
        //delete user
        await User.findByIdAndDelete({_id: id});
        //return response
        return res.status(200).json({ success: true, message: 'profile deleted successfully' });
    }
    catch(err){
        console.error(err);
        return res.status(500).json({ success: false, message: 'something went wrong while deleting profile' });
    }
};

exports.getAllUserDetails= async (req, res) => {
    try{
        //get id
        const id = req.user.id;
        //validation and get user details
        const userDetails= await User.findById(id).populate('additionalDetails').exec();
        //return response
        return res.status(200).json({ success: true, message: 'user details'});

        //fetch user details

    }
    catch(err){
        console.error(err);
        return res.status(500).json({ success: false, message:err.message });
    }
}