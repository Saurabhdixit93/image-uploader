const User =            require('../models/User');
const { transporter } = require('../config/nodemailer');
const ejs =             require('ejs');
const fs =              require('fs');
const ProfileUpdate =   fs.readFileSync('./EmailFiles/verificationEmail/profileUpdate.ejs','utf-8');
const bcrptJs =         require('bcryptjs');


module.exports.userProfile = async (req, res) => {
    const  userID  = req.params.id;
    try{
        const user = await User.findById(userID);
        if(!user){
            req.flash('error', `User Not Found`);
            return res.redirect('back');
        }
        return res.render('ProfileShow' ,{
            title: `User Details Page | ${user.name}`,
            user,
        });
    }catch(error){
        req.flash('error', `Error in ${error.message}`);
        return res.redirect('back');
    }
};


module.exports.getProfilePage = (req ,res) => {
    return res.render('profileUpdate' ,{
        title:`Profile Page | ${req.user.name}`
    });
};

module.exports.UpdateProfile = async (req , res) => {
   try{

    const { email , name , password , confirmPassword } = req.body;
    if(password !== confirmPassword){
        req.flash('error' ,'Password And Confirm Password Should Be Match!');
        return res.redirect('back');
    };
    const emailRegex = /^([a-zA-z0-9._-]+)@(gmail|yahoo|hotmail|zohomail|hcl|live|outlook)\.(com)$/;
    if(emailRegex.test(email)){

        const lowerCaseEmail = email.toLowerCase();
        const existingPassword = await User.findOne({ password: password});
        const existingEmail = await User.findOne({ email: lowerCaseEmail});

        if (existingEmail) {
            req.flash('error' ,'This Email is Already, Please try with new one.');
            return res.redirect('back');
        };
        if (existingPassword) {
            req.flash('error' ,'This Password is Already, Please try with new one.');
            return res.redirect('back');
        }else{
            const hashedPassword = await bcrptJs.hash(password,10);
            const newUser = new User({
                name,
                email: lowerCaseEmail,
                password: hashedPassword,
                isVerified:true,
                verificationExpires: undefined,
                verificationToken: undefined,
            });
            const savedUser = await newUser.save();
            await sendUpdateProfileMail(savedUser,req);
            req.flash('success' ,'Profile Updated Successfully.');
            return res.redirect('back');
        };
    }else{
        req.flash('error' ,'Email Not Supported From Your Domain.');
        return res.redirect('back');
    }
   }catch(error){
        req.flash('error', `Error in ${error.message}`);
        return res.redirect('back');
   };
};

const sendUpdateProfileMail = async (user,req) => {
    try 
    {   
        const renderedTemplate = ejs.render(ProfileUpdate,{user});
        const mailOptions = {
            from: process.env.FROM_SEND_EMAIL,
            to: user.email,
            subject: 'Profile Updated Successfully',
            html :renderedTemplate,
        };
        req.flash('success' ,'Profile Updated Succesfull.');
        await transporter.sendMail(mailOptions);
    } catch (err) {
        console.error(err);
    };
};
