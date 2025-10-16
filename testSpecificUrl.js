/**
 * Test script to verify the specific URL from the error
 * URL: http://localhost:8000/uploads/talkcart/file_1760473798652_vm6onvgccj.mp4
 */

// Copy the normalizeMediaUrl function from PostListItem.tsx
const normalizeMediaUrl = (urlString) => {
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
      
      // Fix for missing file extensions in local URLs
      if (normalizedUrl.includes('localhost:') && !normalizedUrl.includes('.')) {
        // Check if it's missing an extension and try to add .mp4 for videos
        const isVideo = normalizedUrl.includes('video') || normalizedUrl.includes('mp4') || normalizedUrl.includes('mov');
        if (isVideo && !normalizedUrl.endsWith('.mp4')) {
          normalizedUrl += '.mp4';
        }
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
      // For production, this should be handled by the backend
      const isDev = true; // Simulate development environment
      const baseUrl = isDev ? 'http://localhost:8000' : 'http://localhost:8000'; // Using localhost:8000 for both
      
      if (baseUrl) {
        // Ensure we don't double up on slashes
        if (normalizedUrl.startsWith('/')) {
          return `${baseUrl}${normalizedUrl}`;
        } else {
          return `${baseUrl}/${normalizedUrl}`;
        }
      }
      return normalizedUrl;
    }
    
    return null;
  } catch (e) {
    console.error('❌ Error in normalizeMediaUrl:', e);
    // Try one more time with basic validation for edge cases
    if (urlString && (urlString.startsWith('http://') || urlString.startsWith('https://'))) {
      return urlString;
    }
    return null;
  }
};

// Test the specific URL from the error
const testUrl = 'http://localhost:8000/uploads/talkcart/file_1760473798652_vm6onvgccj.mp4';

console.log('Testing the specific URL from the error:');
console.log('Input URL:', testUrl);

const normalizedUrl = normalizeMediaUrl(testUrl);
console.log('Normalized URL:', normalizedUrl);

// Check if the URL has duplicate paths
if (testUrl.includes('/uploads/talkcart/talkcart/')) {
  console.log('❌ URL contains duplicate talkcart paths');
} else {
  console.log('✅ URL does not contain duplicate talkcart paths');
}

// Test if the URL is valid
try {
  const urlObj = new URL(normalizedUrl);
  console.log('✅ URL is valid');
  console.log('Protocol:', urlObj.protocol);
  console.log('Hostname:', urlObj.hostname);
  console.log('Port:', urlObj.port);
  console.log('Pathname:', urlObj.pathname);
} catch (e) {
  console.log('❌ URL is invalid:', e.message);
}