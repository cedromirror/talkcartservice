import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  useTheme,
} from '@mui/material';
import { PostListItem } from '@/components/social/new/PostListItem';
import { api } from '@/lib/api';
import { Post } from '@/types/social';

interface PublicFeedProps {
  showHeader?: boolean;
  maxPosts?: number;
  contentFilter?: 'all' | 'text' | 'media' | 'links';
  sortBy?: 'recent' | 'popular' | 'trending';
}

/**
 * PublicFeed component displays public posts for visitors
 * Shows what the platform has to offer without requiring authentication
 */
export const PublicFeed: React.FC<PublicFeedProps> = ({
  showHeader = true,
  maxPosts = 10,
  contentFilter = 'all',
  sortBy = 'recent'
}) => {
  const theme = useTheme();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch public posts from the API
    const fetchPublicPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Prepare API parameters
        const params: any = {
          limit: maxPosts,
          sortBy: sortBy
        };
        
        // Apply content filter if specified
        if (contentFilter !== 'all') {
          params.contentType = contentFilter;
        }
        
        // Fetch public posts from the API
        const response: any = await api.posts.getPublicPosts(params);
        
        if (response?.success && response?.data?.posts) {
          // Ensure posts have required properties
          const postsWithDefaults = response.data.posts.map((post: any) => ({
            ...post,
            type: post.type || (post.media && post.media.length > 0 ? 
              (post.media[0]?.resource_type === 'video' ? 'video' : 
               post.media[0]?.resource_type === 'image' ? 'image' : 'text') : 'text'),
            views: post.views || 0,
            likes: post.likes || post.likeCount || 0,
            comments: post.comments || post.commentCount || 0,
            shares: post.shares || post.shareCount || 0,
            // Ensure media array is properly structured
            media: Array.isArray(post.media) ? post.media.map((media: any) => ({
              ...media,
              resource_type: media.resource_type || 'image',
              secure_url: media.secure_url || media.url || '',
            })) : []
          }));
          
          setPosts(postsWithDefaults);
        } else {
          throw new Error(response?.message || 'Failed to fetch public posts');
        }
      } catch (err: any) {
        console.error('Error fetching public posts:', err);
        setError(err.message || 'Failed to load public posts. Please try again later.');
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPublicPosts();
  }, [maxPosts, contentFilter, sortBy]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      {showHeader && (
        <Box mb={3}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Public Feed
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Recent posts from our community
          </Typography>
        </Box>
      )}

      {posts.length === 0 ? (
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          minHeight={200}
          textAlign="center"
        >
          <Box>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No public posts available
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Be the first to share something with the community!
            </Typography>
          </Box>
        </Box>
      ) : (
        <Box display="flex" flexDirection="column" gap={2}>
          {posts.map((post) => (
            <PostListItem 
              key={post.id} 
              post={post} 
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default PublicFeed;