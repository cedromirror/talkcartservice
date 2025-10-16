/**
 * Test script to verify video URL fix
 * This script tests the URL normalization functions
 */

// Import the normalizeMediaUrl function from our utilities
const { normalizeMediaUrl, isValidUrl } = require('./frontend/src/utils/videoUtils');

// Test cases
const testCases = [
  // Normal URLs (should remain unchanged)
  'http://localhost:8000/uploads/talkcart/file_12345.mp4',
  'https://res.cloudinary.com/demo/video/upload/v1234567890/sample.mp4',
  
  // URLs with duplicate paths (should be fixed)
  'http://localhost:8000/uploads/talkcart/talkcart/file_12345.mp4',
  'https://res.cloudinary.com/demo/video/upload/talkcart/talkcart/v1234567890/sample.mp4',
  
  // Relative URLs (should be converted to absolute)
  '/uploads/talkcart/file_12345.mp4',
  '/uploads/talkcart/talkcart/file_12345.mp4',
  
  // Invalid URLs
  null,
  undefined,
  '',
  'invalid-url'
];

console.log('Testing Video URL Normalization...\n');

testCases.forEach((testCase, index) => {
  console.log(`Test Case ${index + 1}:`);
  console.log(`  Input: ${testCase}`);
  
  try {
    const normalized = normalizeMediaUrl(testCase);
    const isValid = isValidUrl(normalized);
    
    console.log(`  Normalized: ${normalized}`);
    console.log(`  Valid: ${isValid}`);
  } catch (error) {
    console.log(`  Error: ${error.message}`);
  }
  
  console.log('');
});

console.log('Test completed.');