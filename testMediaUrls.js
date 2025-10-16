// Test script to debug media URL processing
const path = require('path');

// Mock the normalizeMediaUrl function
function normalizeMediaUrl(urlString, resourceType) {
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
        const isImageResource = resourceType === 'image';
        
        // For video resources or URLs that look like they should be videos, ensure .mp4 extension
        if (isVideoResource && !hasExtension) {
          normalizedUrl += '.mp4';
        } else if (isImageResource && !hasExtension) {
          // For image resources, try to determine appropriate extension
          normalizedUrl += '.png'; // Default to png for images
        } else if (!hasExtension) {
          // Check if it's missing an extension and try to add appropriate extension
          const isVideo = normalizedUrl.includes('video') || normalizedUrl.includes('mp4') || normalizedUrl.includes('mov');
          if (isVideo && !normalizedUrl.endsWith('.mp4')) {
            normalizedUrl += '.mp4';
          }
        }
      }
      
      // Convert HTTP to HTTPS for secure connections
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
      const isDev = process.env.NODE_ENV === 'development';
      const baseUrl = isDev ? 'http://localhost:8000' : (typeof window !== 'undefined' ? window.location.origin.replace('http://', 'https://') : 'https://yourdomain.com');
      
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
          const isImageResource = resourceType === 'image';
          
          // For video resources or URLs that look like they should be videos, ensure .mp4 extension
          if (isVideoResource && !hasExtension) {
            normalizedUrl += '.mp4';
          } else if (isImageResource && !hasExtension) {
            // For image resources, try to determine appropriate extension
            normalizedUrl += '.png'; // Default to png for images
          } else if (!hasExtension) {
            // Check if it's missing an extension and try to add appropriate extension
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
}

// Check if this is a known missing file
function isKnownMissingFile(url) {
  if (!url || typeof url !== 'string') return false;
  
  return (
    url.includes('file_1760168733155_lfhjq4ik7ht') ||
    url.includes('file_1760163879851_tt3fdqqim9') ||
    url.includes('file_1760263843073_w13593s5t8l') ||
    url.includes('file_1760276276250_3pqeekj048s') ||
    url.includes('file_1760473798652_vm6onvgccj') ||
    // Pattern matching for missing files
    /^file_\d+_[a-z0-9]+\.mp4$/.test(url.split('/').pop() || '') ||
    /^file_\d+_[a-z0-9]+\.png$/.test(url.split('/').pop() || '') ||
    /^file_\d+_[a-z0-9]+\.jpg$/.test(url.split('/').pop() || '') ||
    /^file_\d+_[a-z0-9]+\.jpeg$/.test(url.split('/').pop() || '')
  );
}

// Test with actual URLs from the database
const testUrls = [
  'http://localhost:8000/uploads/talkcart/file_1760472876401_eul3ctkpyr8.mp4',
  'http://localhost:8000/uploads/talkcart/file_1760473798652_vm6onvgccj.mp4',
  'http://localhost:8000/uploads/talkcart/file_1760618426356_5rrpw48tb5b.mp4'
];

console.log('Testing media URL normalization...\n');

testUrls.forEach((url, index) => {
  console.log(`--- Test URL ${index + 1} ---`);
  console.log(`Original URL: ${url}`);
  
  const normalized = normalizeMediaUrl(url, 'video');
  console.log(`Normalized URL: ${normalized}`);
  
  const isMissing = isKnownMissingFile(url);
  console.log(`Is known missing file: ${isMissing}`);
  
  // Check if URL is valid
  const isValid = normalized !== null && (normalized.startsWith('http://') || normalized.startsWith('https://'));
  console.log(`Is valid URL: ${isValid}`);
  
  console.log('');
});

// Test with a Cloudinary URL
const cloudinaryUrl = 'https://res.cloudinary.com/dqhawepog/video/upload/talkcart/some-video.mp4';
console.log('--- Cloudinary URL Test ---');
console.log(`Original URL: ${cloudinaryUrl}`);
const normalizedCloudinary = normalizeMediaUrl(cloudinaryUrl, 'video');
console.log(`Normalized URL: ${normalizedCloudinary}`);
const isMissingCloudinary = isKnownMissingFile(cloudinaryUrl);
console.log(`Is known missing file: ${isMissingCloudinary}`);