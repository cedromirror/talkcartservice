import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import { PublicFeed } from '@/components/feed/PublicFeed';
import Layout from '@/components/layout/Layout';

const TestPublicFeedPage: React.FC = () => {
  return (
    <Layout>
      <Container maxWidth="md">
        <Box py={4}>
          <Typography variant="h4" gutterBottom>
            Public Feed Test
          </Typography>
          <PublicFeed 
            maxPosts={5}
            sortBy="recent"
          />
        </Box>
      </Container>
    </Layout>
  );
};

export default TestPublicFeedPage;