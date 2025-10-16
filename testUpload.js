const fs = require('fs');
const path = require('path');

// Create a simple test file
const testContent = 'This is a test file for upload testing.';
fs.writeFileSync('test.txt', testContent);

console.log('Test file created. Now uploading...');

// Test the upload endpoint
const formData = new FormData();
formData.append('file', fs.createReadStream('test.txt'));

fetch('http://localhost:8000/api/media/upload/single', {
  method: 'POST',
  body: formData,
  // Note: We're not including auth headers for this test, so it should fail with auth error
  // But we can still see the structure of the response
})
.then(response => response.json())
.then(data => {
  console.log('Upload response:', data);
  fs.unlinkSync('test.txt'); // Clean up
})
.catch(error => {
  console.error('Upload error:', error);
  fs.unlinkSync('test.txt'); // Clean up
});