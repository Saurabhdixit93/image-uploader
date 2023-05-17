
const ImageModel = require('../models/Images');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);


module.exports.getImageUploadPage = (req ,res) => {
    return res.render('UploadImages', {
        title: 'Images Upload Page'
    });
};

module.exports.uploadImage = async (req ,res) => {
    try{
        const userId = req.user._id;
        let image = new ImageModel({
            user: userId,
            imageUrl: '',
        });
        // Promisify the Post.upload_imageUrl middleware function
        const upload_imageUrl = promisify(ImageModel.upload_imageUrl);
        await upload_imageUrl(req, res);
        const imageUrl = req.file;
        // If a post picture was uploaded, process the file
        if (imageUrl) {
            const { path: tmpFilePath , filename: tmpFileName, mimetype, originalname } = imageUrl;
            if (!mimetype.startsWith('image/')) {
              await unlinkAsync(tmpFilePath);
              req.flash('error', 'Invalid file type. Only image files are allowed.');
              return res.redirect('back');
            }
            const fileName = `${originalname}_${Date.now()}`;
            const uploadImageUrl = path.join(ImageModel.Image_File_Path, fileName);
            await fs.promises.rename(tmpFilePath, path.join(__dirname, '..', uploadImageUrl));
            image.imageUrl = uploadImageUrl;
        }
        image.user = userId;
        await image.save();
        req.flash('success', 'Image Uploaded Successfully');
        return res.redirect('back');
    }catch(error){
        req.flash('error', `Error in ${error.message}`);
        return res.redirect('back');
    }
};


module.exports.AllImages = async (req , res) => {
    try{
        const userId = req.params.id;
        const images = await ImageModel.find({ user: userId });
        if(!images){
            req.flash('error', `Images Not Found !`);
            return res.redirect('back');
        }
        return res.render('Images', {
            title: "Images Showing",
            images,
        });

    }catch(error){
        req.flash('error', `Error in ${error.message}`);
        return res.redirect('back');
    }
};


module.exports.deleteImage = async (req ,res) => {
    const imageId = req.params.id;
    const image = await ImageModel.findOne({user: req.user.id});
    try{
        const imageDeleted = await ImageModel.findByIdAndDelete(imageId);
        if(!imageDeleted){
            req.flash('error' ,'Image Not Associated With User');
            return res.redirect('back');
        };
        deleteImageStorage(image.imageUrl , req);
        req.flash('success' ,'Image Deleted Successfully');
        return res.redirect('back');
    }catch(error){
        console.log('errri delet' ,error);
        req.flash('error', `Error in ${error.message}`);
        return res.redirect('back');
    }
};

function deleteImageStorage(imageUrl , req) {
  const filename = path.basename(imageUrl);
  const imagePath = path.join(__dirname, '../uploads/images/uploaded_images', filename);

  fs.access(imagePath, fs.constants.F_OK, (err) => {
    if (err) {
        req.flash('error' , `Error accessing image file: ${err.message}`);
        return;
    }
    fs.unlink(imagePath, (err) => {
      if (err) {
        req.flash('error' , `Error deleting image file : ${err.message}`);
        return;
      }
      req.flash('success' , `File deleted Successfull`);
    });
  });
}