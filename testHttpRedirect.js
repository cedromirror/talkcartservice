/**
 * Test script to verify the HTTP redirect for missing video files
 */

const https = require('https');

console.log('=== Testing HTTP Redirect for Missing Video File ===\n');

// Test the URL that should trigger the fallback
const options = {
  hostname: 'localhost',
  port: 8000,
  path: '/uploads/talkcart/file_1760472876401_eul3ctkpyr8.mp4',
  method: 'GET'
};

console.log(`Making request to: http://localhost:8000${options.path}`);

const req = http.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers, null, 2)}`);
  
  // Check if it's a redirect
  if (res.statusCode >= 300 && res.statusCode < 400) {
    console.log(`✅ Redirect detected to: ${res.headers.location}`);
  } else if (res.statusCode === 404) {
    console.log('❌ File not found and no redirect provided');
  } else if (res.statusCode === 200) {
    console.log('✅ File found and served directly');
  } else {
    console.log(`❓ Unexpected status code: ${res.statusCode}`);
  }
  
  // Read a small amount of data to complete the request
  res.on('data', (chunk) => {
    // Just consume the data
  });
  
  res.on('end', () => {
    console.log('\n=== Request Complete ===');
  });
});

req.on('error', (error) => {
  console.log(`❌ Request error: ${error.message}`);
});

req.end();

// Also test with a HEAD request to see just the headers
setTimeout(() => {
  console.log('\n--- Testing with HEAD request ---');
  
  const headOptions = {
    ...options,
    method: 'HEAD'
  };
  
  const headReq = https.request(headOptions, (res) => {
    console.log(`HEAD Status Code: ${res.statusCode}`);
    console.log(`HEAD Headers: ${JSON.stringify(res.headers, null, 2)}`);
    
    // Check if it's a redirect
    if (res.statusCode >= 300 && res.statusCode < 400) {
      console.log(`✅ HEAD Redirect detected to: ${res.headers.location}`);
    } else if (res.statusCode === 404) {
      console.log('❌ HEAD File not found and no redirect provided');
    } else if (res.statusCode === 200) {
      console.log('✅ HEAD File found and served directly');
    } else {
      console.log(`❓ HEAD Unexpected status code: ${res.statusCode}`);
    }
    
    res.on('data', () => {
      // Just consume the data
    });
    
    res.on('end', () => {
      console.log('\n=== HEAD Request Complete ===');
    });
  });
  
  headReq.on('error', (error) => {
    console.log(`❌ HEAD Request error: ${error.message}`);
  });
  
  headReq.end();
}, 1000);