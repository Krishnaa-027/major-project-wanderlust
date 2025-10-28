const cloudinary = require('cloudinary').v2;  
const { CloudinaryStorage } = require('multer-storage-cloudinary');


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
})

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_DEV',
    allowedFormats: ["png","jpeg","jpg"]
    // public_id: (req, file) => 'computed-filename-using-request',
  },
});



module.exports = {
    cloudinary,
    storage
}







// const cloudinary = require('cloudinary').v2;
// const multer = require('multer');
// const streamifier = require('streamifier');

// cloudinary.config({
//     cloud_name: process.env.CLOUD_NAME,
//     api_key: process.env.CLOUD_API_KEY,
//     api_secret: process.env.CLOUD_API_SECRET,
// });



// // multer memory storage (temporary, not saved locally)
// const upload = multer();  

// module.exports = { cloudinary, upload,  streamifier };