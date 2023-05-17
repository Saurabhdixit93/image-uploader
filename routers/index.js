const express = require('express');
const router =  express.Router();

router.get('/' ,(req ,res) => {
    return res.render('index' ,{
        title: 'Home Page'
    });
});

router.get('/about-us/About-Page' , (req ,res) => {
    return res.render('AboutUs' ,{
        title: 'About Us Page',
    });
});

router.use('/user',       require('./User'));
router.use('/auth',       require('./ForgotPassword'));
router.use('/contact',    require('./Contact'));
router.use('/userId',     require('./ProfileUpdate'));
router.use('/userImage',  require('./Images'));

module.exports = router;
