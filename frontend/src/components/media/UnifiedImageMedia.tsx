import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { Image as ImageIcon } from 'lucide-react';
import { normalizeMediaUrl } from '../../utils/mediaUtils';

// Types
interface ImageMediaProps {
  src: string;
  alt?: string;
  maxHeight?: string | number;
  className?: string;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
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
    /^file_\d+_[a-z0-9]+\.mp4$/.test(url.split('/').pop() || '') ||
    /^file_\d+_[a-z0-9]+\.png$/.test(url.split('/').pop() || '') ||
    /^file_\d+_[a-z0-9]+\.jpg$/.test(url.split('/').pop() || '') ||
    /^file_\d+_[a-z0-9]+\.jpeg$/.test(url.split('/').pop() || '')
  );
};

const UnifiedImageMedia: React.FC<ImageMediaProps> = ({ 
  src, 
  alt = 'Image content', 
  maxHeight = '500px',
  className,
  style,
  onLoad,
  onError
}) => {
  const [error, setError] = useState(false);
  const [finalSrc, setFinalSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Normalize the source URL
  const normalizedSrc = normalizeMediaUrl(src, 'image') || src;

  // Validate URL and check for missing files
  useEffect(() => {
    // Check if this is a known missing file
    if (isKnownMissingFile(normalizedSrc)) {
      console.log('🔧 Detected known missing file, using placeholder directly');
      setFinalSrc('/images/placeholder-image-new.png');
      setLoading(false);
      return;
    }
    
    // Validate URL format
    if (normalizedSrc && !isValidUrl(normalizedSrc)) {
      console.warn('❌ Invalid image URL detected:', {
        originalSrc: src,
        normalizedSrc,
        isValid: isValidUrl(normalizedSrc)
      });
      setError(true);
      setLoading(false);
    } else if (normalizedSrc) {
      console.log('✅ Valid image URL detected:', normalizedSrc);
      setFinalSrc(normalizedSrc);
      setLoading(false);
    } else {
      setError(true);
      setLoading(false);
    }
  }, [normalizedSrc, src]);

  // Handle image loading errors
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.warn('❌ Image loading failed:', {
      normalizedSrc,
      finalSrc,
      errorEvent: e,
      imageElement: e.target
    });
    
    // Set error state to show fallback UI
    setError(true);
    onError?.();
  };

  // Handle image loading success
  const handleImageLoad = () => {
    console.log('✅ Image loaded successfully:', finalSrc);
    setLoading(false);
    onLoad?.();
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
          <ImageIcon size={32} />
          <Typography variant="body2" sx={{ mt: 1 }}>
            Image content
          </Typography>
        </Box>
      </Box>
    );
  }

  // If we have a final source that looks like a placeholder image, render it directly
  if (finalSrc) {
    return (
      <Box 
        className={className}
        sx={{ 
          width: '100%',
          ...style
        }}
      >
        <img
          src={finalSrc}
          alt={alt}
          loading="lazy"
          style={{ width: '100%', display: 'block', maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight, objectFit: 'cover' }}
          onError={handleImageError}
          onLoad={handleImageLoad}
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
              Loading image...
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
        <ImageIcon size={32} />
        <Typography variant="body2" sx={{ mt: 1 }}>
          Image content
        </Typography>
      </Box>
    </Box>
  );
};

export default UnifiedImageMedia;