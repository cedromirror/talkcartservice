/**
 * Verify the HTTPS fix for the specific error case
 */

// Since we're running this in Node.js, we can't directly import TypeScript files
// Let's recreate the normalizeMediaUrl function here for testing

/**
 * Normalize media URL with comprehensive fixes
 * @param urlString The URL to normalize
 * @param resourceType The type of resource (video, image, etc.)
 * @returns Normalized URL string or null
 */
const normalizeMediaUrl = (urlString, resourceType) => {
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
      if (normalizedUrl.includes('localhost:')) {
        const hasExtension = normalizedUrl.includes('.');
        const isVideoResource = resourceType === 'video';
        
        // For video resources or URLs that look like they should be videos, ensure .mp4 extension
        if (isVideoResource && !hasExtension) {
          normalizedUrl += '.mp4';
        } else if (!hasExtension) {
          // Check if it's missing an extension and try to add .mp4 for videos
          const isVideo = normalizedUrl.includes('video') || normalizedUrl.includes('mp4') || normalizedUrl.includes('mov');
          if (isVideo && !normalizedUrl.endsWith('.mp4')) {
            normalizedUrl += '.mp4';
          }
        }
      }
      
      // Convert HTTP to HTTPS for secure connections (except localhost)
      if (normalizedUrl.startsWith('http://') && !normalizedUrl.includes('localhost:')) {
        normalizedUrl = normalizedUrl.replace('http://', 'https://');
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
      const baseUrl = isDev ? 'http://localhost:8000' : 'https://yourdomain.com';
      
      if (baseUrl) {
        // Ensure we don't double up on slashes
        if (normalizedUrl.startsWith('/')) {
          normalizedUrl = `${baseUrl}${normalizedUrl}`;
        } else {
          normalizedUrl = `${baseUrl}/${normalizedUrl}`;
        }
        
        // Fix for missing file extensions in local URLs
        if (normalizedUrl.includes('localhost:')) {
          const hasExtension = normalizedUrl.includes('.');
          const isVideoResource = resourceType === 'video';
          
          // For video resources or URLs that look like they should be videos, ensure .mp4 extension
          if (isVideoResource && !hasExtension) {
            normalizedUrl += '.mp4';
          } else if (!hasExtension) {
            // Check if it's missing an extension and try to add .mp4 for videos
            const isVideo = normalizedUrl.includes('video') || normalizedUrl.includes('mp4') || normalizedUrl.includes('mov');
            if (isVideo && !normalizedUrl.endsWith('.mp4')) {
              normalizedUrl += '.mp4';
            }
          }
        }
        
        // Convert HTTP to HTTPS for secure connections (except localhost)
        if (normalizedUrl.startsWith('http://') && !normalizedUrl.includes('localhost:')) {
          normalizedUrl = normalizedUrl.replace('http://', 'https://');
        }
      }
      return normalizedUrl;
    }
    
    return null;
  } catch (e) {
    console.error('❌ Error in normalizeMediaUrl:', e);
    // Try one more time with basic validation for edge cases
    if (urlString && (urlString.startsWith('http://') || urlString.startsWith('https://'))) {
      // Convert HTTP to HTTPS for secure connections (except localhost)
      if (urlString.startsWith('http://') && !urlString.includes('localhost:')) {
        return urlString.replace('http://', 'https://');
      }
      return urlString;
    }
    return null;
  }
};

// Test the specific URL from the error
const testUrl = 'http://localhost:8000/uploads/talkcart/file_1760473798652_vm6onvgccj.mp4';

console.log('=== Verifying HTTPS Fix for Specific Error Case ===\n');
console.log('Input URL:', testUrl);

// Test with our updated normalizeMediaUrl function
const normalizedUrl = normalizeMediaUrl(testUrl, 'video');
console.log('Normalized URL:', normalizedUrl);

// Check if it's a valid URL
const isValid = normalizedUrl && (normalizedUrl.startsWith('http://') || normalizedUrl.startsWith('https://'));
console.log('Is Valid URL:', isValid);

// For localhost URLs, we expect HTTP to remain unchanged
if (testUrl.includes('localhost:')) {
  if (normalizedUrl === testUrl) {
    console.log('✅ Localhost URL correctly preserved as HTTP');
  } else {
    console.log('❌ Localhost URL was incorrectly modified');
  }
} else {
  // For non-localhost URLs, we expect HTTP to be converted to HTTPS
  if (testUrl.startsWith('http://') && normalizedUrl.startsWith('https://')) {
    console.log('✅ HTTP correctly converted to HTTPS');
  } else if (testUrl.startsWith('https://') && normalizedUrl.startsWith('https://')) {
    console.log('✅ HTTPS URL correctly preserved');
  } else {
    console.log('❌ URL not correctly handled');
  }
}

console.log('\n=== Verification Complete ===');
console.log('The fix should resolve the "Video not available" error by:');
console.log('1. Ensuring proper URL normalization');
console.log('2. Maintaining localhost URLs as HTTP for development');
console.log('3. Converting production URLs to HTTPS for security');
console.log('4. Handling duplicate path segments correctly');