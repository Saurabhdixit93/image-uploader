const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const imageFilePath = path.join('/uploads/images/uploaded_images');


const ImagesSchema = new mongoose.Schema({
    imageUrl: {
        type: String,
        require: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
},{timestamps:true});

let storage = multer.diskStorage({
    destination: (request , file , call_back) => {
        call_back(null, path.join(__dirname,'..',imageFilePath));
    },
    filename: (request ,file , call_back ) =>{
        call_back(null, file.fieldname +'-'+Date.now());
    }
});

// // statics methods
ImagesSchema.statics.upload_imageUrl = multer({storage: storage}).single('imageUrl');
ImagesSchema.statics.Image_File_Path = imageFilePath;


module.exports = mongoose.model('Images' ,ImagesSchema);
