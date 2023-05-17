const User = require('../models/User');
const bcrptJs = require('bcryptjs');
const fs = require('fs');
const ejs = require('ejs');
const crypto = require('crypto');
const emailLink = fs.readFileSync('./EmailFiles/verificationEmail/email.ejs','utf-8');
const deleteAccountNotification = fs.readFileSync('./EmailFiles/verificationEmail/deleteNotification.ejs','utf-8');
const { transporter } = require('../config/nodemailer');

const sendVerificationEmail = async (user, req) => {
    try 
    {        
        const token = crypto.randomBytes(20).toString('hex');
        const expirationTime =  Date.now() + 10 * 60 * 1000; // 10 min
        user.verificationToken = token;
        user.verificationExpires = expirationTime;

        await user.save();
        const verificationLink = `${req.protocol}://${req.get('host')}/user/verify/${token}`;
        const renderedTemplate = ejs.render(emailLink,{user , verificationLink ,expirationTime });
        const mailOptions = {
            from: process.env.FROM_SEND_EMAIL,
            to: user.email,
            subject: 'Verify your email address',
            html :renderedTemplate,
        };
        req.flash('success' ,'A Verification link Send to User`s Email');
        await transporter.sendMail(mailOptions);
    } catch (err) {
        console.error(err);
    }
};



module.exports.getRegisterPage = (req ,res) => {
    if(req.isAuthenticated()){
        req.flash('error' , 'User Already Register');
        return res.redirect('/');
    }
    return res.render('register' ,{
        title: 'Register Page'
    });
};

module.exports.getLoginPage = (req ,res) => {
    if(req.isAuthenticated()){
        req.flash('error' , 'User Already Logged In');
        return res.redirect('/');
    }
    return res.render('login' ,{
        title: 'Login Page'
    });
};


module.exports.register = async (req ,res) => {
    try {
        const {name , password , email ,confirmPassword } = req.body;
        if(password !== confirmPassword){
            req.flash('error' ,'Password And Confirm Password Should Be Match!');
            return res.redirect('back');
        }
        const emailRegex = /^([a-zA-z0-9._-]+)@(gmail|yahoo|hotmail|zohomail|hcl|live|outlook)\.(com)$/;
        if(emailRegex.test(email)){
            const lowerCaseEmail = email.toLowerCase();
            const existingUser = await User.findOne({ email: lowerCaseEmail });
            if (existingUser) {
                req.flash('error' ,'User Already Exists With This Email')
                return res.redirect('/user/register');
            }
            else {
                const hashedPassword = await bcrptJs.hash(password,10);
                const newUser = new User({
                    name,
                    email: lowerCaseEmail,
                    password: hashedPassword,
                });
                const savedUser = await newUser.save();
                await sendVerificationEmail(savedUser, req);
                req.flash('success' ,'Account Created Successfully');
                return res.redirect('/user/login');
            }

        }else{
            req.flash('error' ,'Email Not Supported From Your Domain');
            return res.redirect('/user/register');
        }
    } catch (err) {
        req.flash('error', `Error in ${err.message}`);
        return res.redirect('/user/register');
    }
};

module.exports.login = async (req , res) => {
    req.flash('success' ,'Login Successfull');
    return res.redirect('/');
};



module.exports.verifyEmail = async (req , res) => {
    try 
    {
        const user = await User.findOne({
            verificationToken: req.params.token,
            verificationExpires: { $gt: Date.now() },
        });

        if (!user) {
            req.flash('error' ,'Invalid Or Expired Link please login or register again');
            return res.redirect('/user/register');
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationExpires = undefined;
        await user.save();
        req.flash('success' ,'Email Verified Successfully Please login');
        return res.redirect('/user/login');

    } catch (err) {
        req.flash('error' ,`Error In Email Verification: ${err.message}`);
        return console.error(err);
    }
}

module.exports.logout = async (req ,res) => {
   try
   {
    req.logout((err) => {
        if (err) {
            req.flash('error' ,"Can Not Logout")
            return res.redirect('back');
        }
        req.flash('success' , 'Logged Out Successfully');
        return res.redirect('/');
    });
   }catch(error){
    req.flash('error' ,`Error In User Logout : ${err.message}`);
    return console.error(err);
   }
};

module.exports.deleteAccount = async (req ,res) => {

    const DeletedUser = req.user;
    const weblink = `${req.protocol}://${req.get('host')}`;

    await User.findByIdAndDelete(DeletedUser._id)
    .then( async () => {
        const renderedTemplate = ejs.render(deleteAccountNotification,{DeletedUser , weblink});
        const mailOptions = {
            from: process.env.FROM_SEND_EMAIL,
            to: DeletedUser.email,
            subject: 'Account Deleted Successfully',
            html :renderedTemplate,
        };
        await transporter.sendMail(mailOptions);
        req.flash('success' ,'User Accound Deleted Successfully');
        return res.redirect('/user/login');
    })
    .catch((err) =>{
        req.flash('error' ,`Error in Accound Deleted ${err.message}`);
        console.log('Error delete' , `${err.message}`);
    });
};