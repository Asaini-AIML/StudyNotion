const mongoose = require('mongoose');
require('dotenv').config();

exports.connect = () => {
  // Connecting to the database
  mongoose.connect(process.env.MONGODB_URL,)
    .then(() => {
        console.log('Successfully connected to MongoDB');
    }).catch((err) => {
        console.log('Could not connect to MongoDB');
       console.log(err);
       process.exit(1);
    });
};