const mongoose = require('mongoose');
const User = require('./User');
const ratingAndReview = new mongoose.Schema({
  User:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide your user'],
  },
    rating:{
        type: Number,
        required: [true, 'Please provide your rating'],
    },
    review:{
        type: String,
        required: [true, 'Please provide your review'],
    },
});

module.exports = mongoose.model('RatingAndReview', ratingAndReview);