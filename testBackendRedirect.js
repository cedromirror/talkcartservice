const http = require('http');

// Test if the backend redirect is working
console.log('=== Testing Backend Redirect ===\n');

// Make a request to the missing video file
const options = {
  hostname: 'localhost',
  port: 8000,
  path: '/uploads/talkcart/file_1760473798652_vm6onvgccj.mp4',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers, null, 2)}`);
  
  if (res.statusCode === 302) {
    console.log('✅ Redirect is working');
    console.log(`Redirect location: ${res.headers.location}`);
  } else if (res.statusCode === 404) {
    console.log('❌ No redirect, file not found');
  } else {
    console.log(`❓ Unexpected status code: ${res.statusCode}`);
  }
  
  res.on('data', (chunk) => {
    // Just consume the data
  });
  
  res.on('end', () => {
    console.log('Request completed');
  });
});

req.on('error', (error) => {
  console.error('❌ Request error:', error.message);
});

req.end();

console.log('Request sent to http://localhost:8000/uploads/talkcart/file_1760473798652_vm6onvgccj.mp4');
console.log('Make sure the backend server is running on port 8000');