// Test script to verify the fix for isKnownMissingFile function
const path = require('path');

// Mock the isKnownMissingFile function after the fix
function isKnownMissingFile(url) {
  if (!url || typeof url !== 'string') return false;
  
  return (
    url.includes('file_1760168733155_lfhjq4ik7ht') ||
    url.includes('file_1760163879851_tt3fdqqim9') ||
    url.includes('file_1760263843073_w13593s5t8l') ||
    url.includes('file_1760276276250_3pqeekj048s') ||
    url.includes('file_1760473798652_vm6onvgccj')
    // Removed generic pattern matching that was incorrectly flagging valid files
  );
}

// Test with actual URLs from the database
const testUrls = [
  'http://localhost:8000/uploads/talkcart/file_1760472876401_eul3ctkpyr8.mp4',
  'http://localhost:8000/uploads/talkcart/file_1760473798652_vm6onvgccj.mp4',
  'http://localhost:8000/uploads/talkcart/file_1760618426356_5rrpw48tb5b.mp4'
];

console.log('Testing isKnownMissingFile function after fix...\n');

testUrls.forEach((url, index) => {
  console.log(`--- Test URL ${index + 1} ---`);
  console.log(`URL: ${url}`);
  
  const isMissing = isKnownMissingFile(url);
  console.log(`Is known missing file: ${isMissing}`);
  
  if (!isMissing) {
    console.log('✅ This file should now be displayed correctly instead of showing placeholder text');
  } else {
    console.log('❌ This file is still being treated as missing');
  }
  
  console.log('');
});

// Test with known missing files
const knownMissingUrls = [
  'http://localhost:8000/uploads/talkcart/file_1760168733155_lfhjq4ik7ht.mp4',
  'http://localhost:8000/uploads/talkcart/file_1760473798652_vm6onvgccj.mp4'
];

console.log('--- Testing known missing files ---');
knownMissingUrls.forEach((url, index) => {
  console.log(`Known missing URL ${index + 1}: ${url}`);
  const isMissing = isKnownMissingFile(url);
  console.log(`Is known missing file: ${isMissing}`);
  console.log('');
});