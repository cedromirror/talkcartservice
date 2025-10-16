import React from 'react';
import { Box, Typography, Container, Card, CardContent } from '@mui/material';
import PostListItem from '@/components/social/new/PostListItem';

const FeedMediaTest: React.FC = () => {
  // Test post with video media
  const testPostWithVideo = {
    id: 'test-video-post',
    author: {
      id: 'user123',
      username: 'testuser',
      displayName: 'Test User',
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    content: 'Check out this awesome video!',
    createdAt: new Date().toISOString(),
    likeCount: 10,
    commentCount: 5,
    shareCount: 2,
    isLiked: false,
    media: [
      {
        id: 'video123',
        public_id: 'talkcart/test-video',
        secure_url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
        resource_type: 'video',
        format: 'mp4'
      }
    ]
  };

  // Test post with image media
  const testPostWithImage = {
    id: 'test-image-post',
    author: {
      id: 'user456',
      username: 'testuser2',
      displayName: 'Test User 2',
      avatar: 'https://i.pravatar.cc/150?img=2'
    },
    content: 'Beautiful landscape photo!',
    createdAt: new Date().toISOString(),
    likeCount: 15,
    commentCount: 3,
    shareCount: 1,
    isLiked: true,
    media: [
      {
        id: 'image123',
        public_id: 'talkcart/test-image',
        secure_url: 'https://sample-videos.com/img/Sample-png-image-100kb.png',
        resource_type: 'image',
        format: 'png'
      }
    ]
  };

  // Test post with multiple media
  const testPostWithMultipleMedia = {
    id: 'test-multi-post',
    author: {
      id: 'user789',
      username: 'testuser3',
      displayName: 'Test User 3',
      avatar: 'https://i.pravatar.cc/150?img=3'
    },
    content: 'Multiple photos from the event!',
    createdAt: new Date().toISOString(),
    likeCount: 25,
    commentCount: 8,
    shareCount: 4,
    isLiked: false,
    media: [
      {
        id: 'image1',
        public_id: 'talkcart/test-image1',
        secure_url: 'https://sample-videos.com/img/Sample-png-image-100kb.png',
        resource_type: 'image',
        format: 'png'
      },
      {
        id: 'image2',
        public_id: 'talkcart/test-image2',
        secure_url: 'https://sample-videos.com/img/Sample-jpg-image-100kb.jpg',
        resource_type: 'image',
        format: 'jpg'
      },
      {
        id: 'image3',
        public_id: 'talkcart/test-image3',
        secure_url: 'https://sample-videos.com/img/Sample-jpg-image-200kb.jpg',
        resource_type: 'image',
        format: 'jpg'
      },
      {
        id: 'image4',
        public_id: 'talkcart/test-image4',
        secure_url: 'https://sample-videos.com/img/Sample-png-image-200kb.png',
        resource_type: 'image',
        format: 'png'
      }
    ]
  };

  // Test post with missing media
  const testPostWithMissingMedia = {
    id: 'test-missing-post',
    author: {
      id: 'user999',
      username: 'testuser4',
      displayName: 'Test User 4',
      avatar: 'https://i.pravatar.cc/150?img=4'
    },
    content: 'This post has a missing video file',
    createdAt: new Date().toISOString(),
    likeCount: 5,
    commentCount: 1,
    shareCount: 0,
    isLiked: false,
    media: [
      {
        id: 'missing123',
        public_id: 'talkcart/missing-video',
        secure_url: 'http://localhost:8000/uploads/talkcart/file_1760473798652_vm6onvgccj.mp4',
        resource_type: 'video',
        format: 'mp4'
      }
    ]
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Feed Media Display Test
      </Typography>
      
      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        1. Post with Video
      </Typography>
      <Card sx={{ mb: 4 }}>
        <PostListItem 
          post={testPostWithVideo} 
          onBookmark={(id) => console.log('Bookmark post:', id)}
          onLike={(id) => console.log('Like post:', id)}
          onShare={(id) => console.log('Share post:', id)}
          onComment={(id) => console.log('Comment on post:', id)}
        />
      </Card>
      
      <Typography variant="h6" gutterBottom>
        2. Post with Image
      </Typography>
      <Card sx={{ mb: 4 }}>
        <PostListItem 
          post={testPostWithImage} 
          onBookmark={(id) => console.log('Bookmark post:', id)}
          onLike={(id) => console.log('Like post:', id)}
          onShare={(id) => console.log('Share post:', id)}
          onComment={(id) => console.log('Comment on post:', id)}
        />
      </Card>
      
      <Typography variant="h6" gutterBottom>
        3. Post with Multiple Media
      </Typography>
      <Card sx={{ mb: 4 }}>
        <PostListItem 
          post={testPostWithMultipleMedia} 
          onBookmark={(id) => console.log('Bookmark post:', id)}
          onLike={(id) => console.log('Like post:', id)}
          onShare={(id) => console.log('Share post:', id)}
          onComment={(id) => console.log('Comment on post:', id)}
        />
      </Card>
      
      <Typography variant="h6" gutterBottom>
        4. Post with Missing Media
      </Typography>
      <Card sx={{ mb: 4 }}>
        <PostListItem 
          post={testPostWithMissingMedia} 
          onBookmark={(id) => console.log('Bookmark post:', id)}
          onLike={(id) => console.log('Like post:', id)}
          onShare={(id) => console.log('Share post:', id)}
          onComment={(id) => console.log('Comment on post:', id)}
        />
      </Card>
    </Container>
  );
};

export default FeedMediaTest;