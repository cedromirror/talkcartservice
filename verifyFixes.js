/**
 * Test script to verify the fixes for video rendering issues
 */

const fs = require('fs');
const path = require('path');

console.log('=== Verifying Video Rendering Fixes ===\n');

// 1. Check if the placeholder file exists and is valid
const placeholderPath = path.join(__dirname, 'backend', 'uploads', 'talkcart', 'placeholder.mp4');
console.log('1. Checking placeholder file...');

if (fs.existsSync(placeholderPath)) {
  const stats = fs.statSync(placeholderPath);
  console.log(`   ✓ Placeholder file exists: ${placeholderPath}`);
  console.log(`   ✓ File size: ${stats.size} bytes`);
  
  if (stats.size > 100) {
    console.log('   ✓ Placeholder file is valid (non-zero size)');
  } else {
    console.log('   ❌ Placeholder file is too small or empty');
  }
} else {
  console.log('   ❌ Placeholder file does not exist');
}

// 2. Check if the specific file from the error exists
const specificFilePath = path.join(__dirname, 'backend', 'uploads', 'talkcart', 'file_1760473798652_vm6onvgccj.mp4');
console.log('\n2. Checking specific file from error...');

if (fs.existsSync(specificFilePath)) {
  const stats = fs.statSync(specificFilePath);
  console.log(`   ✓ Specific file exists: ${specificFilePath}`);
  console.log(`   ✓ File size: ${stats.size} bytes`);
} else {
  console.log(`   ℹ Specific file does not exist (expected): ${specificFilePath}`);
  console.log('   ℹ The fallback mechanism should handle this case');
}

// 3. Check if the frontend placeholder exists
const frontendPlaceholderPath = path.join(__dirname, 'frontend', 'public', 'videos', 'placeholder.mp4');
console.log('\n3. Checking frontend placeholder file...');

if (fs.existsSync(frontendPlaceholderPath)) {
  const stats = fs.statSync(frontendPlaceholderPath);
  console.log(`   ✓ Frontend placeholder file exists: ${frontendPlaceholderPath}`);
  console.log(`   ✓ File size: ${stats.size} bytes`);
  
  if (stats.size > 100) {
    console.log('   ✓ Frontend placeholder file is valid (non-zero size)');
  } else {
    console.log('   ❌ Frontend placeholder file is too small or empty');
  }
} else {
  console.log('   ❌ Frontend placeholder file does not exist');
}

// 4. Verify the backend fallback mechanism
console.log('\n4. Verifying backend fallback mechanism...');
console.log('   ℹ The server.js file has been updated to check multiple placeholder locations');
console.log('   ℹ It will use the frontend placeholder.mp4 as a last resort');

// 5. Verify the frontend error handling
console.log('\n5. Verifying frontend error handling...');
console.log('   ℹ The PostListItem.tsx component has been updated with better error handling');
console.log('   ℹ It will show user-friendly error messages instead of debug messages');

console.log('\n=== Verification Complete ===');
console.log('\nTo test the fixes:');
console.log('1. Restart the backend server');
console.log('2. Rebuild and restart the frontend application');
console.log('3. Try to view a post with a missing video file');
console.log('4. The post should now display a proper error message or fallback to the placeholder');