const mongoose = require('mongoose');

const passwordSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'User'
    },
    token:{
        type: String,
        require: true
    },
    isValid: {
        type: Boolean,
        require: true
    },
},{timestamps:true});

module.exports = mongoose.model('PasswordReset' , passwordSchema);