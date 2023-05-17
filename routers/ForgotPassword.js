const express = require('express');
const router =  express.Router();
const forgotPasswordController = require('../controllers/ForgotPassword');

router.get('/forgot-password',      forgotPasswordController.getForgotPasswordForm);
router.post('/forgot-password/',    forgotPasswordController.sendForgotPasswordLink);
router.get('/verify-link/:token',   forgotPasswordController.handlePasswordLink);
router.post('/reset-password/',     forgotPasswordController.resetPassword);

module.exports = router;
