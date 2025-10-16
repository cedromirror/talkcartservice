/**
 * Test script to verify URL normalization functions
 * This script tests the URL normalization logic without imports
 */

// Enhanced URL validation utility
function isValidUrl(urlString) {
  try {
    if (!urlString) return false;
    
    // Handle Cloudinary URLs with special characters
    if (urlString.includes('cloudinary.com')) {
      return urlString.startsWith('http://') || urlString.startsWith('https://');
    }
    
    // Handle local development URLs
    if (urlString.includes('localhost:') || urlString.includes('127.0.0.1')) {
      return urlString.startsWith('http://') || urlString.startsWith('https://');
    }
    
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (e) {
    return false;
  }
}

// Enhanced URL normalization utility
function normalizeMediaUrl(urlString) {
  try {
    if (!urlString) return null;
    
    // Handle already valid absolute URLs
    if (urlString.startsWith('http://') || urlString.startsWith('https://')) {
      let normalizedUrl = urlString;
      
      // Fix duplicate talkcart path issue
      if (normalizedUrl.includes('/uploads/talkcart/talkcart/')) {
        console.log('🔧 Fixing duplicate talkcart path in URL:', normalizedUrl);
        normalizedUrl = normalizedUrl.replace(/\/uploads\/talkcart\/talkcart\//g, '/uploads/talkcart/');
        console.log('✅ Fixed URL:', normalizedUrl);
      }
      
      return normalizedUrl;
    }
    
    // Handle relative URLs by converting to absolute
    if (urlString.startsWith('/')) {
      let normalizedUrl = urlString;
      
      // Check for malformed URLs with duplicate path segments
      if (normalizedUrl.includes('/uploads/talkcart/talkcart/')) {
        console.log('🔧 Fixing duplicate talkcart path in relative URL:', normalizedUrl);
        normalizedUrl = normalizedUrl.replace(/\/uploads\/talkcart\/talkcart\//g, '/uploads/talkcart/');
        console.log('✅ Fixed relative URL:', normalizedUrl);
      }
      
      // For development, use localhost:8000 as the base
      const isDev = true; // Simulate development environment
      const baseUrl = isDev ? 'http://localhost:8000' : 'https://talkcart.app';
      
      if (baseUrl) {
        return `${baseUrl}${normalizedUrl}`;
      }
      return normalizedUrl;
    }
    
    return null;
  } catch (e) {
    console.error('❌ Error in normalizeMediaUrl:', e);
    return null;
  }
}

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