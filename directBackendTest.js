/**
 * Direct test of the backend fallback mechanism
 */

const http = require('https');

console.log('=== Direct Backend Test ===\n');

// Test the exact URL that should trigger the fallback
const options = {
  hostname: 'localhost',
  port: 8000,
  path: '/uploads/talkcart/file_1760472876401_eul3ctkpyr8.mp4',
  method: 'GET',
  headers: {
    'Accept': 'video/mp4,video/*,*/*',
    'User-Agent': 'Mozilla/5.0 (Test Client)'
  }
};

console.log(`Making request to: http://localhost:8000${options.path}`);

const req = http.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers, null, 2)}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log(`Response body length: ${data.length} characters`);
    if (data.length < 200) {
      console.log(`Response body: ${data}`);
    } else {
      console.log(`Response body (first 200 chars): ${data.substring(0, 200)}...`);
    }
    
    console.log('\n=== Request Complete ===');
  });
});

req.on('error', (error) => {
  console.log(`❌ Request error: ${error.message}`);
});

req.end();