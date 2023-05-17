const User = require('../models/User');
const PasswordReset = require('../models/PasswordReset');
const bcrptJs = require('bcryptjs');
const crypto = require('crypto');
const { transporter } = require('../config/nodemailer');
const ejs = require('ejs');
const fs = require('fs');
const forgotPasswordEmail = fs.readFileSync('./EmailFiles/verificationEmail/forgotPassword.ejs','utf-8');

module.exports.getForgotPasswordForm = async (req ,res) => {
    return res.render('forgot-password' ,{
        title: 'Forgot Password Page',
    });
};

module.exports.sendForgotPasswordLink = async (req ,res) => {
    try
    {
        const { email } = req.body;

        const emailRegex = /^([a-zA-z0-9._-]+)@(gmail|yahoo|hotmail|zohomail|hcl|live|outlook)\.(com)$/;
        if(emailRegex.test(email)){
            const lowerCaseEmail = email.toLowerCase();
            const accountFound = await User.findOne({email:lowerCaseEmail});

            if(!accountFound){
                req.flash('error' ,'User Email Is not Found to reset Password');
                return res.redirect('back');
            }
            const token = crypto.randomBytes(64).toString('hex'); 
            const secret = process.env.SECRET_KEY;
            const hashedToken = crypto.createHmac('sha256' , secret).update(token).digest('hex');

            const password_Reset = await new PasswordReset({
                userId: accountFound,
                token: hashedToken,
                isValid: true
            });

            await password_Reset.save();

            // email template setup 
            const resetLink = `${req.protocol}://${req.get('host')}/auth/verify-link/${hashedToken}`;
            const renderedTemplate = ejs.render(forgotPasswordEmail,{ resetLink , accountFound });
            const mailOptions = {
                from: process.env.FROM_SEND_EMAIL ,
                to: accountFound.email,
                subject: `Password Reset Request`,
                html: renderedTemplate,
            };

            transporter.sendMail(mailOptions, (err) => {
                if (err) {
                req.flash('error', `There was an error sending the password reset email. Please try again later.`);
                return res.redirect('back');
                } else {
                req.flash('success' ,'A password reset link has been sent to your email address.');
                return res.redirect('back');
                }
            });
        }else{
            req.flash('error' ,'Email Not Register With Us');
            return res.redirect('/user/register');
        }
    }catch(error){
        req.flash('error' ,`Error In: ${error.message}`);
        return;
    }
};


module.exports.handlePasswordLink = async (req ,res) => {
    try
    {
        const { token } = req.params;
        const password_Reset = await PasswordReset.findOne({token});
        if(!password_Reset){
            req.flash('error','Invalid password reset link. Please request a new link.');
            return res.redirect('/user/login');
        }
        req.flash('success' ,'link Verified , Update Your Password Now');
        return res.render('resetPassword', {
            title:'Forgot Password Final Page',
            token:password_Reset.token
          });
      
    }catch(error){
        req.flash('error' ,`Error In: ${error.message}`);
        return;
    }
};

module.exports.resetPassword = async (req, res) => {
    const token = req.query.youruniqtoken;
    try{
        const passwordReset = await PasswordReset.findOne({token: token});
        if (!passwordReset) {
            req.flash('error' ,'Password reset Link Expired. Please request a new link.');
            return res.redirect('back');
        }
        if(passwordReset.isValid){
            passwordReset.isValid = false;
            if(req.body.password === req.body.confirmPassword){
                const user = await User.findById(passwordReset.userId);
                if(user){
                    const hashedPassword = await bcrptJs.hash(req.body.password,10);
                    user.password = hashedPassword;
                    user.confirmPassword = req.body.confirmPassword;
                    user.isVerified = true;
                    user.verificationToken = undefined;
                    user.verificationExpires = undefined;
                    await passwordReset.save();
                    await user.save();
                    req.flash('success' , 'Your password has been reset. Please log in with your new password.');
                    return res.redirect('/user/login');
                }else{
                    request.flash('error' , 'User Not Valid');
                    return response.redirect('back');

                }
            }else{
                req.flash('error' ,'Password and Confirm Passwrod Not Matched.');
                return res.redirect('/auth/forgot-password');
            }
        }else{
            req.flash('error' ,'Invalid password reset Token. Please request a new Token.');
            return res.redirect('/auth/forgot-password');
        }
    }catch(error){
        req.flash('error' ,`Error In: ${error.message}`);
        return;
    }
};