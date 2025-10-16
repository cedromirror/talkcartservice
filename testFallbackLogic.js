/**
 * Test script to verify the exact fallback logic in the backend
 */

const fs = require('fs');
const path = require('path');

console.log('=== Testing Exact Backend Fallback Logic ===\n');

const uploadsDir = path.join(__dirname, 'backend', 'uploads');
const reqPath = '/talkcart/file_1760472876401_eul3ctkpyr8.mp4';
const fsPath = path.normalize(path.join(uploadsDir, reqPath));

console.log('1. Initial check:');
console.log(`   Requested path: ${reqPath}`);
console.log(`   File system path: ${fsPath}`);
console.log(`   File exists: ${fs.existsSync(fsPath)}`);

if (!fs.existsSync(fsPath)) {
  console.log('\n2. Fallback mechanism:');
  
  // Not found: check for the user's specific fallback file first, then general placeholders
  const fallbackFilename = 'file_1760472876401_eul3ctkpyr8.mp4';
  const candidates = [
    path.join(uploadsDir, fallbackFilename),
    path.join(uploadsDir, 'talkcart', fallbackFilename),
    path.join(uploadsDir, 'placeholder.mp4'),
    path.join(uploadsDir, 'talkcart', 'placeholder.mp4'),
    path.join(__dirname, 'frontend', 'public', 'videos', 'placeholder.mp4')
  ];
  
  console.log('   Fallback candidates:');
  candidates.forEach((candidate, index) => {
    console.log(`     ${index + 1}. ${candidate}`);
    if (fs.existsSync(candidate)) {
      const stats = fs.statSync(candidate);
      console.log(`        ✅ Exists (${stats.size} bytes)${stats.size > 100 ? ' - Valid' : ' - Too small'}`);
    } else {
      console.log('        ❌ Does not exist');
    }
  });
  
  // Test the exact logic from the backend
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
  
  console.log(`\n   Found valid fallback: ${!!found}`);
  
  if (found) {
    console.log(`   ✅ Valid fallback file found: ${found}`);
    const rel = path.relative(uploadsDir, found).replace(/\\/g, '/');
    const redirectPath = `/uploads/${rel}`;
    console.log(`   Redirect path would be: ${redirectPath}`);
  } else {
    console.log('   ❌ No valid fallback file found');
    
    // Check if any placeholders exist but are empty
    const anyPlaceholder = candidates.find(p => fs.existsSync(p));
    if (anyPlaceholder) {
      try {
        const s = fs.statSync(anyPlaceholder);
        if (s.size === 0) {
          console.log(`   ⚠️  Placeholder exists but is empty: ${anyPlaceholder}`);
        }
      } catch (e) {
        console.log(`   ⚠️  Error checking placeholder: ${e.message}`);
      }
    }
    
    console.log('   Calling next() - this will hit the general 404 handler');
  }
} else {
  console.log('   ✅ File exists, no fallback needed');
}

console.log('\n=== Test Complete ===');
console.log('The issue is that the backend finds a valid fallback file,');
console.log('but the HTTP test showed a redirect to "/" instead of the placeholder.');
console.log('This suggests there might be an issue with how the redirect is being handled.');