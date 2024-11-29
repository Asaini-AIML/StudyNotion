const mongoose = require('mongoose');
const tagsSchema = new mongoose.Schema({
  name:{
    type : String,
    required: [true, 'Please provide your tag name'],
  },
  description : {
    type: String,
    required: [true, 'Please provide your tag description'],
  },
    course:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: [true, 'Please provide your course'],
        }
    

});

module.exports = mongoose.model('Tag', tagsSchema);