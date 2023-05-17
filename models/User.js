const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
      },
    verificationToken: String,
    verificationExpires: Date,

} ,{ timestamps: true});


module.exports = mongoose.model('User' ,UserSchema);


