const Tag = require('../models/Tags');
//create tak ka handler function
exports.createTag = async (req, res) => {
    try {
        //fetch data
        const { name, description } = req.body;
        //validation
        if (!name || !description) {
            return res.json({ success: false, message: 'Please provide all details' });
        }
        //create entery in db
        const tagDetails = await Tag.create({ name:name, description:description });
        console.log(tagDetails);
        //return success message
        return res.json({ success: true, message: 'Tag created successfully' });
      
    }
    catch (err) {
        return res.json({ success: false, message: 'something went wrong' });
    }
};

//get all tags
exports.getAllTags = async (req, res) => {
    try {
        //get all tags
        const allTags = await Tag.find({},{name:true,description:true});
        //return tags
        return res.json({ success: true,message:'All tags',  allTags });
    }
    catch (err) {
        return res.json({ success: false, message: 'something went wrong' });
    }
};