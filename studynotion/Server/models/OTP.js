const mongoose = require('mongoose');
const mailSender = require('../utils/mailSender');

// Define the OTP schema
const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide your email'],
  },
  otp: {
    type: String,
    required: [true, 'Please provide your OTP'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 5 * 60, // Expire the document after 5 minutes (in seconds)
  },
});

// Function to send verification email
async function sendVerificationEmail(email, otp) {
  try {
    // Send the email
    const mailResponse = await mailSender(email, 'Verification Email from StudyNotion', otp);
    console.log('Mail sent successfully', mailResponse);
  } catch (err) {
    console.error('Error in sending mail:', err);
    throw err;
  }
}

// Pre-save hook to send the OTP email before saving the document
otpSchema.pre('save', async function (next) {
  // Use "this" to access the document fields
  if (this.isNew) { // Only send the email if it's a new document
    await sendVerificationEmail(this.email, this.otp);
  }
  next(); // Proceed with saving the document
});

module.exports = mongoose.model('OTP', otpSchema);
