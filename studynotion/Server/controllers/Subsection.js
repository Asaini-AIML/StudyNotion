const Section = require('../models/Section');
const SubSection = require('../models/Subsection');


//create subsection
exports.createSubsection = async (req, res) => {
    try{
        //data fetch
        const {sectionId, title,timeduration,description} = req.body;
        //extract file/video from req.body
        const video = req.files.videoFile;
        //validation
        if(!sectionId || !title || !video||!timeduration||!description){
            return res.status(400).json({ success: false, message: 'all field are required' });
        }
        //upload file/video to cloudinary
        const uploadDetails = await uploadToCloudinary(video,process.env.FOLDER_NAME);
        //create subsection
        const subsectionDetails = await SubSection.create({
            title: title,
            videoUrl: uploadDetails.secure_url,
            timeduration: timeduration,
            description: description
        });
        
        //update section with subsection id
        const updatedSection = await Section.findByIdAndUpdate({_id: sectionId}, {
            $push: {subsections: subsectionDetails._id}
        }, {new: true});
        //use populate to replace subsections in the updatedSection
        const section = await updatedSection.populate('subsections').execPopulate();
    
        // return response
        return res.status(201).json({ success: true, message: 'subsection created successfully', data: subsectionDetails });
    }

    
    catch(err){
        console.error(err);
        return res.status(500).json({ success: false, message: 'something went wrong while creating subsection', err: err });
    }
}
