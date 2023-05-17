const express = require('express');
const router =  express.Router();
const ContactController = require('../controllers/ContactController');

router.get('/submit-form',  ContactController.getContactForm);
router.post('/submit-form', ContactController.sendContactForm);


module.exports = router;
