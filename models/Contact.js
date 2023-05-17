const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
    },
    email:{
        type: String,
        require: true
    },
    subject: {
        type: String,
        require: true
    },
    message: {
        type: String,
        require: true
    },
},{timestamps:true});

module.exports = mongoose.model('Contact' , contactSchema);