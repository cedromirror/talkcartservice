const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const config = require('./config/config');

// Configure Cloudinary
if (config.cloudinary.enabled) {
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
  });
  
  console.log('Cloudinary configured successfully');
  
  // Test upload with a small file
  const testFilePath = path.join(__dirname, 'testCloudinaryUpload.js');
  
  if (fs.existsSync(testFilePath)) {
    console.log('Uploading test file to Cloudinary...');
    
    cloudinary.uploader.upload(testFilePath, {
      folder: 'talkcart',
      resource_type: 'raw',
      public_id: `test_upload_${Date.now()}`
    })
    .then(result => {
      console.log('Upload successful:', {
        public_id: result.public_id,
        secure_url: result.secure_url,
        url: result.url
      });
    })
    .catch(error => {
      console.error('Upload failed:', error.message);
      console.error('Error details:', error);
    });
  } else {
    console.log('Test file not found');
  }
} else {
  console.log('Cloudinary not enabled');
}