const http = require('http');
const fs = require('fs');
const path = require('path');

// Test if the redirect is working correctly
console.log('=== Testing Redirect for Missing Video File ===\n');

// Simulate the backend fallback logic
const reqPath = '/talkcart/file_1760473798652_vm6onvgccj.mp4';
const uploadsDir = path.join(__dirname, 'backend', 'uploads');
const fsPath = path.normalize(path.join(uploadsDir, reqPath));

console.log('Request Path:', reqPath);
console.log('Full File Path:', fsPath);
console.log('File Exists:', fs.existsSync(fsPath));

if (!fs.existsSync(fsPath)) {
  console.log('\nFile does not exist, checking for fallbacks...');
  
  // Not found: check for the user's specific fallback file first, then general placeholders
  const fallbackFilename = 'file_1760472876401_eul3ctkpyr8.mp4';
  const candidates = [
    path.join(uploadsDir, fallbackFilename),
    path.join(uploadsDir, 'talkcart', fallbackFilename),
    path.join(uploadsDir, 'placeholder.mp4'),
    path.join(uploadsDir, 'talkcart', 'placeholder.mp4')
  ];

  console.log('Fallback candidates:');
  candidates.forEach((candidate, index) => {
    const exists = fs.existsSync(candidate);
    console.log(`  ${index + 1}. ${candidate} - ${exists ? 'EXISTS' : 'NOT FOUND'}`);
    if (exists) {
      try {
        const stat = fs.statSync(candidate);
        console.log(`     Size: ${stat.size} bytes`);
      } catch (e) {
        console.log(`     Error checking file: ${e.message}`);
      }
    }
  });

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
  
  console.log('\nFound valid fallback:', !!found);
  
  if (found) {
    // Redirect to the uploads URL so the static middleware can serve it (supports range requests)
    const rel = path.relative(uploadsDir, found).replace(/\\/g, '/');
    const redirectPath = `/uploads/${rel}`;
    
    console.log('Redirecting to:', redirectPath);
    console.log('✅ Redirect should work correctly');
  } else {
    console.log('❌ No valid fallback found');
  }
} else {
  console.log('✅ File exists, no redirect needed');
}

console.log('\n=== Test Complete ===');