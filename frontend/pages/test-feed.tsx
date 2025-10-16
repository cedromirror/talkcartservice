import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import FeedMediaTest from '@/components/media/FeedMediaTest';

const TestFeedPage: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom align="center">
        Media Feed Display Test
      </Typography>
      <Typography variant="h6" gutterBottom align="center" color="text.secondary">
        Verifying that video and image content is displayed correctly in feed posts
      </Typography>
      
      <FeedMediaTest />
    </Container>
  );
};

export default TestFeedPage;