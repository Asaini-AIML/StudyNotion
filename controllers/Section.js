const Section = require('../models/Section');
const Course = require('../models/Course');
const User = require('../models/User');

exports.createSection = async (req, res) => {
    try{
        //data fetch
        const {sectionName, courseId} = req.body;

          
        //data validation
        if(!sectionName || !courseId){
            return res.status(400).json({ success: false, message: 'sectionName and courseId are required' });
        }
        //create section
        const newSection = await Section.create({sectionName});

        //update course with section onj id
         const updatedCourse = await Course.findByIdAndUpdate(courseId, {
            $push: {courseContant: newSection._id}
        }, {new: true});
        //use populate to replace section/sub-sectons both in the updatedCourse
        const course = await updatedCourse.populate('courseContent').execPopulate();
        
        // return response 
        return res.status(201).json({ success: true, message: 'section created successfully', data: newSection });
    }
    catch(err){
        console.error(err);
        return res.status(500).json({ success: false, message: 'something went wrong while creating section' });
    }
}


exports.updateSecction = async (req, res) => {
    try{
        //data input
        const {sectionName, sectionId} = req.body;

        //data validation
        if(!sectionName || !sectionId){
            return res.status(400).json({ success: false, message: 'sectionName and sectionId are required' });
        }
        //update data
        const section = await Section.findByIdAndUpdate(sectionId, {sectionName}, {new: true});

        //return response
        return res.status(200).json({ success: true, message: 'section updated successfully', data: section });


    }
    catch(err){
        console.error(err);
        return res.status(500).json({ success: false, message: 'something went wrong while updating section' });
    }
}


exports.deleteSection = async (req, res) => {
    try{
       // get Id
         const {sectionId} = req.body;

       //use findByIdandDelete
       await Section.findByIdAndDelete(sectionId);
       
       // return response
         return res.status(200).json({ success: true, message: 'section deleted successfully' });

    }
    catch(err){
        console.error(err);
        return res.status(500).json({ success: false, message: 'something went wrong while deleting section' });
    }
}
