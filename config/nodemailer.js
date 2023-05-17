const nodemailer = require('nodemailer');

module.exports.transporter = nodemailer.createTransport({
    host: process.env.NODEMAILER_HOST,
    port: process.env.MAIL_PORT, 
    auth: {
      user:process.env.NODEMAILER_USERNAME,
      pass:process.env.NODEMAILER_PASSWORD
    },
    secure: true,
});
// for testing mod

// module.exports.transporter = nodemailer.createTransport({
//     host: 'smtp.ethereal.email',
//     port: 587,
//     auth: {
//         user: 'brisa.tremblay@ethereal.email',
//         pass: 'uRyN4EDSBbHEw6dCGX'
//     }
// });

