import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { Video } from 'lucide-react';
import { normalizeMediaUrl } from '../../utils/mediaUtils';

// Types
interface VideoMediaProps {
  src: string;
  poster?: string;
  alt?: string;
  maxHeight?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

// Enhanced URL validation
const isValidUrl = (urlString: string): boolean => {
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
};

// Check if this is a known missing file
const isKnownMissingFile = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  
  return (
    url.includes('file_1760168733155_lfhjq4ik7ht') ||
    url.includes('file_1760163879851_tt3fdqqim9') ||
    url.includes('file_1760263843073_w13593s5t8l') ||
    url.includes('file_1760276276250_3pqeekj048s') ||
    url.includes('file_1760473798652_vm6onvgccj') ||
    // Pattern matching for missing files
    /^file_\d+_[a-z0-9]+\.mp4$/.test(url.split('/').pop() || '')
  );
};

const UnifiedVideoMedia: React.FC<VideoMediaProps> = ({ 
  src, 
  poster, 
  alt = 'Video content', 
  maxHeight = '500px',
  className,
  style 
}) => {
  const [error, setError] = useState(false);
  const [finalSrc, setFinalSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Normalize the source URL
  const normalizedSrc = normalizeMediaUrl(src, 'video') || src;

  // Validate URL and check for missing files
  useEffect(() => {
    // Check if this is a known missing file
    if (isKnownMissingFile(normalizedSrc)) {
      console.log('🔧 Detected known missing file, using placeholder directly');
      setFinalSrc('/images/placeholder-video-new.png');
      setLoading(false);
      return;
    }
    
    // Validate URL format
    if (normalizedSrc && !isValidUrl(normalizedSrc)) {
      console.warn('❌ Invalid video URL detected:', {
        originalSrc: src,
        normalizedSrc,
        isValid: isValidUrl(normalizedSrc)
      });
      setError(true);
      setLoading(false);
    } else if (normalizedSrc) {
      console.log('✅ Valid video URL detected:', normalizedSrc);
      setFinalSrc(normalizedSrc);
      setLoading(false);
    } else {
      setError(true);
      setLoading(false);
    }
  }, [normalizedSrc, src]);

  // Handle video loading errors
  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.warn('❌ Video loading failed:', {
      normalizedSrc,
      finalSrc,
      errorEvent: e,
      videoElement: e.target
    });
    
    // Set error state to show fallback UI
    setError(true);
  };

  // Handle video loading success
  const handleVideoLoad = () => {
    console.log('✅ Video loaded successfully:', finalSrc);
    setLoading(false);
  };

  // Show error placeholder
  if (error || !normalizedSrc) {
    return (
      <Box 
        className={className}
        sx={{ 
          width: '100%', 
          height: 200, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          bgcolor: 'rgba(0, 0, 0, 0.05)',
          borderRadius: 1,
          ...style
        }}
      >
        <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
          <Video size={32} />
          <Typography variant="body2" sx={{ mt: 1 }}>
            Video content
          </Typography>
        </Box>
      </Box>
    );
  }

  // If we have a final source that looks like a placeholder image, render it as an image
  if (finalSrc && (finalSrc.includes('placeholder') || finalSrc.includes('.png') || finalSrc.includes('.jpg'))) {
    return (
      <Box 
        className={className}
        sx={{ 
          width: '100%', 
          height: 200, 
          position: 'relative', 
          backgroundColor: 'black',
          ...style
        }}
      >
        <img
          src={finalSrc}
          alt={alt}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => {
            console.warn('Placeholder image failed to load:', finalSrc);
            setError(true);
          }}
        />
        <Box 
          sx={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            bgcolor: 'rgba(0, 0, 0, 0.7)',
            borderRadius: '50%',
            p: 1
          }}
        >
          <Video size={24} />
        </Box>
      </Box>
    );
  }

  // If we have a final source, render the video
  if (finalSrc) {
    return (
      <Box 
        className={className}
        sx={{ 
          position: 'relative', 
          width: '100%', 
          backgroundColor: 'black',
          ...style
        }}
      >
        <video
          src={finalSrc}
          controls
          style={{ width: '100%', display: 'block', maxHeight }}
          poster={poster}
          onError={handleVideoError}
          onLoadedData={handleVideoLoad}
        />
        {loading && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
            }}
          >
            <Typography variant="body2" sx={{ color: 'white' }}>
              Loading video...
            </Typography>
          </Box>
        )}
      </Box>
    );
  }

  // Default fallback
  return (
    <Box 
      className={className}
      sx={{ 
        width: '100%', 
        height: 200, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        bgcolor: 'rgba(0, 0, 0, 0.05)',
        borderRadius: 1,
        ...style
      }}
    >
      <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
        <Video size={32} />
        <Typography variant="body2" sx={{ mt: 1 }}>
          Video content
        </Typography>
      </Box>
    </Box>
  );
};

export default UnifiedVideoMedia;