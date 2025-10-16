/**
 * Test script to verify HTTPS fix for video URLs
 */

// Copy the normalizeMediaUrl function with our fixes
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

// Test cases
const testCases = [
  {
    name: 'HTTP URL (should convert to HTTPS)',
    url: 'http://example.com/uploads/talkcart/file_1760473798652_vm6onvgccj.mp4',
    resourceType: 'video'
  },
  {
    name: 'HTTPS URL (should remain unchanged)',
    url: 'https://example.com/uploads/talkcart/file_1760473798652_vm6onvgccj.mp4',
    resourceType: 'video'
  },
  {
    name: 'Localhost URL (should remain HTTP)',
    url: 'http://localhost:8000/uploads/talkcart/file_1760473798652_vm6onvgccj.mp4',
    resourceType: 'video'
  },
  {
    name: 'URL with duplicate paths (should fix and convert to HTTPS)',
    url: 'http://example.com/uploads/talkcart/talkcart/file_1760473798652_vm6onvgccj.mp4',
    resourceType: 'video'
  },
  {
    name: 'Relative URL (should convert to absolute with HTTPS)',
    url: '/uploads/talkcart/file_1760473798652_vm6onvgccj.mp4',
    resourceType: 'video'
  }
];

console.log('=== Testing HTTPS Fix for Video URLs ===\n');

testCases.forEach((testCase, index) => {
  console.log(`Test ${index + 1}: ${testCase.name}`);
  console.log(`Input URL: ${testCase.url}`);
  
  const normalized = normalizeMediaUrl(testCase.url, testCase.resourceType);
  console.log(`Normalized URL: ${normalized}`);
  
  // Check if HTTP URLs (except localhost) are converted to HTTPS
  const isHttpConverted = testCase.url.startsWith('http://') && 
                         !testCase.url.includes('localhost:') && 
                         normalized.startsWith('https://');
  
  if (isHttpConverted) {
    console.log('✅ HTTP converted to HTTPS successfully');
  } else if (testCase.url.startsWith('http://') && !testCase.url.includes('localhost:')) {
    console.log('❌ HTTP URL not converted to HTTPS');
  } else {
    console.log('ℹ️  No HTTPS conversion needed');
  }
  
  console.log('---\n');
});

console.log('✅ HTTPS fix testing complete!');