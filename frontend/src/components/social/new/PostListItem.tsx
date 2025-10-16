import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, IconButton, Button } from '@mui/material';
import { Heart, MessageSquare, Share, Bookmark, Video, Image as ImageIcon } from 'lucide-react';
import UserAvatar from '@/components/common/UserAvatar';
import { formatDistanceToNow, parseISO } from 'date-fns';
import UnifiedVideoMedia from '@/components/media/UnifiedVideoMedia';
import UnifiedImageMedia from '@/components/media/UnifiedImageMedia';
import { normalizeMediaUrl, isKnownMissingFile } from '@/utils/mediaUtils';



// Separate component for grid media with enhanced error handling
const GridMedia: React.FC<{ 
  mediaItem: any; 
  content?: string;
}> = ({ mediaItem, content }) => {
  // Normalize the media URL with better error handling
  const mediaUrl = mediaItem.secure_url || mediaItem.url;
  
  // Check if this is a known missing file
  const isMissingFile = mediaUrl && typeof mediaUrl === 'string' && isKnownMissingFile(mediaUrl);
  
  if (isMissingFile) {
    // For missing files, use placeholder directly
    if (mediaItem.resource_type === 'video') {
      return (
        <UnifiedVideoMedia 
          src="/images/placeholder-video-new.png" 
          alt={content || 'Video content'} 
          maxHeight="150px"
        />
      );
    } else {
      return (
        <UnifiedImageMedia 
          src="/images/placeholder-image-new.png" 
          alt={content || 'Image content'} 
          maxHeight="150px"
        />
      );
    }
  }
  
  // For valid media URLs, use the unified components
  if (mediaItem.resource_type === 'video') {
    return (
      <UnifiedVideoMedia 
        src={mediaUrl} 
        poster={mediaItem.thumbnail || mediaItem.thumbnail_url}
        alt={content || 'Video content'} 
        maxHeight="150px"
      />
    );
  } else {
    return (
      <UnifiedImageMedia 
        src={mediaUrl} 
        alt={content || 'Image content'} 
        maxHeight="150px"
      />
    );
  }
};

interface MediaItem {
  id?: string;
  url?: string;
  secure_url?: string;
  resource_type?: string;
  thumbnail?: string;
  thumbnail_url?: string;
}

interface PostListItemProps {
  post: {
    id: string;
    author?: {
      id: string;
      username?: string;
      displayName?: string;
      avatar?: string;
    };
    content?: string;
    media?: MediaItem[];
    createdAt?: string;
    likeCount?: number;
    commentCount?: number;
    shareCount?: number;
    isLiked?: boolean;
  };
  onBookmark?: (postId: string) => void;
  onLike?: (postId: string) => void;
  onShare?: (postId: string) => void;
  onComment?: (postId: string) => void;
}

const PostListItem: React.FC<PostListItemProps> = ({ post, onBookmark, onLike, onShare, onComment }) => {
  const createdLabel = post.createdAt ? formatDistanceToNow(parseISO(post.createdAt), { addSuffix: true }) : '';
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set isClient to true only on the client side to prevent hydration errors
    setIsClient(true);
  }, []);

  const isValidMediaUrl = (url?: string, resourceType?: string) => {
    if (!url) return false;
    const normalizedUrl = normalizeMediaUrl(url, resourceType);
    // Additional check for valid URL format
    return normalizedUrl !== null && (normalizedUrl.startsWith('http://') || normalizedUrl.startsWith('https://'));
  };

  const getValidMediaUrl = (mediaItem: MediaItem) => {
    const url = mediaItem.secure_url || mediaItem.url;
    if (!url) return null;
    
    // Special handling for local development URLs
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 Processing media URL:', {
        originalUrl: url,
        mediaItem
      });
    }
    
    return normalizeMediaUrl(url, mediaItem.resource_type);
  };

  // Function to render media content
  const renderMediaContent = (mediaItem: MediaItem) => {
    const mediaUrl = getValidMediaUrl(mediaItem);
    
    // Check if this is a known missing file
    const isMissingFile = mediaUrl && typeof mediaUrl === 'string' && isKnownMissingFile(mediaUrl);
    
    // Enhanced validation
    const isMediaUrlValid = mediaUrl && (mediaUrl.startsWith('http://') || mediaUrl.startsWith('https://'));
    
    if (!isMediaUrlValid || isMissingFile) {
      // For missing files or invalid URLs, use placeholders directly
      if (mediaItem.resource_type === 'video') {
        return (
          <UnifiedVideoMedia 
            src="/images/placeholder-video-new.png" 
            alt={post.content || 'Video content'} 
            maxHeight="200px"
          />
        );
      } else {
        return (
          <UnifiedImageMedia 
            src="/images/placeholder-image-new.png" 
            alt={post.content || 'Image content'} 
            maxHeight="200px"
          />
        );
      }
    }

    if (mediaItem.resource_type === 'video') {
      // Only render video element on client side to prevent hydration errors
      if (!isClient) {
        return (
          <Box sx={{ 
            width: '100%', 
            height: 200, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            bgcolor: 'rgba(0, 0, 0, 0.1)',
            borderRadius: 1
          }}>
            <Video size={32} />
          </Box>
        );
      }
      
      return <UnifiedVideoMedia src={mediaUrl} poster={mediaItem.thumbnail || mediaItem.thumbnail_url} alt={post.content || 'Video content'} maxHeight="200px" />;
    } else {
      // Only render image element on client side to prevent hydration errors
      if (!isClient) {
        return (
          <Box sx={{ 
            width: '100%', 
            height: 200, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            bgcolor: 'rgba(0, 0, 0, 0.05)',
            borderRadius: 1
          }}>
            <ImageIcon size={32} color="#666" />
          </Box>
        );
      }
      
      return <UnifiedImageMedia src={mediaUrl} alt={post.content || 'Image content'} maxHeight="200px" />;
    }
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <UserAvatar src={post.author?.avatar} alt={post.author?.username || ''} size={36} />
          <Box>
            <Typography variant="subtitle2">{post.author?.displayName || post.author?.username}</Typography>
            {createdLabel && (
              <Typography variant="caption" color="text.secondary">{createdLabel}</Typography>
            )}
          </Box>
        </Box>

        {post.content && (
          <Typography variant="body1" sx={{ mb: 1 }}>
            {post.content}
          </Typography>
        )}

        {Array.isArray(post.media) && post.media.length > 0 && (
          <Box sx={{ borderRadius: 1, overflow: 'hidden', bgcolor: 'background.default', border: '1px solid', borderColor: 'divider', mb: 1 }}>
            {(() => {
              const validMedia = post.media.filter(m => isValidMediaUrl(m.secure_url || m.url, m.resource_type));
              if (validMedia.length === 1) {
                const mediaItem = validMedia[0];
                return mediaItem ? renderMediaContent(mediaItem) : null;
              } else {
                return (
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
                    {validMedia.slice(0, 4).map((m, idx) => (
                      <Box key={m.id || idx} sx={{ position: 'relative' }}>
                        {!isClient ? (
                          // Render placeholder on server side to prevent hydration errors
                          <Box sx={{ 
                            width: '100%', 
                            height: 150, 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            bgcolor: 'rgba(0, 0, 0, 0.05)'
                          }}>
                            {m.resource_type === 'video' ? <Video size={24} color="#666" /> : <ImageIcon size={24} color="#666" />}
                          </Box>
                        ) : (
                          // Additional validation before rendering GridMedia
                          isValidMediaUrl(m.secure_url || m.url, m.resource_type) ? (
                            <GridMedia mediaItem={m} content={post.content} />
                          ) : (
                            <Box 
                              sx={{ 
                                width: '100%', 
                                height: '150px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                bgcolor: 'rgba(0, 0, 0, 0.05)'
                              }}
                            >
                              <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
                                {m.resource_type === 'video' ? <Video size={24} /> : <ImageIcon size={24} />}
                                <Typography variant="body2" sx={{ mt: 1, fontSize: '0.75rem' }}>
                                  Media content
                                </Typography>
                              </Box>
                            </Box>
                          )
                        )}
                      </Box>
                    ))}
                  </Box>
                );
              }
            })()}
          </Box>
        )}

        <Box display="flex" alignItems="center" gap={1}>
          <IconButton size="small" onClick={() => onLike?.(post.id)} aria-label="like" color={post.isLiked ? 'error' : 'default'}>
            <Heart size={16} />
          </IconButton>
          <Typography variant="caption">{post.likeCount || 0}</Typography>

          <IconButton size="small" onClick={() => onComment?.(post.id)} aria-label="comment">
            <MessageSquare size={16} />
          </IconButton>
          <Typography variant="caption">{post.commentCount || 0}</Typography>

          <IconButton size="small" onClick={() => onShare?.(post.id)} aria-label="share">
            <Share size={16} />
          </IconButton>
          <Typography variant="caption">{post.shareCount || 0}</Typography>

          <Box flex={1} />

          <Button size="small" startIcon={<Bookmark size={14} />} onClick={() => onBookmark?.(post.id)}>
            Save
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PostListItem;
export { PostListItem };