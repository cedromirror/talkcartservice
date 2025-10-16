/**
 * Debug the exact path calculation in the fallback middleware
 */

const fs = require('fs');
const path = require('path');

console.log('=== Debug Path Calculation ===\n');

// Simulate the exact logic from the middleware
const reqPath = '/talkcart/file_1760472876401_eul3ctkpyr8.mp4';
const uploadsDir = path.join(__dirname, 'backend', 'uploads');
const fsPath = path.normalize(path.join(uploadsDir, reqPath));

console.log('1. Initial path calculation:');
console.log(`   reqPath: ${reqPath}`);
console.log(`   uploadsDir: ${uploadsDir}`);
console.log(`   fsPath: ${fsPath}`);
console.log(`   fsPath exists: ${fs.existsSync(fsPath)}`);

if (!fs.existsSync(fsPath)) {
  console.log('\n2. Fallback logic:');
  
  // Not found: check for the user's specific fallback file first, then general placeholders
  const fallbackFilename = 'file_1760472876401_eul3ctkpyr8.mp4';
  const candidates = [
    path.join(uploadsDir, fallbackFilename),
    path.join(uploadsDir, 'talkcart', fallbackFilename),
    path.join(uploadsDir, 'placeholder.mp4'),
    path.join(uploadsDir, 'talkcart', 'placeholder.mp4'),
    path.join(__dirname, 'frontend', 'public', 'videos', 'placeholder.mp4')
  ];
  
  console.log('   Candidates:');
  candidates.forEach((candidate, index) => {
    console.log(`     ${index + 1}. ${candidate}`);
    console.log(`        Exists: ${fs.existsSync(candidate)}`);
    if (fs.existsSync(candidate)) {
      try {
        const stat = fs.statSync(candidate);
        console.log(`        Size: ${stat.size} bytes`);
        console.log(`        Is file: ${stat.isFile()}`);
        console.log(`        Valid: ${stat.isFile() && stat.size > 100}`);
      } catch (e) {
        console.log(`        Error checking file: ${e.message}`);
      }
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
  
  console.log(`\n   Found: ${!!found}`);
  
  if (found) {
    console.log(`   Found file: ${found}`);
    
    // Calculate the redirect path exactly as in the middleware
    const rel = path.relative(uploadsDir, found).replace(/\\/g, '/');
    console.log(`   rel: ${rel}`);
    
    const redirectPath = `/uploads/${rel}`;
    console.log(`   redirectPath: ${redirectPath}`);
    
    console.log('\n   This should be the redirect location, but the HTTP test showed "/"');
    console.log('   This suggests there might be an issue with the res.redirect() call');
  } else {
    console.log('   No valid fallback found');
  }
}

console.log('\n=== Debug Complete ===');