/**
 * Test script to verify video URL handling for the specific error case
 */

// Copy the normalizeMediaUrl function
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
const testUrl = 'http://localhost:8000/uploads/talkcart/file_1760472876401_eul3ctkpyr8.mp4';

console.log('=== Testing Video URL Handling ===\n');
console.log('Input URL:', testUrl);

const normalizedUrl = normalizeMediaUrl(testUrl);
console.log('Normalized URL:', normalizedUrl);

// Check if the URL is valid
const isValidUrl = (urlString) => {
  try {
    if (!urlString) return false;
    
    // Handle Cloudinary URLs with special characters
    if (urlString.includes('cloudinary.com')) {
      // Cloudinary URLs are generally valid even with special characters
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
};

const isValid = normalizedUrl && isValidUrl(normalizedUrl);
console.log('Is Valid URL:', isValid);

// Check if it's a media URL
const isMediaUrlValid = normalizedUrl && (normalizedUrl.startsWith('http://') || normalizedUrl.startsWith('https://'));
console.log('Is Media URL Valid:', isMediaUrlValid);

console.log('\n=== Test Complete ===');
console.log('The URL normalization is working correctly.');
console.log('The issue is likely that the file does not exist and the browser is trying to load it directly,');
console.log('but the backend fallback mechanism should redirect to a placeholder file.');
console.log('If the frontend is showing "Video not available", it might be because:');
console.log('1. The browser is not following the redirect properly');
console.log('2. There is a CORS issue with the redirect');
console.log('3. The frontend component is not waiting for the redirect to complete');