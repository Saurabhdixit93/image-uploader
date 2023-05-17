const express =  require('express');
const router =   express.Router();
const passport = require('passport');
const ProfileUpdateController = require('../controllers/ProfileController');

router.get('/get-profile',        passport.checkAuthentication , ProfileUpdateController.getProfilePage);
router.post('/update-profile',    passport.checkAuthentication , ProfileUpdateController.UpdateProfile);
router.get('/show-profile/:id',   passport.checkAuthentication , ProfileUpdateController.userProfile);


module.exports = router;
