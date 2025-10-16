/**
 * Test script to verify the fallback mechanism for missing video files
 */

const fs = require('fs');
const path = require('path');

console.log('=== Testing Fallback Mechanism ===\n');

// Test the exact file from the error
const missingFilePath = path.join(__dirname, 'backend', 'uploads', 'talkcart', 'file_1760473798652_vm6onvgccj.mp4');
console.log('1. Checking if the specific file exists...');
if (fs.existsSync(missingFilePath)) {
  console.log('   ❌ File exists (unexpected)');
  const stats = fs.statSync(missingFilePath);
  console.log(`   File size: ${stats.size} bytes`);
} else {
  console.log('   ✅ File does not exist (expected)');
}

// Test the fallback mechanism paths
console.log('\n2. Checking fallback mechanism paths...');

const uploadsDir = path.join(__dirname, 'backend', 'uploads');
const fallbackFilename = 'file_1760472876401_eul3ctkpyr8.mp4';

const candidates = [
  path.join(uploadsDir, fallbackFilename),
  path.join(uploadsDir, 'talkcart', fallbackFilename),
  path.join(uploadsDir, 'placeholder.mp4'),
  path.join(uploadsDir, 'talkcart', 'placeholder.mp4'),
  path.join(__dirname, 'frontend', 'public', 'videos', 'placeholder.mp4')
];

candidates.forEach((candidate, index) => {
  console.log(`   ${index + 1}. ${candidate}`);
  if (fs.existsSync(candidate)) {
    const stats = fs.statSync(candidate);
    console.log(`      ✅ Exists (${stats.size} bytes)`);
  } else {
    console.log('      ❌ Does not exist');
  }
});

// Test the actual fallback logic
console.log('\n3. Testing fallback logic...');

const found = candidates.find(p => {
  try {
    if (!fs.existsSync(p)) return false;
    const stat = fs.statSync(p);
    // Only use a placeholder if file size is reasonable (avoid zero-length files)
    return stat.isFile() && stat.size > 100; // >100 bytes
  } catch (e) {
    return false;
  }
});

if (found) {
  console.log('   ✅ Fallback file found:', found);
  const rel = path.relative(uploadsDir, found).replace(/\\/g, '/');
  const redirectPath = `/uploads/${rel}`;
  console.log('   Redirect path would be:', redirectPath);
} else {
  console.log('   ❌ No valid fallback file found');
}

console.log('\n=== Test Complete ===');