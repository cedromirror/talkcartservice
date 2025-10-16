/**
 * Debug script to verify the redirect path calculation
 */

const fs = require('fs');
const path = require('path');

console.log('=== Debugging Redirect Path Calculation ===\n');

const uploadsDir = path.join(__dirname, 'backend', 'uploads');
console.log('Uploads directory:', uploadsDir);

// Test the fallback logic
const candidates = [
  path.join(uploadsDir, 'placeholder.mp4'),
  path.join(uploadsDir, 'talkcart', 'placeholder.mp4'),
  path.join(__dirname, 'frontend', 'public', 'videos', 'placeholder.mp4')
];

console.log('Candidates:');
candidates.forEach((candidate, index) => {
  console.log(`  ${index + 1}. ${candidate}`);
  if (fs.existsSync(candidate)) {
    const stats = fs.statSync(candidate);
    console.log(`     ✅ Exists (${stats.size} bytes)${stats.size > 100 ? ' - Valid' : ' - Too small'}`);
  } else {
    console.log('     ❌ Does not exist');
  }
});

// Find the valid fallback
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
  console.log(`\n✅ Valid fallback file found: ${found}`);
  
  // Calculate the relative path
  const rel = path.relative(uploadsDir, found).replace(/\\/g, '/');
  console.log(`Relative path: ${rel}`);
  
  // Calculate the redirect path
  const redirectPath = `/uploads/${rel}`;
  console.log(`Redirect path: ${redirectPath}`);
  
  // Verify the redirect path would work
  const expectedRedirectFile = path.join(uploadsDir, rel);
  console.log(`Expected redirect file: ${expectedRedirectFile}`);
  console.log(`File exists: ${fs.existsSync(expectedRedirectFile)}`);
} else {
  console.log('\n❌ No valid fallback file found');
}

console.log('\n=== Debug Complete ===');