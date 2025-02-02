const nodemailer = require('nodemailer');

const mailSender = async (email, title, body) => {
    try {
        // Set up the transporter with Gmail's SMTP settings
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: process.env.MAIL_USER,  // Your Gmail address
                pass: process.env.MAIL_PASS,  // Your Gmail App Password
            },
            logger: true, // Enable logging for debugging
            debug: true,  // Show debug output
        });

        // Send the email
        let info = await transporter.sendMail({
            from: `"StudyNotion" <${process.env.MAIL_USER}>`, // Sender address
            to: email, // Receiver address
            subject: title, // Subject line
            text: body, // Plain text body
            html: `<p>${body}</p>`, // HTML body
        });

        console.log('Mail sent successfully:', info);
        return info;
    } catch (err) {
        console.log('Error sending email:', err.message);
        throw err;
    }
};

module.exports = mailSender;
