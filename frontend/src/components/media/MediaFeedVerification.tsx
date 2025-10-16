import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Card, CardContent, Button } from '@mui/material';
import PostListItem from '@/components/social/new/PostListItem';

const MediaFeedVerification: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Sample test data to verify media display
  const samplePosts = [
    // Post with valid video
    {
      id: '1',
      author: {
        id: 'user1',
        username: 'videouser',
        displayName: 'Video Poster',
        avatar: 'https://i.pravatar.cc/150?img=1'
      },
      content: 'Check out this awesome video!',
      createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      likeCount: 25,
      commentCount: 5,
      shareCount: 3,
      isLiked: false,
      media: [
        {
          id: 'video1',
          public_id: 'talkcart/sample-video',
          secure_url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
          resource_type: 'video',
          format: 'mp4'
        }
      ]
    },
    // Post with valid image
    {
      id: '2',
      author: {
        id: 'user2',
        username: 'imageuser',
        displayName: 'Image Poster',
        avatar: 'https://i.pravatar.cc/150?img=2'
      },
      content: 'Beautiful sunset photo from yesterday!',
      createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
      likeCount: 42,
      commentCount: 8,
      shareCount: 7,
      isLiked: true,
      media: [
        {
          id: 'image1',
          public_id: 'talkcart/sample-image',
          secure_url: 'https://sample-videos.com/img/Sample-jpg-image-100kb.jpg',
          resource_type: 'image',
          format: 'jpg'
        }
      ]
    },
    // Post with multiple images
    {
      id: '3',
      author: {
        id: 'user3',
        username: 'multiuser',
        displayName: 'Multi Media User',
        avatar: 'https://i.pravatar.cc/150?img=3'
      },
      content: 'Our weekend trip photos!',
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      likeCount: 128,
      commentCount: 24,
      shareCount: 15,
      isLiked: false,
      media: [
        {
          id: 'image2',
          public_id: 'talkcart/trip-image1',
          secure_url: 'https://sample-videos.com/img/Sample-png-image-100kb.png',
          resource_type: 'image',
          format: 'png'
        },
        {
          id: 'image3',
          public_id: 'talkcart/trip-image2',
          secure_url: 'https://sample-videos.com/img/Sample-jpg-image-200kb.jpg',
          resource_type: 'image',
          format: 'jpg'
        },
        {
          id: 'image4',
          public_id: 'talkcart/trip-image3',
          secure_url: 'https://sample-videos.com/img/Sample-png-image-200kb.png',
          resource_type: 'image',
          format: 'png'
        }
      ]
    },
    // Post with missing media (should show placeholder)
    {
      id: '4',
      author: {
        id: 'user4',
        username: 'missinguser',
        displayName: 'Missing Media User',
        avatar: 'https://i.pravatar.cc/150?img=4'
      },
      content: 'This post has a missing video file that should show a placeholder',
      createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      likeCount: 5,
      commentCount: 1,
      shareCount: 0,
      isLiked: false,
      media: [
        {
          id: 'missing1',
          public_id: 'talkcart/missing-video',
          secure_url: 'http://localhost:8000/uploads/talkcart/file_1760473798652_vm6onvgccj.mp4',
          resource_type: 'video',
          format: 'mp4'
        }
      ]
    }
  ];

  useEffect(() => {
    // Simulate loading posts from API
    setTimeout(() => {
      setPosts(samplePosts);
      setLoading(false);
    }, 1000);
  }, []);

  const handleLike = (postId: string) => {
    console.log('Liked post:', postId);
    // In a real app, this would make an API call
  };

  const handleComment = (postId: string) => {
    console.log('Commented on post:', postId);
    // In a real app, this would open the comment section
  };

  const handleShare = (postId: string) => {
    console.log('Shared post:', postId);
    // In a real app, this would open the share dialog
  };

  const handleBookmark = (postId: string) => {
    console.log('Bookmarked post:', postId);
    // In a real app, this would make an API call
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Media Feed Verification
      </Typography>
      <Typography variant="h6" gutterBottom align="center" color="text.secondary" sx={{ mb: 4 }}>
        Verifying that video and image content is displayed correctly in feed posts
      </Typography>
      
      {loading ? (
        <Typography variant="body1" align="center">
          Loading sample posts...
        </Typography>
      ) : (
        <>
          <Box sx={{ mb: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Verification Checklist
                </Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                  <li>
                    <Typography variant="body1">
                      ✅ Video posts should display playable video content
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      ✅ Image posts should display image content
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      ✅ Multiple media posts should display in a grid
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      ✅ Missing media should show professional placeholders instead of error messages
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      ✅ No hydration errors should occur
                    </Typography>
                  </li>
                </Box>
              </CardContent>
            </Card>
          </Box>
          
          {posts.map((post) => (
            <Box key={post.id} sx={{ mb: 3 }}>
              <PostListItem
                post={post}
                onLike={handleLike}
                onComment={handleComment}
                onShare={handleShare}
                onBookmark={handleBookmark}
              />
            </Box>
          ))}
          
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Test Results
              </Typography>
              <Typography variant="body1" paragraph>
                If you can see all four sample posts above with their respective media content:
              </Typography>
              <Box component="ul" sx={{ pl: 2 }}>
                <li>
                  <Typography variant="body1">
                    ✅ Video post with playable video
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    ✅ Image post with visible image
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    ✅ Multi-media post with grid layout
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    ✅ Missing media post with professional placeholder
                  </Typography>
                </li>
              </Box>
              <Typography variant="body1" paragraph>
                Then the media content is correctly displayed in feed posts and all fixes have been successfully implemented.
              </Typography>
            </CardContent>
          </Card>
        </>
      )}
    </Container>
  );
};

export default MediaFeedVerification;