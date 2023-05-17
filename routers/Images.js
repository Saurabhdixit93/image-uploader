const express = require('express');
const router =  express.Router();
const passport = require('passport');
const ImagesController = require('../controllers/ImagesController');


router.get('/upload-image-page', passport.checkAuthentication ,ImagesController.getImageUploadPage);
router.post('/upload-image' ,    ImagesController.uploadImage);
router.get('/all-images/:id',    ImagesController.AllImages);
router.get('/delete-image/:id',  passport.checkAuthentication,  ImagesController.deleteImage);

module.exports = router;

