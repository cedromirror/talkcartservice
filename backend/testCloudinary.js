const config = require('./config/config');
const cloudinary = require('cloudinary').v2;

console.log('Cloudinary Configuration:');
console.log('Enabled:', config.cloudinary.enabled);
console.log('Cloud Name:', config.cloudinary.cloudName);
console.log('API Key:', config.cloudinary.apiKey);
console.log('API Secret:', config.cloudinary.apiSecret ? '****' : 'Not set');

if (config.cloudinary.enabled) {
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
  });

  console.log('\nTesting Cloudinary connection...');
  
  // Test ping to verify connection
  cloudinary.api.ping()
    .then(result => {
      console.log('Cloudinary connection successful:', result);
    })
    .catch(error => {
      console.error('Cloudinary connection failed:', error.message);
    });
} else {
  console.log('Cloudinary is not enabled');
}