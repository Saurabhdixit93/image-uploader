const ContactModel = require('../models/Contact');
const { transporter } = require('../config/nodemailer');
const ejs = require('ejs');
const fs = require('fs');
const ContactSuccessEmail = fs.readFileSync('./EmailFiles/verificationEmail/ContactSubmit.ejs','utf-8');


module.exports.getContactForm = (req ,res) => {
    return res.render('contactus',{
        title: 'Contact Us Page'
    });
};

module.exports.sendContactForm = async (req ,res) => {
  try{

    const { username , subject , email ,message } = req.body;
    const emailRegex = /^([a-zA-z0-9._-]+)@(gmail|yahoo|hotmail|zohomail|hcl|live|outlook)\.(com)$/;
    if(emailRegex.test(email)){
        const lowerCaseEmail = email.toLowerCase();
        const saveForm = await new ContactModel({
            username,
            subject,
            email: lowerCaseEmail,
            message,
        });
        await saveForm.save();
        const renderedTemplate = ejs.render(ContactSuccessEmail,{saveForm});
        const mailOptions = {
            from: process.env.FROM_SEND_EMAIL ,
            to: `${saveForm.email},${process.env.FROM_SEND_EMAIL}`,
            subject: `Contact Details Submitted`,
            html: renderedTemplate,
        };
        transporter.sendMail(mailOptions);
        req.flash('success' ,'Contact Details Submitted Successfully.');
        return res.redirect('/');
    }else{
        req.flash('error' ,'Email Not Supported From Your Domain.');
        return res.redirect('back');
    }

  }catch(error){
    req.flash('error', `Error in ${err.message}`);
    return res.redirect('back');
  }
};